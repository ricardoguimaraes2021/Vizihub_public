"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { PlusCircle, Pencil, Trash, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// Mock data - em uma aplicação real, isso viria da sua API
const myProducts = [
  {
    id: 1,
    title: "Sofá de 3 lugares",
    price: 350,
    image: "/placeholder.svg?height=200&width=300",
    status: "active", // active, sold
  },
  {
    id: 2,
    title: "Mesa de jantar com 6 cadeiras",
    price: 450,
    image: "/placeholder.svg?height=200&width=300",
    status: "sold",
  },
]

export default function MeusAnunciosPage() {
  const [products, setProducts] = useState(myProducts)

  const handleDelete = (productId: number) => {
    setProducts(products.filter((product) => product.id !== productId))
  }

  const toggleStatus = (productId: number) => {
    setProducts(
      products.map((product) =>
        product.id === productId ? { ...product, status: product.status === "active" ? "sold" : "active" } : product,
      ),
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Meus Anúncios</h1>
        <Button asChild>
          <Link href="/marketplace/adicionar">
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar Produto
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden">
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
                  <div className="flex items-center space-x-2">
                    <p className="font-bold text-primary">{product.price}€</p>
                    <Badge variant={product.status === "sold" ? "secondary" : "outline"}>
                      {product.status === "sold" ? "Vendido" : "Ativo"}
                    </Badge>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <span className="sr-only">Abrir menu</span>
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z"
                          fill="currentColor"
                          fillRule="evenodd"
                          clipRule="evenodd"
                        />
                      </svg>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/marketplace/${product.id}/editar`} className="flex items-center">
                        <Pencil className="mr-2 h-4 w-4" />
                        <span>Editar</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toggleStatus(product.id)} className="flex items-center">
                      <Check className="mr-2 h-4 w-4" />
                      <span>{product.status === "sold" ? "Marcar como disponível" : "Marcar como vendido"}</span>
                    </DropdownMenuItem>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem
                          className="flex items-center text-red-600 focus:text-red-600"
                          onSelect={(e) => e.preventDefault()}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          <span>Remover</span>
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remover anúncio</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja remover este anúncio? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(product.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Remover
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Você ainda não tem nenhum anúncio publicado.</p>
          <Button asChild className="mt-4">
            <Link href="/marketplace/adicionar">
              <PlusCircle className="mr-2 h-4 w-4" />
              Publicar meu primeiro anúncio
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}

