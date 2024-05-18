const CryptoJS = require('crypto-js');

class AESCrypto {
    constructor(key) {
        this.key = CryptoJS.enc.Base64.parse(key);
    }

    encrypt(plaintext) {
        const ciphertext = CryptoJS.AES.encrypt(plaintext, this.key, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        return ciphertext.toString();
    }

    decrypt(ciphertext) {
        const decrypted = CryptoJS.AES.decrypt(ciphertext, this.key, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        }).toString(CryptoJS.enc.Utf8);
        return decrypted;
    }
}

module.exports = AESCrypto;
