import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: "ViziHub - A Sua Vizinhança, Mais Conectada",
  description:
    "Plataforma digital inovadora que promove a comunicação, colaboração e segurança dentro de comunidades residenciais.",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt">
      <body className="bg-gradient-to-b from-blue-50 to-white min-h-screen">
        {children}
        <Toaster />
      </body>
    </html>
  )
}




import './globals.css'