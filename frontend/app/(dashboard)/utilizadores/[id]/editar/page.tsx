"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

// This would come from your backend based on the ID
const fetchUser = (id: string) => {
  // Mock data - in a real app, you'd fetch this from your API
  return {
    nome: "Joao",
    rua: "Rua das Regadas",
    dataNascimento: "2000-12-28", // Note: HTML date input requires YYYY-MM-DD format
    nif: "23541445",
  }
}

export default function EditarUtilizadorPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    nome: "",
    rua: "",
    dataNascimento: "",
    nif: "",
  })

  useEffect(() => {
    // Load user data
    const userData = fetchUser(params.id)
    setFormData(userData)
  }, [params.id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log("Updated user data:", formData)
    // Navigate back to the users list
    router.push("/utilizadores")
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Editar Utilizador</h1>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome</Label>
                <Input id="nome" name="nome" value={formData.nome} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rua">Rua</Label>
                <Input id="rua" name="rua" value={formData.rua} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataNascimento">Data Nascimento</Label>
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
                <Label htmlFor="nif">Nif</Label>
                <Input id="nif" name="nif" value={formData.nif} onChange={handleChange} required />
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <Button type="submit" className="px-8">
                Guardar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

