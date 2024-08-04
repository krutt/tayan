<script setup>
/* imports */
import { Jdenticon } from '@/components'

let { address } = storeToRefs(useAlby())
let { fetchBalance } = useMutinyNet()
</script>
<template>
  <dropdown-menu as-child>
    <dropdown-menu-trigger>
      <Jdenticon :address="address" mode="light" />
    </dropdown-menu-trigger>
    <dropdown-menu-content align="end">
      <dropdown-menu-label>My Account</dropdown-menu-label>
      <dropdown-menu-separator />
      <dropdown-menu-item>
        Balance:&nbsp;
        {{ balance }}
        &nbsp;₿
      </dropdown-menu-item>
      <dropdown-menu-item @click.capture.native.stop="fetchBalance">
        Refresh balance
      </dropdown-menu-item>
      <dropdown-menu-item disabled="true"> Disconnect </dropdown-menu-item>
    </dropdown-menu-content>
  </dropdown-menu>
</template>
