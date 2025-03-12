"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Função para buscar os detalhes do produto pelo ID
const getProductDetails = (id: string) => {
  // Simulando dados do produto - em uma aplicação real, isso viria da sua API
  const products = [
    {
      id: 1,
      title: "Sofá de 3 lugares",
      price: 350,
      image: "/placeholder.svg?height=200&width=300",
      seller: {
        name: "João Silva",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: 2,
      title: "Mesa de jantar com 6 cadeiras",
      price: 450,
      image: "/placeholder.svg?height=200&width=300",
      seller: {
        name: "Maria Santos",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: 3,
      title: "Bicicleta Mountain Bike",
      price: 280,
      image: "/placeholder.svg?height=200&width=300",
      seller: {
        name: "Pedro Costa",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: 4,
      title: "iPhone 12 64GB",
      price: 550,
      image: "/placeholder.svg?height=200&width=300",
      seller: {
        name: "Ana Oliveira",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: 5,
      title: "Máquina de Café Expresso",
      price: 120,
      image: "/placeholder.svg?height=200&width=300",
      seller: {
        name: "Carlos Mendes",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: 6,
      title: "Guitarra Acústica",
      price: 180,
      image: "/placeholder.svg?height=200&width=300",
      seller: {
        name: "Sofia Almeida",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
  ]

  return products.find((product) => product.id === Number.parseInt(id))
}

// Tipo para as mensagens
type Message = {
  id: number
  text: string
  sender: "user" | "seller"
  timestamp: Date
}

export default function ChatPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Simular mensagens iniciais
  useEffect(() => {
    const initialMessages: Message[] = [
      {
        id: 1,
        text: "Olá! Estou interessado no seu produto. Ainda está disponível?",
        sender: "user",
        timestamp: new Date(Date.now() - 3600000), // 1 hora atrás
      },
      {
        id: 2,
        text: "Olá! Sim, o produto ainda está disponível.",
        sender: "seller",
        timestamp: new Date(Date.now() - 3500000), // 58 minutos atrás
      },
      {
        id: 3,
        text: "Ótimo! Aceita negociar o preço?",
        sender: "user",
        timestamp: new Date(Date.now() - 3400000), // 56 minutos atrás
      },
    ]
    setMessages(initialMessages)
  }, [])

  // Buscar detalhes do produto
  useEffect(() => {
    const productData = getProductDetails(params.id)
    if (productData) {
      setProduct(productData)
    }
    setLoading(false)
  }, [params.id])

  // Rolar para a última mensagem quando novas mensagens são adicionadas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    // Adicionar mensagem do usuário
    const userMessage: Message = {
      id: messages.length + 1,
      text: message,
      sender: "user",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setMessage("")

    // Simular resposta do vendedor após 1 segundo
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

  // Formatar hora da mensagem
  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  if (loading) {
    return <div className="flex items-center justify-center h-full">Carregando...</div>
  }

  if (!product) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.push("/marketplace")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Produto não encontrado</h1>
        </div>
        <p>O produto que você está procurando não existe ou foi removido.</p>
        <Button onClick={() => router.push("/marketplace")}>Voltar para o Marketplace</Button>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.push(`/marketplace/${params.id}`)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Chat com {product.seller.name}</h1>
      </div>

      <div className="grid flex-1 grid-cols-1 gap-6 overflow-hidden lg:grid-cols-4">
        {/* Informações do produto */}
        <Card className="hidden lg:block">
          <CardHeader>
            <CardTitle className="text-lg">Detalhes do Produto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="aspect-video overflow-hidden rounded-md">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.title}
                width={300}
                height={200}
                className="h-full w-full object-cover"
              />
            </div>
            <h3 className="font-medium">{product.title}</h3>
            <p className="font-bold">{product.price}€</p>
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={product.seller.avatar} alt={product.seller.name} />
                <AvatarFallback>{product.seller.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-sm">{product.seller.name}</span>
            </div>
          </CardContent>
        </Card>

        {/* Chat */}
        <Card className="flex flex-col lg:col-span-3">
          <CardHeader className="border-b px-4 py-3">
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={product.seller.avatar} alt={product.seller.name} />
                <AvatarFallback>{product.seller.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-base">{product.seller.name}</CardTitle>
                <p className="text-xs text-muted-foreground">Vendedor</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      msg.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    <p>{msg.text}</p>
                    <p
                      className={`text-right text-xs ${
                        msg.sender === "user" ? "text-primary-foreground/70" : "text-secondary-foreground/70"
                      }`}
                    >
                      {formatMessageTime(msg.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>
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
        </Card>
      </div>
    </div>
  )
}

