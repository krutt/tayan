/* ~~/plugins/shadcn.js */

// imports
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import { CarouselAdd } from '@/components'
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
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { Toaster } from '@/components/ui/sonner'

export const plugin = {
  install: app => {
    app.component('Button', Button) // keep uppercase to not conflict with built-in <button></button> tags
    app.component('card', Card)
    app.component('card-content', CardContent)
    app.component('card-description', CardDescription)
    app.component('card-footer', CardFooter)
    app.component('card-header', CardHeader)
    app.component('carousel', Carousel)
    app.component('carousel-add', CarouselAdd)
    app.component('carousel-content', CarouselContent)
    app.component('carousel-item', CarouselItem)
    app.component('context-menu', ContextMenu)
    app.component('context-menu-content', ContextMenuContent)
    app.component('context-menu-item', ContextMenuItem)
    app.component('context-menu-label', ContextMenuLabel)
    app.component('context-menu-separator', ContextMenuSeparator)
    app.component('context-menu-trigger', ContextMenuTrigger)
    app.component('drawer', Drawer)
    app.component('drawer-close', DrawerClose)
    app.component('drawer-content', DrawerContent)
    app.component('drawer-description', DrawerDescription)
    app.component('drawer-header', DrawerHeader)
    app.component('drawer-title', DrawerTitle)
    app.component('drawer-trigger', DrawerTrigger)
    app.component('dropdown-menu', DropdownMenu)
    app.component('dropdown-menu-content', DropdownMenuContent)
    app.component('dropdown-menu-item', DropdownMenuItem)
    app.component('dropdown-menu-label', DropdownMenuLabel)
    app.component('dropdown-menu-separator', DropdownMenuSeparator)
    app.component('dropdown-menu-trigger', DropdownMenuTrigger)
    app.component('resizable-handle', ResizableHandle)
    app.component('resizable-panel', ResizablePanel)
    app.component('resizable-panel-group', ResizablePanelGroup)
    app.component('toaster', Toaster)
  },
}

export default plugin
