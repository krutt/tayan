/* ~~/src/composables/nostr.js */

// imports
import { bech32 } from 'bech32'
import { useHexlify } from '@/composables/hexlify'
const { hexToBytes, textToHex } = useHexlify()

export const useNostr = () => {
  return {
    createNProfile: (prefix, pubkey, relays) => {
      let relays_str = ''
      relays.forEach(relay => {
        let relay_str = textToHex(relay)
        let len = (relay_str.length / 2).toString(16)
        if (len.length % 2) len = '0' + len
        relays_str = relays_str + '01' + len + relay_str
      })
      let hex = relays_str + '0020' + pubkey
      let bytes = hexToBytes(hex)
      let nevent = bech32.encode(prefix, bech32.toWords(bytes), 100_000)
      return nevent
    },
  }
}

export default useNostr
