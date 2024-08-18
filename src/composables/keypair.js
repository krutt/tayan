/* ~~/src/composables/keypair.js */

import { CURVE, ProjectivePoint as Point, utils } from '@noble/secp256k1'
const { randomPrivateKey } = utils
const { bytesToHex } = useHexlify()

export const useKeypair = () => {
  return {
    combineTwoPrivateKeys: (firstPrivateKey, secondPrivateKey) => {
      let comboKey = (
        (BigInt('0x' + firstPrivateKey) + BigInt('0x' + secondPrivateKey)) %
        CURVE.n
      ).toString(16)
      return ('0'.repeat(64) + comboKey).slice(-64)
    },
    combineTwoPublicKeys: (firstPublicKey, secondPublicKey) =>
      Point.fromHex(firstPublicKey).add(Point.fromHex(secondPublicKey)).toHex(true),
    generatePrivateKey: () => bytesToHex(randomPrivateKey()),
    generatePrivateKeyAvoidingPrefix: prefix => {
      while (true) {
        let privateKey = bytesToHex(randomPrivateKey())
        if (privateKey.startsWith(prefix)) continue
        return privateKey
      }
    },
    derivePublicKey: privateKey => Point.fromPrivateKey(privateKey, true).toHex(),
    subtractTwoPrivateKeys: (firstPrivateKey, secondPrivateKey) => {
      let comboKey = (
        (BigInt('0x' + firstPrivateKey) - BigInt('0x' + secondPrivateKey)) %
        CURVE.n
      ).toString(16)
      let padding = '0'.repeat(64)
      return (padding + comboKey).slice(-64)
    },
  }
}

export default useKeypair
