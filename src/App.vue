<script setup>
/* imports */
import { ref } from 'vue'
import { useAlby } from '@/stores/alby'
import { useMutinyNet } from '@/stores/mutinyNet'
import { storeToRefs } from 'pinia'

/* components */
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

/* vectors */
import AlbyBee from '@/assets/alby.svg'
import GithubBadge from '@/assets/github.svg'

// stores
let alby = useAlby()
let mutinyNet = useMutinyNet()

// refs
let { address } = storeToRefs(alby)
let { balance } = storeToRefs(mutinyNet)

// funcs
let { connectWallet } = alby
let { tapFaucet, fetchBalance } = mutinyNet

let openGithubRepository = () => {
  window.open('https://github.com/krutt/tayan.git', '_blank', 'noreferrer, noopener')
}

</script>

<template>
  <div class="flex flex-col">
    <div class="flex-1 space-y-4 p-8 pt-6">
      <div class="flex items-center justify-between space-y-2">
        <h2 class="text-3xl font-bold tracking-tight">Tayan</h2>
        <Button
            @click="connectWallet"
          class="cursor-pointer float-right md:w-1/4 w-1/2"
          v-if="!address"
        >
          Connect Wallet
          <alby-bee class="h-6 inline ml-2 w-auto" />
        </Button>
        <span class="float-right" v-if="address">
          Balance:&nbsp;
          {{ balance }}
          &nbsp;₿
        </span>
      </div>
    </div>
    <section class="container grid lg:grid-cols-2 place-items-center py-20 md:py-32 gap-10">
      <div class="text-center lg:text-start space-y-6">
        <main class="text-5xl md:text-6xl font-bold">
          <h1 class="inline">
            <span
              class="inline bg-gradient-to-r from-[#FF146E] via-[#FFADCD] to-[#FF146E] text-transparent bg-clip-text"
            >
              Tayan
            </span>
            locks Bitcoin UTXO
          </h1>
          <h2 class="inline">
            for
            <span
              class="inline bg-gradient-to-r from-[#ff9999] via-[#ff9900] to-[#ff9999] text-transparent bg-clip-text"
            >
              Statechain
            </span>
            vTXO
          </h2>
        </main>
        <div class="space-y-4 md:space-y-0 md:space-x-4">
          <Button
            @click="openGithubRepository"
            class="cursor-pointer md:w-1/3 w-full"
            variant="outline"
          >
            Repository
            <github-badge class="h-6 inline ml-2 w-auto" />
          </Button>
        </div>
      </div>
      <div class="grid gap-4 py-4 grid-cols-1">
        <Transition name="fade">
          <Card v-if="address">
            <CardHeader>
              <CardTitle> Address </CardTitle>
              <CardDescription>
                This is your Bitcoin Address currently selected and provided by Wallet
                Extension.
              </CardDescription>
            </CardHeader>
            <CardContent class="break-all text-sm font-medium">
              {{ address }}
            </CardContent>
            <CardFooter class="justify-between space-x-2">
              <Button @click="tapFaucet" class="cursor-pointer" variant="secondary">
                Tap faucet
              </Button>
              <Button @click="fetchBalance" class="cursor-pointer" variant="outline">
                Fetch balance
              </Button>
            </CardFooter>
          </Card>
        </Transition>
      </div>
    </section>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leace-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
