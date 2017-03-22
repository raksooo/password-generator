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
        Object.assign(this._options, options)
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
            sync = typeof random(() => {}) === 'number'
        } catch(e) { }

        return sync ? this._generatePasswordSync(options, random)
            : this._generatePasswordAsync(options, random, callback)
    }

    _generatePassword(options, random, f) {
        options = Object.assign({}, this._options, options)
        let characters = this._generateCharacters(options)
        for (let i=0; i<options.length; i++) {
            f(characters, random)
        }
    }

    _generatePasswordSync(options, random) {
        let password = ''
        this._generatePassword(options, random, (characters, random) => {
            password += this._randomFromArray(characters, random())
        })
        return password
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

    _randomFromArray(array, random) {
        let n = Math.floor(random * array.length)
        return array[n]
    }

    _promiseOrCallback(f) {
        return new Promise((resolve, reject) => {
            let a = {}
            a.promise = f(random => this._isPromise(a.promise) || resolve(random))
            this._isPromise(a.promise) && resolve(a.promise)
        })
    }

    _isPromise(promise) {
        return typeof promise !== 'undefined' && typeof promise.then === 'function'
    }

    static generatePassword(options, random, callback) {
        let passwordGenerator = new PasswordGenerator()
        return passwordGenerator.generatePassword(...arguments)
    }

    static generatePasswordFromWords(numberOfWords = 5, language = 'english') {
        let words
        if (typeof window === 'undefined') {
            words = require('./words/' + language + '.js')
        } else {
            words = window[language + 'Words']
        }

        let password = ''
        for (let i=0; i<numberOfWords; i++) {
            let n = Math.floor(Math.random() * words.length)
            password += words[n]
        }

        return password
    }
}

if (typeof window === 'undefined') {
    module.exports = PasswordGenerator
}

