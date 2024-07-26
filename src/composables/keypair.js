/* ~~/src/composables/keypair.js */

import { getPublicKey, utils } from '@noble/secp256k1'
import { useHexlify } from '@/composables/hexlify'
const { randomPrivateKey } = utils
const { bytesToHex } = useHexlify()

export const useKeypair = () => {
  return {
    generatePrivateKey: () => bytesToHex(randomPrivateKey()),
    derivePublicKey: privateKey => getPublicKey(privateKey, true).sub(2),
  }
}

export default useKeypair
