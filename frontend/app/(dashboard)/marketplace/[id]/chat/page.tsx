"use client"

import { useState, useEffect, useRef } from "react"
import { ArrowLeft, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CardFooter } from "@/components/ui/card"

type Message = {
  id: number
  message: string
  sender: "user" | "seller"
  created_at: string
}

type ChatProps = {
  selectedConversation: number
}

let ad_id = 0;

const getAuthToken = () => {
  const match = document.cookie.match(/(^| )authToken=([^;]+)/)
  return match ? match[2] : null
}

export default function Chat({ selectedConversation }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [message, setMessage] = useState("")
  const [userId, setUserId] = useState<number | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function fetchMessages() {
      const authToken = getAuthToken()
      if (!authToken) return
      
      try {
        const response = await fetch(`http://localhost:8000/api/marketplace/chat/${selectedConversation}/messages`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${authToken}`,
            "Content-Type": "application/json"
          }
        })
        if (!response.ok) {
          throw new Error("Erro ao carregar mensagens")
        }
        const data = await response.json()
        ad_id = data.ad_id
        setMessages(data.messages.map((msg: any) => ({
          id: msg.id,
          message: msg.message,
          sender: msg.sent_by === data.userId ? "user" : "seller",
          created_at: msg.created_at
        })))
        setUserId(data.userId)
      } catch (error) {
        console.error("Erro ao buscar mensagens:", error)
      }
    }
    fetchMessages()
  }, [selectedConversation])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return
    
    const authToken = getAuthToken()
    if (!authToken) return

    const newMessage: Message = {
      id: messages.length + 1,
      message: message,
      sender: "user",
      created_at: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, newMessage])
    setMessage("")

    try {
      await fetch(`http://localhost:8000/api/marketplace/sendmessage`, {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${authToken}`,
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({ message: message, chat_id: selectedConversation, anuncio_id: ad_id })
      })
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error)
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-4 border-b p-4">
        <Button variant="outline" size="icon">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Chat com o vendedor</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                msg.sender === "user" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
              }`}
            >
              <p>{msg.message}</p>
              <p className="text-right text-xs">
                {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <CardFooter className="border-t p-4">
        <form onSubmit={handleSendMessage} className="flex w-full space-x-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Escreva sua mensagem..."
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
            <span className="sr-only">Enviar</span>
          </Button>
        </form>
      </CardFooter>
    </div>
  )
}