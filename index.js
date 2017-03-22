class PasswordGenerator {
    constructor(options, randomFunction) {
        this._options = Object.assign({
            length: 25,
            uppercase: true,
            lowercase: true,
            digits: true,
            symbols: true,
            obscureSymbols: true,
            extra: ''
        }, options)
        this._random = randomFunction || Math.random
    }

    set options(options) {
        this._options = Object.assign(this._options, options)
    }

    set randomFunction(f) {
        this._random = f
    }

    _generateCharacters(options) {
        let characters = ''
        if (options.uppercase !== false) characters += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        if (options.lowercase !== false) characters += 'abcdefghijklmnopqrstuvwxyz'
        if (options.digits !== false) characters += '0123456789'
        if (options.symbols !== false) characters += '§!@#¤$%€&/{}()[]=+?<>|-_*^~¨,;.:'
        if (options.obscureSymbols !== false) characters += 'ł®þ←¡£«»©¥“”¸¶·½'
        characters += options.extra

        return characters.split('')
    }

    generatePassword(options, randomFunction = this._random) {
        let password = ''
        this._generatePassword(options, randomFunction, (characters, random) => {
            password += this._randomFromArray(characters, random())
        })

        return password

    }

    static generatePassword(options, randomFunction) {
        let passwordGenerator = new PasswordGenerator()
        return passwordGenerator.generatePassword(...arguments)
    }

    generatePasswordAsync(options, randomFunction = (c => c(this._random())), callback) {
        let chars = []
        let generator = Promise.resolve()
        this._generatePassword(options, randomFunction, (characters, random) => {
            generator = generator
                .then(this._promiseOrCallback.bind(this, random))
                .then(this._randomFromArray.bind(this, characters))
                .then(chars.push.bind(chars))
        })

        return generator
            .then(chars.join.bind(chars, ''))
            .then(password => {
                callback && callback(password)
                return password
            })
    }

    _generatePassword(options, randomFunction, f) {
        options = Object.assign(this._options, options)
        let random = randomFunction
        let characters = this._generateCharacters(options)

        for (let i=0; i<options.length; i++) {
            f(characters, random)
        }
    }

    static generatePasswordAsync(options, randomFunction, callback) {
        let passwordGenerator = new PasswordGenerator()
        return passwordGenerator.generatePasswordAsync(...arguments)
    }

    _randomFromArray(array, random) {
        let n = Math.floor(random * array.length)
        return array[n]
    }

    _promiseOrCallback(f) {
        return new Promise((resolve, reject) => {
            let promiseCheck = result => typeof result !== 'undefined'
                && typeof result.then === 'function'
            let a = {}
            a.maybePromise = f(function() {
                if (!promiseCheck(a.maybePromise)) {
                    resolve(...arguments)
                }
            })
            if (promiseCheck(a.maybePromise)) {
                resolve(a.maybePromise)
            }
        })
    }

    static generatePasswordFromWords(numberOfWords = 5, language = 'english') {
        let languages = {}
        if (typeof window === 'undefined') {
            languages.english = require('./words/english.js')
            languages.spanish = require('./words/spanish.js')
        } else {
            languages.english = englishWords
            languages.spanish = spanishWords
        }
        let words = languages[language]

        let password = ''
        for (let i=0; i<numberOfWords; i++) {
            password += this._randomFromArray(words, Math.random())
        }

        return password
    }
}

if (typeof window === 'undefined') {
    module.exports = PasswordGenerator
}

