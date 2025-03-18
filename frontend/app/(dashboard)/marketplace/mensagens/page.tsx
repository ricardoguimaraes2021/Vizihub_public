"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { cn } from "@/lib/utils"
import Chat from "../[id]/chat/page.tsx"

const getAuthToken = () => {
  const match = document.cookie.match(/(^| )authToken=([^;]+)/)
  return match ? match[2] : null
}

export default function MensagensPage() {
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null)
  const [conversations, setConversations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const id = searchParams.get('id')
    if (id) {
      setSelectedConversation(Number(id))
    }
  }, [searchParams])

  useEffect(() => {
    async function fetchConversations() {
      try {
        const token = getAuthToken()
        if (!token) {
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
        setConversations(data.chatAds)
        setLoading(false)

      } catch (error: any) {
        console.error(error)
      }
    }

    fetchConversations()
  }, [])

  if (loading) {
    return <p>Carregando...</p>
  }

  if (conversations.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-center">
        <div className="space-y-2">
          <p className="text-lg font-medium">Nenhuma conversa disponível</p>
          <p className="text-sm text-muted-foreground">As suas conversas aparecerão aqui.</p>
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
                key={conversation.ad_chat}
                onClick={() => {
                  setSelectedConversation(conversation.ad_id);
                  router.replace(`/marketplace/mensagens?id=${conversation.ad_chat}`, { scroll: false });
                }}
                className={cn(
                  "w-full border-b p-4 text-left transition-colors hover:bg-muted/50",
                  selectedConversation === conversation.ad_id && "bg-muted"
                )}
              >
                <div className="flex items-start gap-3">
                  <Image
                    src={conversation.ad_img || "/placeholder.svg"}
                    alt={conversation.ad_id.toString()}
                    width={50}
                    height={50}
                    className="rounded-md object-cover"
                  />
                  <div className="flex-1 space-y-1">
                    <p className="font-medium line-clamp-1">{conversation.ad_title}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-muted-foreground">{conversation.username_chat}</p>
                    </div>
                    <p className="text-sm line-clamp-1">
                      {conversation.lastmessage ? conversation.lastmessage : "Ainda sem mensagens"}
                    </p>
                    <p className="text-sm text-muted-foreground">{conversation.date_time}</p>
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
          <Chat selectedConversation={selectedConversation} />
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground">Selecione uma conversa para começar</p>
          </div>
        )}
      </div>
    </div>
  )
}
