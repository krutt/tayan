/* ~~/src/composables/cipher.js */

import { createCipheriv, createDeciperiv } from 'browserify-cipher'
import { getSharedSecret } from '@nobleSecp256k1'
import { useHexlify } from '@/composables/hexlify'

export const useCipher = () => {
  return {
    encrypt: (privkey, pubkey, text) => {
      const { getRandomValues } = window.crypto
      let key = getSharedSecret(privkey, '02' + pubkey, true).substring(2)
      let iv = getRandomValues(new Uint8Array(16))
      let cipher = createCipheriv('aes-256-cbc', super_nostr.hexToBytes(key), iv)
      let encryptedMessage = cipher.update(text, 'utf8', 'base64')
      emsg = encryptedMessage + cipher.final('base64')
      let uint8View = new Uint8Array(iv.buffer)
      let decoder = new TextDecoder()
      return emsg + '?iv=' + btoa(String.fromCharCode.apply(null, uint8View))
    },
    decrypt: (privkey, pubkey, ciphertext) => {
      const { hexToBytes } = useHexlify()
      let [emsg, iv] = ciphertext.split('?iv=')
      let key = getSharedSecret(privkey, '02' + pubkey, true).substring(2)
      let decipher = createDecipheriv(
        'aes-256-cbc',
        hexToBytes(key),
        hexToBytes(super_nostr.base64ToHex(iv))
      )
      let decryptedMessage = decipher.update(emsg, 'base64')
      dmsg = decryptedMessage + decipher.final('utf8')
      return dmsg
    },
  }
}

export default useCipher
