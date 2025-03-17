"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

const items = [
  {
    title: "Anúncios",
    href: "/marketplace",
  },
  {
    title: "Meus Anúncios",
    href: "/marketplace/meus-anuncios",
  },
  {
    title: "Favoritos",
    href: "/marketplace/favoritos",
  },
  {
    title: "Mensagens",
    href: "/marketplace/mensagens",
  },
  {
    title: "Aprovar Anúncios",
    href: "/marketplace/aprovar",
  },
]

export function MarketplaceNav() {
  const pathname = usePathname()

  return (
    <NavigationMenu className="mb-6">
      <NavigationMenuList className="flex space-x-2">
        {items.map((item) => (
          <NavigationMenuItem key={item.href}>
            <Link href={item.href} legacyBehavior passHref>
              <NavigationMenuLink
                className={cn(
                  navigationMenuTriggerStyle(),
                  pathname === item.href && "bg-accent text-accent-foreground",
                  "cursor-pointer", // Adicionado cursor-pointer para mudar o cursor para mão
                )}
              >
                {item.title}
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  )
}

