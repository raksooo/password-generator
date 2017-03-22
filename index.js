class PasswordGenerator {
    constructor(options, random) {
        this._options = Object.assign({
            length: 25,
            uppercase: true,
            lowercase: true,
            digits: true,
            symbols: true,
            obscureSymbols: true,
            extra: ''
        }, options)
        this._random = random || Math.random
    }

    set options(options) {
        this._options = Object.assign(this._options, options)
    }

    set random(f) {
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

    generatePassword(options, random = this._random, callback) {
        let sync = false
        try {
            sync = typeof random() === 'number'
        } catch(e) { }

        return sync ? this._generatePasswordSync(options, random)
            : this._generatePasswordAsync(options, random, callback)
    }

    _generatePasswordSync(options, random) {
        let chars = []
        this._generatePassword(options, random, (characters, random) => {
            chars.push(this._randomFromArray(characters, random()))
        })

        return chars.join('')
    }

    _generatePasswordAsync(options, random, callback) {
        let chars = []
        let generator = Promise.resolve()
        this._generatePassword(options, random, (characters, random) => {
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

    _generatePassword(options, random, f) {
        options = Object.assign(this._options, options)
        let characters = this._generateCharacters(options)

        for (let i=0; i<options.length; i++) {
            f(characters, random)
        }
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

    static generatePassword(options, random) {
        let passwordGenerator = new PasswordGenerator()
        return passwordGenerator.generatePassword(...arguments)
    }

    static generatePasswordAsync(options, random, callback) {
        let passwordGenerator = new PasswordGenerator()
        return passwordGenerator.generatePasswordAsync(...arguments)
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

