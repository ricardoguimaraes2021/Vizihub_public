"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function AdicionarUtilizadorPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    porta: "",
    dataNascimento: "",
    nif: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Aqui você faria a chamada para sua API para salvar o utilizador
      console.log("Dados do formulário:", formData)

      // Simula uma chamada de API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Redireciona de volta para a lista de utilizadores
      router.push("/utilizadores")
    } catch (error) {
      console.error("Erro ao salvar utilizador:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Adicionar Utilizador</h1>
        <p className="text-muted-foreground">Preencha os dados para adicionar um novo utilizador.</p>
      </div>

      <Separator />

      <Card className="overflow-hidden border-none shadow-sm">
        <CardHeader className="bg-secondary/50 px-6">
          <CardTitle className="text-lg font-medium">Dados do Utilizador</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="p-6 space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome</Label>
                <Input id="nome" name="nome" value={formData.nome} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nome">Email</Label>
                <Input id="email" name="email" value={formData.email} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="porta">Número de Porta</Label>
                <Input id="porta" name="porta" type="number" value={formData.porta} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                <Input
                  id="dataNascimento"
                  name="dataNascimento"
                  type="date"
                  value={formData.dataNascimento}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nif">NIF</Label>
                <Input id="nif" name="nif" value={formData.nif} onChange={handleChange} required />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-4 border-t bg-secondary/20 px-6 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/utilizadores")}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

