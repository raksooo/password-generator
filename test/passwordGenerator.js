const expect = require('chai').expect,
      PasswordGenerator = require('../index')

describe('Generate passwords', function() {
    describe('Synchronously', function() {
        before(function() {
            this.generator = new PasswordGenerator({ length: 25 })
        })

        it('should generate a string with correct length', function() {
            let password = this.generator.generatePassword()
            expect(password).to.be.a('string')
            expect(password).to.have.length(25)
        })

        it('should generate two strings which are not equal', function() {
            let password1 = this.generator.generatePassword()
            let password2 = this.generator.generatePassword()
            expect(password1).to.not.equal(password2)
        })

        it('should generate a string with supplied "random" function', function() {
            let password = this.generator.generatePassword({}, () => 0)
            let array = password.split('')
            array.forEach((c) => {
                expect(c).to.equal(array[0])
            })
        })

        it('should generate an empty password', function() {
            let password = this.generator.generatePassword({ length: 0 })
            expect(password).to.be.a('string')
            expect(password).to.have.length(0)
        })
    })

    describe('Asynchronously', function() {
        let random = callback => callback(Math.random())
        before(function() {
            this.generator = new PasswordGenerator({ length: 25 })
        })

        it('should generate a string with correct length and send it to callback', function(done) {
            this.generator.generatePassword({}, random, password => {
                expect(password).to.be.a('string')
                expect(password).to.have.length(25)
                done()
            }).catch(console.error.bind(console))
        })

        it('should generate a string with correct length and resolve promise with it', function(done) {
            this.generator.generatePassword({}, random)
                .then(password => {
                    expect(password).to.be.a('string')
                    expect(password).to.have.length(25)
                    done()
                })
        })

        it('should generate two strings which are not equal', function(done) {
            let password1
            this.generator.generatePassword({}, random)
                .then(password => {
                    password1 = password
                    return this.generator.generatePassword({}, random)
                }).then(password2 => {
                    expect(password1).to.not.equal(password2)
                    done()
                })
        })

        it('should generate a string with supplied "random" function', function(done) {
            this.generator.generatePassword({}, callback => callback(0))
                .then(password => {
                    expect(password).to.have.length(25)
                    let array = password.split('')
                    array.forEach((c) => {
                        expect(c).to.equal(array[0])
                    })
                    done()
                })
        })

        it('should generate a string with supplied "random" function which returns a promise', function(done) {
            this.generator.generatePassword({}, () => Promise.resolve(0))
                .then(password => {
                    expect(password).to.have.length(25)
                    let array = password.split('')
                    array.forEach((c) => {
                        expect(c).to.equal(array[0])
                    })
                    done()
                })
        })

        it('should generate an empty password', function(done) {
            let password = this.generator.generatePassword({ length: 0 }, random)
                .then(password => {
                    expect(password).to.be.a('string')
                    expect(password).to.have.length(0)
                    done()
                })
        })

        it('should only use the random result from the promise if it supports both', function(done) {
            this.generator.generatePassword({ }, callback => {
                return new Promise((resolve, reject) => {
                    let random = Math.random()
                    callback(random)
                    resolve(random)
                })
            }).then(password => {
                expect(password).to.have.length(25)
                done()
            }).catch(console.error.bind(console))
        })
    })

    describe('Options', function() {
        describe('In constructor', function() {
            it('should have specified length', function() {
                let length = 50
                let passwordGenerator = new PasswordGenerator({ length })
                let password = passwordGenerator.generatePassword()
                expect(password).to.have.length(length)
            })

            it('should have no uppercase characters', function() {
                let passwordGenerator = new PasswordGenerator({ uppercase: false })
                let password = passwordGenerator.generatePassword()
                for (let i=0; i<password.length; i++) {
                    expect(password.charCodeAt(i)).to.not.be.within(65, 90)
                }
            })

            it('should have no lowercase characters', function() {
                let passwordGenerator = new PasswordGenerator({ lowercase: false })
                let password = passwordGenerator.generatePassword()
                for (let i=0; i<password.length; i++) {
                    expect(password.charCodeAt(i)).to.not.be.within(97, 122)
                }
            })

            it('should have no digits', function() {
                let passwordGenerator = new PasswordGenerator({ digits: false })
                let password = passwordGenerator.generatePassword()
                for (let i=0; i<password.length; i++) {
                    expect(password.charCodeAt(i)).to.not.be.within(48, 57)
                }
            })

            it('should have only letters', function() {
                let options = { symbols: false, obscureSymbols: false, digits: false }
                let passwordGenerator = new PasswordGenerator(options)
                let password = passwordGenerator.generatePassword()
                for (let i=0; i<password.length; i++) {
                    expect(password.charCodeAt(i)).to.not.be.below(65)
                    expect(password.charCodeAt(i)).to.not.be.within(91, 96)
                    expect(password.charCodeAt(i)).to.not.be.above(122)
                }
            })
        })

        describe('In function call', function() {
            it('should have specified length', function() {
                let length = 50
                let password = PasswordGenerator.generatePassword({ length })
                expect(password).to.have.length(length)
            })

            it('should have no uppercase characters', function() {
                let password = PasswordGenerator.generatePassword({ uppercase: false })
                for (let i=0; i<password.length; i++) {
                    expect(password.charCodeAt(i)).to.not.be.within(65, 90)
                }
            })

            it('should have no lowercase characters', function() {
                let password = PasswordGenerator.generatePassword({ lowercase: false })
                for (let i=0; i<password.length; i++) {
                    expect(password.charCodeAt(i)).to.not.be.within(97, 122)
                }
            })

            it('should have no digits', function() {
                let password = PasswordGenerator.generatePassword({ digits: false })
                for (let i=0; i<password.length; i++) {
                    expect(password.charCodeAt(i)).to.not.be.within(48, 57)
                }
            })

            it('should have only letters', function() {
                let options = { symbols: false, obscureSymbols: false, digits: false }
                let password = PasswordGenerator.generatePassword(options)
                for (let i=0; i<password.length; i++) {
                    expect(password.charCodeAt(i)).to.not.be.below(65)
                    expect(password.charCodeAt(i)).to.not.be.within(91, 96)
                    expect(password.charCodeAt(i)).to.not.be.above(122)
                }
            })

            it('should not save options for next time', function() {
                let passwordGenerator = new PasswordGenerator({ length: 25 })
                passwordGenerator.generatePassword({ length: 10 })
                let password = passwordGenerator.generatePassword()
                expect(password).to.have.length(25)
            })
        })
    })
})

