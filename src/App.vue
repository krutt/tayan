<script setup>
/* imports */
import { storeToRefs } from 'pinia'
import { useAlby } from '@/stores/alby'
import { useMutinyNet } from '@/stores/mutinyNet'
import { useStateChain } from '@/stores/stateChain'
import { ref, watchEffect } from 'vue'

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
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Jdenticon, StateChain, ThemeToggle } from '@/components'
import { Toaster } from '@/components/ui/sonner'

/* vectors */
import AlbyBee from '@/assets/alby.svg'
import KruttCrest from '@/assets/krutt.svg'
import GithubBadge from '@/assets/github.svg'

// stores
let alby = useAlby()
let mutinyNet = useMutinyNet()
let stateChain = useStateChain()

// refs
let { address } = storeToRefs(alby)
let { balance } = storeToRefs(mutinyNet)
let nevents = ref([])
let { nprofile } = storeToRefs(stateChain)

// funcs
let { connectWallet } = alby
let { tapFaucet, fetchBalance } = mutinyNet

let appendToWithdrawal = event => {
  nevents.value.push({ type: 'append' })
}
let commitState = event => {
  nevents.value.push({ type: 'commit' })
}
let openGithubRepository = () => {
  window.open('https://github.com/krutt/tayan.git', '_blank', 'noreferrer, noopener')
}
let unilaterallyExit = event => {
  nevents.value.push({ type: 'exit' })
}
// lifecycles
let createStatechainButton = ref(null)
let connectButton = ref(null)
watchEffect(() => {
  if (!address.value && connectButton.value) connectButton.value.$el.focus()
  else if (address.value && createStatechainButton.value) createStatechainButton.value.$el.focus()
})
</script>

<template>
  <div class="bg-white dark:bg-gray-950 flex flex-col min-w-screen">
    <div class="fixed flex-1 space-y-4 p-8 pt-6">
      <div class="fixed inset-x-0 top-0 z-[10] h-fit border-b border-slate-900 py-2">
        <div class="flex items-center justify-between h-full gap-2 px-8 mx-auto max-w-7xl">
          <p
            class="border-b-4 border-black border-r-4 dark:border-white dark:text-white font-bold grid grid-cols-2 hover:-translate-y-[2px] items-center px-2 py-1 rounded-lg select-none text-xl transition-all"
          >
            <KruttCrest class="float-left h-10 mr-2 w-auto" />
            Tayan
          </p>
          <div class="flex items-center">
            <ThemeToggle class="mr-4" />
            <Button
              @click="connectWallet"
              class="cursor-pointer float-right w-fit"
              ref="connectButton"
              v-if="!address"
            >
              Connect Wallet
              <AlbyBee class="h-6 inline ml-2 w-auto" />
            </Button>
            <DropdownMenu as-child v-else>
              <DropdownMenuTrigger>
                <Jdenticon :address="address" mode="light" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
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
                <DropdownMenuItem disabled="true"> Disconnect </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
    <section
      class="container gap-10 grid h-screen md:py-32 place-items-center py-20 xl:grid-cols-3"
    >
      <div class="col-span-3 lg:col-span-1 space-y-6 text-center xl:text-start" v-if="!nprofile">
        <main class="text-5xl md:text-6xl font-bold">
          <h1 class="dark:text-white inline">
            <span
              class="inline bg-gradient-to-r from-[#FE7F2D] via-[#FF9900] to-[#FE7F2D] text-transparent bg-clip-text"
            >
              Tayan
            </span>
            locks Bitcoin UTXO
          </h1>
          <h2 class="dark:text-white inline">
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
            class="cursor-pointer dark:text-white md:w-1/3 w-full"
            variant="outline"
          >
            Repository
            <github-badge class="h-6 inline ml-2 w-auto" />
          </Button>

          <Drawer class="md:w-1/3 w-full">
            <DrawerTrigger class="dark:text-white">
              <Button variant="link">Disclaimer </Button></DrawerTrigger
            >
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Pre-alpha software</DrawerTitle>
                <DrawerDescription>Use at your own risk</DrawerDescription>
              </DrawerHeader>
              <DrawerFooter>
                <DrawerClose>
                  <Button variant="outline"> Close </Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
      <Transition name="fade">
        <div class="grid gap-4 py-4 col-span-3 lg:col-span-2" v-if="!nprofile">
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
              <CardFooter class="justify-start">
                <Button @click="tapFaucet" class="cursor-pointer" variant="secondary">
                  Tap faucet
                </Button>
              </CardFooter>
            </Card>
          </Transition>
          <Transition name="fade">
            <Card v-if="address">
              <CardHeader>
                <CardTitle> Statechain </CardTitle>
                <CardDescription>
                  Statechains allow users to rapidly and cheaply transfer real bitcoins between each
                  other without relying on a network of payment channels. Double-spending prevention
                  is done by
                  <italic> semi-trusted </italic>
                  Statechain operators. One may try to steal funds from you by sharing their vTXO
                  while obscuring ties with the Statechain operator, or even be one him/herself. Due
                  to reduced security when compared to Bitcoin, Statechains are able to achieve many
                  feats and extensibilities which makes the risk and reward of using one for fun or
                  profit open to personal discretion. May the odds be ever in your favour.
                </CardDescription>
              </CardHeader>
              <CardFooter class="justify-end">
                <Button @click="stateChain.initialize" ref="createStatechainButton">
                  Create Disposable Statechain
                </Button>
              </CardFooter>
            </Card>
          </Transition>
        </div>
      </Transition>
      <Transition name="fade" v-if="nprofile">
        <div class="grid gap-4 py-4 col-span-3">
          <StateChain
            :nprofile="nprofile"
            :nevents="nevents"
            @append-to-withdrawal="appendToWithdrawal"
            @commit-state="commitState"
            @unilaterally-exit="unilaterallyExit"
          />
        </div>
      </Transition>
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
