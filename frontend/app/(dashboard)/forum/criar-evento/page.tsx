"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { pt } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export default function CriarEventoPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    nome: "",
    data: new Date(),
    capacidadeMaxima: "",
    prazoInscricao: new Date(),
    localizacao: "",
    tipo: "",
    descricao: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDateChange = (name: string, date: Date | undefined) => {
    if (date) {
      setFormData((prev) => ({ ...prev, [name]: date }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Numa aplicação real, enviaria os dados para a API
      console.log("Dados do evento:", formData)

      // Simular chamada à API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Redirecionar de volta para a lista de eventos
      router.push("/forum")
    } catch (error) {
      console.error("Erro ao criar evento:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Criar Evento</h1>
        <p className="text-muted-foreground">Preencha os detalhes para criar um novo evento.</p>
      </div>

      <Separator />

      <Card className="overflow-hidden border-none shadow-sm">
        <CardHeader className="bg-secondary/50 px-6">
          <CardTitle className="text-lg font-medium">Detalhes do Evento</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="p-6 space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do Evento</Label>
                <Input id="nome" name="nome" value={formData.nome} onChange={handleInputChange} required />
              </div>

              <div className="space-y-2">
                <Label>Data do Evento</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.data && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.data ? format(formData.data, "PPP", { locale: pt }) : <span>Selecione uma data</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.data}
                      onSelect={(date) => handleDateChange("data", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacidadeMaxima">Capacidade Máxima</Label>
                <Input
                  id="capacidadeMaxima"
                  name="capacidadeMaxima"
                  type="number"
                  value={formData.capacidadeMaxima}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Prazo de Inscrição</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.prazoInscricao && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.prazoInscricao ? (
                        format(formData.prazoInscricao, "PPP", { locale: pt })
                      ) : (
                        <span>Selecione uma data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.prazoInscricao}
                      onSelect={(date) => handleDateChange("prazoInscricao", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="localizacao">Localização</Label>
                <Input
                  id="localizacao"
                  name="localizacao"
                  value={formData.localizacao}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Tipo de Evento</Label>
                <Select value={formData.tipo} onValueChange={(value) => handleSelectChange("tipo", value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de evento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Reunião">Reunião</SelectItem>
                    <SelectItem value="Alerta">Alerta</SelectItem>
                    <SelectItem value="Evento">Evento</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição do Evento</Label>
              <Textarea
                id="descricao"
                name="descricao"
                value={formData.descricao}
                onChange={handleInputChange}
                rows={5}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-4 border-t bg-secondary/20 px-6 py-4">
            <Button type="button" variant="outline" onClick={() => router.push("/forum")} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "A criar..." : "Criar Evento"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

