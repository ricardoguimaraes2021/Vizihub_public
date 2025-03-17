"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

const getAuthToken = () => {
  const match = document.cookie.match(/(^| )authToken=([^;]+)/)
  return match ? match[2] : null
}

export default function MensagensPage() {
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null)
  const [conversations, setConversations] = useState<any[]>([])
  const [loading, setLoading] = useState(true) 
  const router = useRouter()

  useEffect(() => {
    async function fetchConversations() {
      try {
        const token = getAuthToken()
        if (!token) {
          router.push("/login")
          return
        }

        const response = await fetch("http://localhost:8000/api/marketplace/getchats", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Erro ao carregar as conversas")
        }

        const data = await response.json()
        setConversations(data.chats) 
        setLoading(false) 

      } catch (error: any) {
        console.error(error)
        router.push("/login")
      }
    }

    fetchConversations()
  }, [router])

  if (loading) {
    return <p>Carregando...</p>
  }

  if (conversations.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-center">
        <div className="space-y-2">
          <p className="text-lg font-medium">Nenhuma conversa disponível</p>
          <p className="text-sm text-muted-foreground">Suas conversas com vendedores aparecerão aqui.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-12rem)] gap-6 rounded-lg border">
      {/* Lista de conversas */}
      <div className="w-full max-w-sm border-r">
        <div className="flex h-full flex-col">
          <div className="border-b p-4">
            <h2 className="text-lg font-semibold">Mensagens</h2>
          </div>
          <div className="flex-1 overflow-auto">
            {conversations.map((conversation) => (
              <button
                key={conversation.ad.title}
                onClick={() => setSelectedConversation(conversation.ad.title)}
                className={cn(
                  "w-full border-b p-4 text-left transition-colors hover:bg-muted/50",
                  selectedConversation === conversation.ad.title && "bg-muted",
                  !conversation.ad.title && "bg-muted/30"
                )}
              >
                <div className="flex items-start gap-3">
                  <Image
                    src={conversation.img || "/placeholder.svg"}
                    alt={conversation.ad.id}
                    width={50}
                    height={50}
                    className="rounded-md object-cover"
                  />
                  <div className="flex-1 space-y-1">
                    <p className="font-medium line-clamp-1">{conversation.ad.title}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-muted-foreground">{conversation.buyer.name}</p>
                    </div>
                    <p className="text-sm line-clamp-1">{conversation.messages[0].message}</p>
                    <p className="text-xs text-muted-foreground">
                      {conversation.messages[0].date_time}
                    </p>
                  </div>
                </div>
              </button>
            ))}
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
