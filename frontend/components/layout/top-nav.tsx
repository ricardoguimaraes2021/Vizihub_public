"use client"

import Link from "next/link"
import { useRouter } from "next/navigation" 
import { Bell, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MobileSidebar } from "./sidebar-nav"

export function TopNav() {
  const router = useRouter() 

  const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/login")
  }

  return (
    <div className="flex h-20 items-center justify-between border-b border-[#3a4d7a] bg-[#2c3e6a] px-6 text-white">
      <MobileSidebar />
      <div className="flex items-center gap-4 ml-auto">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full text-white bg-[#2c3e6a] hover:bg-[#3a4d7a] hover:text-white"
        >
          <Bell className="h-6 w-6" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-white bg-[#2c3e6a] hover:bg-[#3a4d7a] hover:text-white"
            >
              <User className="h-6 w-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem asChild>
              <Link href="/perfil">Meu Perfil</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}> 
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}