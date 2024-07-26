<script setup>
/* imports */
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Jdenticon } from '@/components'
import { Toaster } from '@/components/ui/sonner'

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
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Jdenticon :address="address" />
            </DropdownMenuTrigger>
            <DropdownMenuContent @closeAutoFocus='void 0'
              :collisionPadding="{ top: 32, right: 16 }" side="left">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                Balance:&nbsp;
                {{ balance }}
                &nbsp;₿
              </DropdownMenuItem>
              <DropdownMenuItem @click.capture.native.stop="fetchBalance">
                Refresh balance
              </DropdownMenuItem>
              <DropdownMenuItem disabled="true">
                Disconnect
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </span>
      </div>
    </div>
    <section class="container grid xl:grid-cols-3 place-items-center py-20 md:py-32 gap-10">
      <div class="col-span-3 lg:col-span-1 space-y-6 text-center xl:text-start">
        <main class="text-5xl md:text-6xl font-bold">
          <h1 class="inline">
            <span
              class="inline bg-gradient-to-r from-[#FE7F2D] via-[#FF9900] to-[#FE7F2D] text-transparent bg-clip-text"
            >
              Tayan
            </span>
            locks Bitcoin UTXO
          </h1>
          <h2 class="inline">
            for
            <span
              class="inline bg-gradient-to-r from-[#619B8A] via-[#A1C181] to-[#619B8A] text-transparent bg-clip-text"
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
      <div class="grid gap-4 py-4 col-span-3 lg:col-span-2">
        <Transition name="fade">
          <Card v-if="address">
            <CardHeader>
              <CardTitle> Address </CardTitle>
              <CardDescription>
                This is your Bitcoin Address currently selected and provided by Wallet Extension.
              </CardDescription>
            </CardHeader>
            <CardContent class="break-all text-sm font-medium">
              {{ address }}
            </CardContent>
            <CardFooter class="justify-between space-x-2">
              <Button @click="tapFaucet" class="cursor-pointer" variant="secondary">
                Tap faucet
              </Button>
            </CardFooter>
          </Card>
        </Transition>
      </div>
    </section>
  </div>
  <Toaster />
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
