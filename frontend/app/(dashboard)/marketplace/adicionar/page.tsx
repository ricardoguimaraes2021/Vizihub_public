"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Estados do produto
const productConditions = [
  { id: 1, name: "Novo" },
  { id: 2, name: "Usado - Como Novo" },
  { id: 3, name: "Usado - Bom Estado" },
  { id: 4, name: "Usado - Com Marcas de Uso" },
  { id: 5, name: "Para Peças ou Reparo" },
]

export default function AdicionarProdutoPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    condition: "",
  })
  const [images, setImages] = useState<string[]>([])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, condition: value }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    // In a real app, you would upload these to your server/cloud storage
    // Here we're just creating local URLs for preview
    const newImages = Array.from(files).map((file) => URL.createObjectURL(file))
    setImages((prev) => [...prev, ...newImages])
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log("Form data:", formData)
    console.log("Images:", images)
    // Navigate back to the marketplace
    router.push("/marketplace")
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Adicionar Produto</h1>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Produto</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Título do Anúncio</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ex: Sofá de 3 lugares em excelente estado"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Descreva o produto em detalhes, incluindo características, estado, etc."
                rows={4}
                required
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="price">Preço (€)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Ex: 99.99"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="condition">Estado</Label>
                <Select value={formData.condition} onValueChange={handleSelectChange} required>
                  <SelectTrigger id="condition">
                    <SelectValue placeholder="Selecione o estado do produto" />
                  </SelectTrigger>
                  <SelectContent>
                    {productConditions.map((condition) => (
                      <SelectItem key={condition.id} value={condition.id.toString()}>
                        {condition.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Fotos do Produto</Label>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {images.map((image, index) => (
                  <div key={index} className="relative aspect-square rounded-md border">
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`Uploaded image ${index + 1}`}
                      fill
                      className="rounded-md object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute right-1 top-1 h-6 w-6"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground hover:bg-muted/50">
                  <Upload className="mb-2 h-6 w-6" />
                  <span>Adicionar Foto</span>
                  <Input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
                </label>
              </div>
              <p className="text-xs text-muted-foreground">
                Adicione até 8 fotos do seu produto. A primeira foto será a capa do anúncio.
              </p>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button type="button" variant="outline" onClick={() => router.push("/marketplace")}>
                Cancelar
              </Button>
              <Button type="submit">Adicionar Anúncio</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

