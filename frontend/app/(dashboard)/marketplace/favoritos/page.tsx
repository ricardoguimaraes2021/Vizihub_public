"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

// Mock data - em uma aplicação real, isso viria da sua API
const allProducts = [
  {
    id: 1,
    title: "Sofá de 3 lugares",
    price: 350,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 2,
    title: "Mesa de jantar com 6 cadeiras",
    price: 450,
    image: "/placeholder.svg?height=200&width=300",
  },
]

export default function FavoritosPage() {
  const [favorites, setFavorites] = useState<number[]>([])
  const [products, setProducts] = useState(allProducts)

  // Carregar favoritos do localStorage ao montar o componente
  useEffect(() => {
    const savedFavorites = localStorage.getItem("favorites")
    if (savedFavorites) {
      const favoriteIds = JSON.parse(savedFavorites)
      setFavorites(favoriteIds)
      // Filtrar produtos para mostrar apenas os favoritos
      setProducts(allProducts.filter((product) => favoriteIds.includes(product.id)))
    }
  }, [])

  const toggleFavorite = (e: React.MouseEvent, productId: number) => {
    e.preventDefault()
    e.stopPropagation()

    const newFavorites = favorites.filter((id) => id !== productId)
    setFavorites(newFavorites)
    localStorage.setItem("favorites", JSON.stringify(newFavorites))
    setProducts(products.filter((product) => product.id !== productId))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Meus Favoritos</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/marketplace/${product.id}`}
            className="block transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg"
          >
            <Card className="h-full overflow-hidden cursor-pointer relative">
              <div className="aspect-video w-full overflow-hidden">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.title}
                  width={300}
                  height={200}
                  className="h-full w-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="line-clamp-1 font-medium mb-1">{product.title}</h3>
                    <p className="font-bold text-primary">{product.price}€</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-12 w-12 rounded-full text-red-500 hover:text-red-600"
                    onClick={(e) => toggleFavorite(e, product.id)}
                  >
                    <Heart className="h-7 w-7 fill-current" />
                    <span className="sr-only">Remover dos favoritos</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Você ainda não tem nenhum anúncio favoritado.</p>
          <Button asChild className="mt-4">
            <Link href="/marketplace">Explorar anúncios</Link>
          </Button>
        </div>
      )}
    </div>
  )
}

