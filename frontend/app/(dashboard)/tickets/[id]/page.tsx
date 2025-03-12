"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Clock, Edit, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

// Mock function to get ticket details - in a real app, this would fetch from your API
const getTicketDetails = (id: string) => {
  // This is just mock data
  return {
    id: Number.parseInt(id),
    title: "Problema com a torneira da cozinha",
    status: "Em resolução", // Alterado para "Em resolução" para demonstrar a edição
    openDate: "15/02/2023",
    description:
      "A torneira da cozinha está com vazamento. Sempre que abro, forma uma poça de água embaixo da pia. Já tentei apertar as conexões, mas o problema persiste.",
    updates: [
      {
        date: "16/02/2023",
        message: "Técnico agendado para visita no dia 17/02/2023 entre 14h e 16h.",
        author: "Suporte",
      },
      {
        date: "17/02/2023",
        message: "Visita realizada. Identificado problema na vedação. Peça encomendada.",
        author: "Técnico",
      },
    ],
  }
}

export default function TicketDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const ticket = getTicketDetails(params.id)

  // Estados para controlar a edição
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(ticket.title)
  const [additionalDescription, setAdditionalDescription] = useState("")
  const [newComment, setNewComment] = useState("")

  // Verificar se o ticket pode ser editado (apenas em resolução)
  const canEdit = ticket.status === "Em resolução"

  const handleSaveEdit = () => {
    // Em uma aplicação real, você enviaria essas alterações para o backend
    console.log("Salvando alterações:", {
      title: editedTitle,
      additionalDescription,
    })

    // Adicionar comentário se houver
    if (newComment.trim()) {
      console.log("Adicionando comentário:", newComment)
    }

    // Sair do modo de edição
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    // Resetar para os valores originais
    setEditedTitle(ticket.title)
    setAdditionalDescription("")
    setNewComment("")
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.push("/tickets")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Ticket #{ticket.id}</h1>

        {canEdit && !isEditing && (
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
        )}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          {isEditing ? (
            <Input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="font-semibold text-lg"
            />
          ) : (
            <CardTitle>{ticket.title}</CardTitle>
          )}
          <Badge
            variant="outline"
            className={
              ticket.status === "Resolvido"
                ? "border-green-500 bg-green-50 text-green-700"
                : "border-amber-500 bg-amber-50 text-amber-700"
            }
          >
            {ticket.status}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="mr-1 h-4 w-4" />
            Aberto em {ticket.openDate}
          </div>

          <Separator />

          <div>
            <h3 className="mb-2 font-medium">Descrição</h3>
            <p className="text-sm">{ticket.description}</p>

            {isEditing && (
              <div className="mt-4 space-y-2">
                <h4 className="text-sm font-medium">Adicionar à descrição:</h4>
                <Textarea
                  value={additionalDescription}
                  onChange={(e) => setAdditionalDescription(e.target.value)}
                  placeholder="Adicione mais detalhes ao seu ticket..."
                  rows={3}
                />
              </div>
            )}
          </div>

          <Separator />

          <div>
            <h3 className="mb-4 font-medium">Atualizações</h3>
            <div className="space-y-4">
              {ticket.updates.map((update, index) => (
                <div key={index} className="rounded-md bg-muted p-4">
                  <div className="mb-2 flex justify-between">
                    <span className="font-medium">{update.author}</span>
                    <span className="text-sm text-muted-foreground">{update.date}</span>
                  </div>
                  <p className="text-sm">{update.message}</p>
                </div>
              ))}
            </div>
          </div>

          {isEditing && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Adicionar comentário:</h4>
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Adicione um comentário ao seu ticket..."
                rows={2}
              />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancelEdit}>
                <X className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
              <Button onClick={handleSaveEdit}>
                <Save className="mr-2 h-4 w-4" />
                Salvar
              </Button>
            </>
          ) : (
            canEdit && (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                Adicionar Comentário
              </Button>
            )
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

