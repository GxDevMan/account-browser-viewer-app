class EncryptDecryptHandler {
  constructor() {
    this.AES_ALGORITHM = 'AES-GCM';
  }

  async convertStringToCryptoKey(keyString) {
    const rawKey = Uint8Array.from(atob(keyString), (c) => c.charCodeAt(0));
    return window.crypto.subtle.importKey(
      "raw",
      rawKey,
      { name: this.AES_ALGORITHM },
      true,
      ["encrypt", "decrypt"]
    );
  }

  async convertCryptoKeyToString(cryptoKey) {
    const exportedKey = await window.crypto.subtle.exportKey("raw", cryptoKey);
    const exportedKeyArray = new Uint8Array(exportedKey);
    const base64String = btoa(String.fromCharCode(...exportedKeyArray));
    return base64String;
  }

  async decrypt(encryptedMessage, key) {
    try {
      const encryptedBytes = Uint8Array.from(atob(encryptedMessage), c => c.charCodeAt(0));
      const decryptedBuffer = await window.crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: new Uint8Array(12), // IV should be provided if you're using AES-GCM mode
        },
        key,
        encryptedBytes
      );
      return new TextDecoder().decode(decryptedBuffer);
    } catch (error) {
      console.error('Error decrypting message:', error);
      return '';
    }
  }
}


module.exports = EncryptDecryptHandler;
