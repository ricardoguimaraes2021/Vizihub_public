"use client"

import Link from "next/link"
import { PlusCircle, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { pt } from "date-fns/locale"

// Dados de exemplo para eventos - numa aplicação real, viriam da sua API
const eventos = [
  {
    id: 1,
    nome: "Assembleia Geral de Condomínio",
    data: new Date(2023, 5, 15, 18, 30),
    tipo: "Reunião",
  },
  {
    id: 2,
    nome: "Manutenção da Piscina",
    data: new Date(2023, 6, 10, 9, 0),
    tipo: "Alerta",
  },
  {
    id: 3,
    nome: "Festa de Verão do Condomínio",
    data: new Date(2023, 7, 20, 16, 0),
    tipo: "Evento",
  },
  {
    id: 4,
    nome: "Reunião Extraordinária",
    data: new Date(2023, 8, 5, 19, 0),
    tipo: "Reunião",
  },
  {
    id: 5,
    nome: "Corte de Água Programado",
    data: new Date(2023, 8, 12, 8, 0),
    tipo: "Alerta",
  },
  // Adicionar o novo evento à lista principal
  {
    id: 6,
    nome: "Workshop de Sustentabilidade",
    data: new Date(new Date().setMonth(new Date().getMonth() + 1)), // Evento daqui a 1 mês
    tipo: "Evento",
  },
]

export default function ForumPage() {
  // Função para obter a cor do badge com base no tipo de evento
  const getTipoBadgeClass = (tipo: string) => {
    switch (tipo) {
      case "Reunião":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case "Alerta":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      case "Evento":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Fórum</h1>
          <p className="text-muted-foreground">Gerencie e participe dos eventos do condomínio.</p>
        </div>
        <Button asChild>
          <Link href="/forum/criar-evento">
            <PlusCircle className="mr-2 h-4 w-4" />
            Criar Evento
          </Link>
        </Button>
      </div>

      <Separator />

      <Card className="overflow-hidden border-none shadow-sm">
        <CardHeader className="flex flex-col space-y-4 bg-secondary/50 px-6 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <CardTitle className="text-lg font-medium">Eventos Registados</CardTitle>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Pesquisar eventos..." className="pl-8" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">ID</TableHead>
                <TableHead>Nome do Evento</TableHead>
                <TableHead className="w-[150px]">Tipo</TableHead>
                <TableHead className="w-[180px]">Data do Evento</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {eventos.map((evento) => (
                <TableRow key={evento.id}>
                  <TableCell className="font-medium">{evento.id}</TableCell>
                  <TableCell>
                    <Link href={`/forum/${evento.id}`} className="hover:underline">
                      {evento.nome}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge className={getTipoBadgeClass(evento.tipo)} variant="outline">
                      {evento.tipo}
                    </Badge>
                  </TableCell>
                  <TableCell>{format(evento.data, "d 'de' MMMM 'de' yyyy, HH:mm", { locale: pt })}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

