
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

    generatePassword(options, randomFunction) {
        options = Object.assign(this._options, options)
        let random = randomFunction || this._random
        let characters = this._generateCharacters(options)

        let password = ''
        for (let i=0; i<options.length; i++) {
            let character = Math.floor(random() * characters.length)
            password += characters[character]
        }

        return password
    }

    static generatePassword(options, randomFunction) {
        let passwordGenerator = new PasswordGenerator()
        return passwordGenerator.generatePassword(...arguments)
    }

    generatePasswordAsync(options, randomFunction, callback) {
        options = Object.assign(this._options, options)
        let random = randomFunction || this._random
        let characters = this._generateCharacters(options)

        return new Promise((resolve, reject) => {
            this._generatePasswordAsync(options.length, '', characters, random,
                    password => {
                resolve(password)
                callback && callback(password)
            })
        })
    }

    static generatePasswordAsync(options, randomFunction, callback) {
        let passwordGenerator = new PasswordGenerator()
        return passwordGenerator.generatePasswordAsync(...arguments)
    }

    _generatePasswordAsync(i, password, characters, randomFunction, callback) {
        if (i === 0) {
            callback(password)
        } else {
            randomFunction(random => {
                let character = Math.floor(random * characters.length)
                password += characters[character]
                this._generatePasswordAsync(--i, password, characters,
                    randomFunction, callback)
            })
        }
    }
}

if (typeof window === 'undefined') {
    module.exports = PasswordGenerator
}

