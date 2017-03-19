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
Static functions:
```javascript
password = PasswordGenerator.generatePassword([options, [randomFunction]])
password = PasswordGenerator.generatePasswordAsync(options, randomFunction, callback)
password = PasswordGenerator.generatePasswordAsync(options, randomFunction)
    .then(callback)
```

Object:
```javascript
let passwordGenerator = new PasswordGenerator([options, [randomFunction]])

password = passwordGenerator.generatePassword([options, [randomFunction]])
password = passwordGenerator.generatePasswordAsync(options, randomFunction, callback)
password = passwordGenerator.generatePasswordAsync(options, randomFunction)
    .then(callback)
```

Options:
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

