/* ~~/src/composables/hexlify.js */

export const useHexlify = () => {
  return {
    bytesToHex: bytes => bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), ''),
    hexToBytes: hex => Uint8Array.from(hex.match(/.{1,2}/g).map(byte => parseInt(byte, 16))),
    hexToText: hex => {
      let bytes = new Uint8Array(Math.ceil(hex.length / 2))
      for (let i = 0; i < hex.length; i++) bytes[i] = parseInt(hex.substr(i * 2, 2), 16)
      let text = new TextDecoder().decode(bytes)
      return text
    },
    textToHex: text => {
      let encoded = new TextEncoder().encode(text)
      return Array.from(encoded)
        .map(x => x.toString(16).padStart(2, '0'))
        .join('')
    },
  }
}

export default useHexlify
