"use client"

import Link from "next/link"
import { PlusCircle, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

// Mock data for tickets - in a real app, this would come from your API
const tickets = [
  {
    id: 1,
    title: "Problema com a torneira da cozinha",
    status: "Resolvido",
    openDate: "15/02/2023",
  },
  {
    id: 2,
    title: "Trocar Lâmpada",
    status: "Em resolução",
    openDate: "28/03/2023",
  },
  {
    id: 3,
    title: "Infiltração no teto da sala",
    status: "Resolvido",
    openDate: "10/04/2023",
  },
  {
    id: 4,
    title: "Problema com o aquecedor",
    status: "Em resolução",
    openDate: "05/05/2023",
  },
  {
    id: 5,
    title: "Fechadura da porta principal com defeito",
    status: "Resolvido",
    openDate: "22/06/2023",
  },
]

export default function TicketsPage() {
  // Remove the getRowBackgroundClass function since we won't be using it

  // Update the getStatusBadgeClass function to match the forum styling
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Resolvido":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "Em resolução":
        return "bg-amber-100 text-amber-800 hover:bg-amber-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  // Função para determinar a classe de cor de fundo da linha com base no status
  // const getRowBackgroundClass = (status: string) => {
  //   switch (status) {
  //     case "Resolvido":
  //       return "bg-green-50/50"
  //     case "Em resolução":
  //       return "bg-amber-50/50"
  //     default:
  //       return ""
  //   }
  // }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Tickets</h1>
          <p className="text-muted-foreground">Gerencie seus tickets de suporte.</p>
        </div>
        <Button asChild>
          <Link href="/tickets/criar">
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Ticket
          </Link>
        </Button>
      </div>

      <Separator />

      <Card className="overflow-hidden border-none shadow-sm">
        <CardHeader className="flex flex-col space-y-4 bg-secondary/50 px-6 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <CardTitle className="text-lg font-medium">Histórico de Tickets</CardTitle>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Pesquisar tickets..." className="pl-8" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">ID</TableHead>
                <TableHead>Título</TableHead>
                <TableHead className="w-[150px]">Estado</TableHead>
                <TableHead className="w-[150px]">Data de Abertura</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.map((ticket) => (
                // Remove the getRowBackgroundClass from the TableRow and keep a white background
                <TableRow key={ticket.id} className="transition-colors hover:bg-muted/50">
                  <TableCell className="font-medium">{ticket.id}</TableCell>
                  <TableCell>
                    <Link href={`/tickets/${ticket.id}`} className="hover:underline">
                      {ticket.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn(getStatusBadgeClass(ticket.status))}>
                      {ticket.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{ticket.openDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

