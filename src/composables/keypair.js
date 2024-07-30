/* ~~/src/composables/keypair.js */

import { CURVE, ProjectivePoint, utils } from '@noble/secp256k1'
import { useHexlify } from '@/composables/hexlify'
const { randomPrivateKey } = utils
const { bytesToHex } = useHexlify()

export const useKeypair = () => {
  return {
    combineTwoPublicKeys: (firstPublicKey, secondPublicKey) => {
      return ProjectivePoint.fromHex(firstPublicKey)
        .add(ProjectivePoint.fromHex(secondPublicKey))
        .toHex(true)
    },
    generatePrivateKey: () => bytesToHex(randomPrivateKey()),
    generatePrivateKeyAvoidingPrefix: prefix => {
      while (true) {
        let privateKey = bytesToHex(randomPrivateKey())
        if (privateKey.startsWith(prefix)) continue
        return privateKey
      }
    },
    derivePublicKey: privateKey => ProjectivePoint.fromPrivateKey(privateKey, true).toHex(),
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
