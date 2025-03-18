"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { PlusCircle, Pencil, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const getAuthToken = () => {
  const match = document.cookie.match(/(^| )authToken=([^;]+)/)
  return match ? match[2] : null
}

export default function UtilizadoresPage() {
  const router = useRouter()
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchUsers() {
      try {
        const token = getAuthToken()
        if (!token) {
          console.warn("Token não encontrado, redirecionando para login...")
          router.push("/login")
          return
        }

        console.log("Buscando utilizadores da API...")
        const response = await fetch("http://localhost:8000/api/utilizadores/getAllUsers", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Erro ao carregar utilizadores.")
        }

        const data = await response.json()
        console.log("Dados recebidos da API:", data)

        if (!data.users) {
          throw new Error("Nenhum utilizador encontrado na API.")
        }

        setUsers(data.users)
      } catch (error) {
        console.error("Erro ao buscar utilizadores:", error)
        setError("Falha ao carregar utilizadores.")
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const handleLogout = () => {
    document.cookie = "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;"
    router.push("/login")
  }

  return (
    <div className="space-y-8">
      <div className="mt-16 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Utilizadores</h1>
          <p className="text-muted-foreground">Gestão de utilizadores.</p>
        </div>
        <Button asChild>
          <Link href="/utilizadores/adicionar">
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar
          </Link>
        </Button>
      </div>

      <Separator />

      <Card className="overflow-hidden border-none shadow-sm">
        <CardHeader className="bg-secondary/50 px-6">
          <CardTitle className="text-lg font-medium">Lista de Utilizadores</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <p className="text-center py-6 text-gray-500">Carregando utilizadores...</p>
          ) : error ? (
            <p className="text-center py-6 text-red-500">{error}</p>
          ) : users.length === 0 ? (
            <p className="text-center py-6 text-gray-500">Nenhum utilizador encontrado.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Porta</TableHead>
                  <TableHead>Data de nascimento</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.id}</TableCell>
                    <TableCell>{user.nome ?? "Sem Nome"}</TableCell> {/* Corrigido */}
                    <TableCell>{user.porta ?? "-"}</TableCell> {/* Corrigido */}
                    <TableCell>{user.data_nascimento ?? "-"}</TableCell> {/* Corrigido */}
                    <TableCell>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/utilizadores/${user.id}/editar`}>
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
