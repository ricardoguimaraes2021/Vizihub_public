"use client"

import { useState } from "react"
import Image from "next/image"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"

// Mock data - em uma aplicação real, isso viria da sua API
const conversations = [
  {
    id: 1,
    product: {
      id: 1,
      title: "Sofá de 3 lugares",
      image: "/placeholder.svg?height=50&width=50",
      price: 350,
    },
    seller: {
      id: 1,
      name: "João Silva",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    lastMessage: {
      text: "Olá! O sofá ainda está disponível?",
      timestamp: new Date(2024, 2, 6, 14, 30),
      isRead: false,
    },
  },
  {
    id: 2,
    product: {
      id: 2,
      title: "Mesa de jantar com 6 cadeiras",
      image: "/placeholder.svg?height=50&width=50",
      price: 450,
    },
    seller: {
      id: 2,
      name: "Maria Santos",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    lastMessage: {
      text: "Podemos combinar a entrega para amanhã?",
      timestamp: new Date(2024, 2, 5, 18, 45),
      isRead: true,
    },
  },
]

export default function MensagensPage() {
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null)

  return (
    <div className="flex h-[calc(100vh-12rem)] gap-6 rounded-lg border">
      {/* Lista de conversas */}
      <div className="w-full max-w-sm border-r">
        <div className="flex h-full flex-col">
          <div className="border-b p-4">
            <h2 className="text-lg font-semibold">Mensagens</h2>
          </div>
          <div className="flex-1 overflow-auto">
            {conversations.length > 0 ? (
              conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation.id)}
                  className={cn(
                    "w-full border-b p-4 text-left transition-colors hover:bg-muted/50",
                    selectedConversation === conversation.id && "bg-muted",
                    !conversation.lastMessage.isRead && "bg-muted/30",
                  )}
                >
                  <div className="flex items-start gap-3">
                    <Image
                      src={conversation.product.image || "/placeholder.svg"}
                      alt={conversation.product.title}
                      width={50}
                      height={50}
                      className="rounded-md object-cover"
                    />
                    <div className="flex-1 space-y-1">
                      <p className="font-medium line-clamp-1">{conversation.product.title}</p>
                      <div className="flex items-center gap-2">
                        <Image
                          src={conversation.seller.avatar || "/placeholder.svg"}
                          alt={conversation.seller.name}
                          width={20}
                          height={20}
                          className="rounded-full"
                        />
                        <p className="text-sm text-muted-foreground">{conversation.seller.name}</p>
                      </div>
                      <p className="text-sm line-clamp-1">{conversation.lastMessage.text}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(conversation.lastMessage.timestamp, "d 'de' MMMM 'às' HH:mm", {
                          locale: ptBR,
                        })}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="flex h-full items-center justify-center p-8 text-center">
                <div className="space-y-2">
                  <p className="text-lg font-medium">Nenhuma conversa disponível</p>
                  <p className="text-sm text-muted-foreground">Suas conversas com vendedores aparecerão aqui.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Área do chat */}
      <div className="flex-1 bg-muted/10">
        {selectedConversation ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground">Selecione uma mensagem para ver a conversa</p>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground">Selecione uma conversa para começar</p>
          </div>
        )}
      </div>
    </div>
  )
}

