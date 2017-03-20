# Password Generator
A random password generator for node and browsers, which makes it possible to choose random-function.

## Installation
```sh
npm install password-generator-js
```

## Usage

### Node.js
```javascript
const PasswordGenerator = require('password-generator-js')
let password = PasswordGenerator.generatePassword([options, [randomFunction]])
```

### Browser
```html
<script src="path/to/module/index.js"></script>
```

```javascript
let password = PasswordGenerator.generatePassword([options, [randomFunction]])
```

### API
#### Synchronous
```javascript
password = PasswordGenerator.generatePassword([options, [randomFunction]])
```
It is possible to specifiy random function. The function should take no arguments and return a value between 0 and 1. If the random function is asynchronous, use generatePasswordAsync().

#### Asynchronous
```javascript
password = PasswordGenerator.generatePasswordAsync(options, randomFunction[, callback])

password = PasswordGenerator.generatePasswordAsync({ length: 20 }, c => {
    let RandomOrg = require('random-org')
    let random = new RandomOrg({ apiKey: '12345-67890-api-key' })
    random.generateDecimalFractions()
        .then(result => {
            c(result.random.data[0])
        });
}).then(console.log.bind(console))

password = PasswordGenerator.generatePasswordAsync({ length: 20 }, () => {
    let RandomOrg = require('random-org')
    let random = new RandomOrg({ apiKey: '12345-67890-api-key' })
    return random.generateDecimalFractions()
        .then(result => result.random.data[0]);
}).then(console.log.bind(console))
```
The random function should take a callback as argument and call it with the result or take no argument and return a promise which resolves with the result.

#### Options
```javascript
{
    length: 25,
    uppercase: true,
    lowercase: true,
    digits: true,
    symbols: true,
    obscureSymbols: true,
    extra: ''
}
```
Extra symbols can be used to add possible characters to the algorithm.

#### Static
```javascript
password = PasswordGenerator.generatePassword([options, [randomFunction]])
password = PasswordGenerator.generatePasswordAsync(options, randomFunction[, callback])
    .then(callback)
```

#### Object oriented
```javascript
let passwordGenerator = new PasswordGenerator([options, [randomFunction]])

password = passwordGenerator.generatePassword([options, [randomFunction]])
password = passwordGenerator.generatePasswordAsync(options, randomFunction[, callback])
    .then(callback)
```

