"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AnunciosDataTable } from "./data-table"
import { columns } from "./columns"
import { useToast } from "@/hooks/use-toast"

// Função para obter o token de autenticação
const getAuthToken = () => {
  const match = document.cookie.match(/(^| )authToken=([^;]+)/)
  return match ? match[2] : null
}

export default function AprovarAnunciosPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [anuncios, setAnuncios] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Função para buscar anúncios pendentes
  const fetchAnunciosPendentes = async () => {
    setLoading(true)
    setError(null)

    try {
      const token = getAuthToken()
      if (!token) {
        setError("Sessão expirada. Faça login novamente.")
        toast({
          title: "Sessão expirada",
          description: "Faça login novamente para continuar.",
          variant: "destructive",
        })
        router.push("/login")
        return
      }

      // Aqui estamos buscando anúncios com status_id = 1 (pendentes)
      const response = await fetch("http://localhost:8000/api/marketplace/anuncios-pendentes", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Erro ao buscar anúncios pendentes.")
      }

      const data = await response.json()

      // Transformar os dados para o formato esperado pela tabela
      const formattedData = data.ads.map((item: any) => {
        const ad = item.ad
        return {
          id: ad.id,
          titulo: ad.title,
          status: "Pendente", // Assumindo que todos são pendentes nesta página
          vendedor: ad.created_by_name || "Desconhecido",
          dataCriacao: new Date(ad.created_at).toLocaleDateString(),
          preco: `${ad.price}€`,
          categoria: ad.category_name,
          estado: ad.state_product_name,
          descricao: ad.description,
          imagens: item.images || [],
        }
      })

      setAnuncios(formattedData)
    } catch (err: any) {
      setError(err.message)
      toast({
        title: "Erro ao carregar anúncios",
        description: err.message || "Não foi possível carregar os anúncios pendentes.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Buscar anúncios ao carregar a página
  useEffect(() => {
    fetchAnunciosPendentes()
  }, [])

  // Função para aprovar um anúncio
  const handleAprovarAnuncio = async (id: number) => {
    try {
      const token = getAuthToken()
      if (!token) {
        toast({
          title: "Sessão expirada",
          description: "Faça login novamente para continuar.",
          variant: "destructive",
        })
        router.push("/login")
        return
      }

      const response = await fetch(`http://localhost:8000/api/marketplace/aprovar-anuncio/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status_id: 2 }), // status_id 2 = aprovado/disponível
      })

      if (!response.ok) {
        throw new Error("Erro ao aprovar anúncio.")
      }

      toast({
        title: "Anúncio aprovado",
        description: "O anúncio foi aprovado com sucesso.",
      })

      // Atualizar a lista de anúncios
      fetchAnunciosPendentes()
    } catch (err: any) {
      toast({
        title: "Erro ao aprovar anúncio",
        description: err.message || "Não foi possível aprovar o anúncio.",
        variant: "destructive",
      })
    }
  }

  // Função para rejeitar um anúncio
  const handleRejeitarAnuncio = async (id: number) => {
    try {
      const token = getAuthToken()
      if (!token) {
        toast({
          title: "Sessão expirada",
          description: "Faça login novamente para continuar.",
          variant: "destructive",
        })
        router.push("/login")
        return
      }

      const response = await fetch(`http://localhost:8000/api/marketplace/rejeitar-anuncio/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status_id: 4 }), // status_id 4 = rejeitado/desativado
      })

      if (!response.ok) {
        throw new Error("Erro ao rejeitar anúncio.")
      }

      toast({
        title: "Anúncio rejeitado",
        description: "O anúncio foi rejeitado com sucesso.",
      })

      // Atualizar a lista de anúncios
      fetchAnunciosPendentes()
    } catch (err: any) {
      toast({
        title: "Erro ao rejeitar anúncio",
        description: err.message || "Não foi possível rejeitar o anúncio.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Aprovar Anúncios</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Anúncios Pendentes de Aprovação</CardTitle>
          <CardDescription>Revise e aprove os anúncios submetidos pelos usuários.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8 px-4 max-w-md mx-auto border border-red-200 rounded-lg bg-red-50">
              <p className="text-red-500 font-medium mb-4">{error}</p>
              <Button onClick={() => fetchAnunciosPendentes()}>Tentar novamente</Button>
            </div>
          ) : anuncios.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-2">Não há anúncios pendentes de aprovação.</p>
            </div>
          ) : (
            <AnunciosDataTable
              columns={columns}
              data={anuncios}
              onAprovar={handleAprovarAnuncio}
              onRejeitar={handleRejeitarAnuncio}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}

