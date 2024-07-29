/* ~~/src/composables/keypair.js */

import { ProjectivePoint, getPublicKey, utils } from '@noble/secp256k1'
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
    derivePublicKey: privateKey => getPublicKey(privateKey, true),
  }
}

export default useKeypair
