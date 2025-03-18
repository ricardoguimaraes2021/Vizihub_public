"use client"

import { useState, useEffect, useRef } from "react"
import { ArrowLeft, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


type Message = {
  id: number
  text: string
  sender: "user" | "seller"
  timestamp: Date
}

type ChatProps = {
  selectedConversation: number
}

export default function Chat({ selectedConversation }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [message, setMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Simular mensagens para a conversa selecionada
    const initialMessages: Message[] = [
      {
        id: 1,
        text: "Olá! Estou interessado no seu produto. Ainda está disponível?",
        sender: "user",
        timestamp: new Date(Date.now() - 3600000), // 1 hora atrás
      },
      {
        id: 2,
        text: "Sim, está disponível!",
        sender: "seller",
        timestamp: new Date(Date.now() - 3500000), // 58 minutos atrás
      },
    ]
    setMessages(initialMessages)
  }, [selectedConversation]) // Atualizar quando mudar a conversa selecionada

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    const userMessage: Message = {
      id: messages.length + 1,
      text: message,
      sender: "user",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setMessage("")

    setTimeout(() => {
      const sellerMessage: Message = {
        id: messages.length + 2,
        text: "Obrigado pela sua mensagem! Vou verificar e responder em breve.",
        sender: "seller",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, sellerMessage])
    }, 1000)
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
              <p>{msg.text}</p>
              <p className="text-right text-xs">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
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
