"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, MessageSquare, User, Heart, LogOut, Tag, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const getAuthToken = () => {
  const match = document.cookie.match(/(^| )authToken=([^;]+)/)
  return match ? match[2] : null
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  const [product, setProduct] = useState<any>(null)
  const [selectedImage, setSelectedImage] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    async function fetchProductDetails() {
      try {
        const token = getAuthToken()
        if (!token) {
          router.push("/login")
          return
        }

        const response = await fetch(`http://localhost:8000/api/marketplace/anuncio/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Produto não encontrado")
        }

        const data = await response.json()
        console.log(data)

        setProduct({
          ...data.ad,
          images: data.images || [],
        })

        if (data.images.length > 0) {
          setSelectedImage(data.images[0])
        }
      } catch (error) {
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }

    fetchProductDetails()
  }, [id])

  if (loading) {
    return <div className="flex items-center justify-center h-full">Carregando...</div>
  }

  if (!product) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.push("/marketplace")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Produto não encontrado</h1>
        </div>
        <p>O produto que você está procurando não existe ou foi removido.</p>
        <Button asChild>
          <Link href="/marketplace">Voltar para o Marketplace</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 px-6 mt-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.push("/marketplace")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">{product.title}</h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-12 w-12 rounded-full",
            isFavorite ? "text-red-500 hover:text-red-600" : "text-muted-foreground hover:text-red-400",
          )}
          onClick={() => setIsFavorite(!isFavorite)}
        >
          <Heart className={cn("h-7 w-7", isFavorite ? "fill-current" : "")} />
          <span className="sr-only">{isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Imagens do produto */}
        <div className="space-y-4 lg:col-span-2">
          <div className="relative aspect-video overflow-hidden rounded-lg border bg-white">
            <Image src={selectedImage || "/placeholder.svg"} alt={product.title} fill className="object-contain" />
          </div>

          {product.images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {product.images.map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(image)}
                  className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border ${selectedImage === image ? "ring-2 ring-primary" : ""}`}
                >
                  <Image
                    src={image}
                    alt={`${product.title} - Imagem ${index + 1}`}
                    width={100}
                    height={100}
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Informações do produto */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardTitle className="text-2xl font-bold">Preço: {product.price}€</CardTitle>

              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Vendedor: {product.seller_name}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Data: {product.created_at}</div>
                </div>
              </div>

              <Button className="w-full" asChild>
                <Link href={`/marketplace/${id}/chat`}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Enviar Mensagem
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Tag className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">{product.category_name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Tag className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">{product.state_product_name}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Descrição do produto */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Descrição</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-line">{product.description}</p>
        </CardContent>
      </Card>
    </div>
  )
}
