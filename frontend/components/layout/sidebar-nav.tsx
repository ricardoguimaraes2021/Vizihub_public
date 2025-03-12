"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, MessageSquare, Ticket, Store, Users, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { useSidebar } from "@/contexts/sidebar-context"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Forum", href: "/forum", icon: MessageSquare },
  { name: "Tickets", href: "/tickets", icon: Ticket },
  { name: "Marketplace", href: "/marketplace", icon: Store },
  { name: "Utilizadores", href: "/utilizadores", icon: Users },
]

export function SidebarNav({ className, isMobile = false }: { className?: string; isMobile?: boolean }) {
  const pathname = usePathname()
  const { isExpanded, toggleSidebar } = useSidebar()

  const NavContent = (
    <div
      className={cn(
        "flex h-full flex-col border-r bg-[#2c3e6a] text-white transition-all duration-300",
        isExpanded ? "w-72" : "w-24",
        className,
      )}
    >
      <div className="flex h-20 items-center justify-between border-b px-6">
        <Link href="/dashboard" className="flex items-center gap-3 font-semibold">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#2c3e6a]">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-white"
            >
              <path
                d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 22V12H15V22"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          {isExpanded && <span className="text-xl">vizihub</span>}
        </Link>
        {!isMobile && (
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="hidden md:flex">
            {isExpanded ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </Button>
        )}
      </div>
      <nav className="flex-1 space-y-2 px-3 py-6 overflow-y-auto">
        <TooltipProvider delayDuration={0}>
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Tooltip key={item.name}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "group flex items-center rounded-md px-4 py-3 text-base font-medium",
                      isActive ? "bg-[#3a4d7a] text-white" : "text-white/70 hover:bg-[#3a4d7a] hover:text-white",
                      !isExpanded && "justify-center px-3",
                    )}
                  >
                    <item.icon
                      className={cn(
                        "h-6 w-6",
                        isExpanded ? "mr-4" : "mr-0",
                        isActive ? "text-white" : "text-white/70 group-hover:text-white",
                      )}
                    />
                    {isExpanded && <span>{item.name}</span>}
                  </Link>
                </TooltipTrigger>
                {!isExpanded && <TooltipContent side="right">{item.name}</TooltipContent>}
              </Tooltip>
            )
          })}
        </TooltipProvider>
      </nav>
    </div>
  )

  if (isMobile) {
    return NavContent
  }

  return <div className="hidden md:block">{NavContent}</div>
}

export function MobileSidebar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
          >
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        <SidebarNav isMobile={true} />
      </SheetContent>
    </Sheet>
  )
}

