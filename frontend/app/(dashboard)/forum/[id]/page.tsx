"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Calendar, MapPin, Users, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { format } from "date-fns"
import { pt } from "date-fns/locale"
import { cn } from "@/lib/utils"

// Função para obter detalhes do evento pelo ID - numa aplicação real, isto viria da sua API
const getEventoDetalhes = (id: string) => {
  // Obter a data atual e criar datas futuras para o novo evento
  const hoje = new Date()
  const dataEvento = new Date(hoje)
  dataEvento.setMonth(dataEvento.getMonth() + 1) // Evento daqui a 1 mês

  const prazoInscricao = new Date(hoje)
  prazoInscricao.setDate(prazoInscricao.getDate() + 20) // Prazo de inscrição até daqui a 20 dias

  // Dados de exemplo
  const eventos = [
    {
      id: 1,
      nome: "Assembleia Geral de Condomínio",
      data: new Date(2023, 5, 15, 18, 30),
      tipo: "Reunião",
      capacidadeMaxima: 50,
      prazoInscricao: new Date(2023, 5, 10),
      localizacao: "Sala de Reuniões do Condomínio",
      descricao:
        "Assembleia Geral Ordinária para discussão do orçamento anual, aprovação de contas e eleição dos novos membros do conselho. É importante a presença de todos os condóminos. Serão discutidos temas importantes como a renovação das áreas comuns e a implementação de novas medidas de segurança.",
      participantes: 32,
    },
    {
      id: 2,
      nome: "Manutenção da Piscina",
      data: new Date(2023, 6, 10, 9, 0),
      tipo: "Alerta",
      capacidadeMaxima: 0,
      prazoInscricao: new Date(2023, 6, 1),
      localizacao: "Área da Piscina",
      descricao:
        "A piscina estará fechada para manutenção e limpeza. Pedimos a compreensão de todos os moradores. A manutenção inclui a substituição de azulejos danificados, limpeza profunda e verificação do sistema de filtragem.",
      participantes: 0,
    },
    {
      id: 3,
      nome: "Festa de Verão do Condomínio",
      data: new Date(2023, 7, 20, 16, 0),
      tipo: "Evento",
      capacidadeMaxima: 100,
      prazoInscricao: new Date(2023, 7, 15),
      localizacao: "Jardim do Condomínio",
      descricao:
        "Venha participar da nossa festa de verão anual! Teremos música, comida, bebidas e atividades para todas as idades. É uma ótima oportunidade para conhecer seus vizinhos e desfrutar de um dia agradável ao ar livre. Traga sua família e amigos!",
      participantes: 78,
    },
    {
      id: 4,
      nome: "Reunião Extraordinária",
      data: new Date(2023, 8, 5, 19, 0),
      tipo: "Reunião",
      capacidadeMaxima: 50,
      prazoInscricao: new Date(2023, 8, 3),
      localizacao: "Sala de Reuniões do Condomínio",
      descricao:
        "Reunião extraordinária para discutir questões urgentes relacionadas à segurança do condomínio. Será apresentado um novo sistema de controle de acesso e discutidas medidas adicionais de segurança após os recentes incidentes na vizinhança.",
      participantes: 45,
    },
    {
      id: 5,
      nome: "Corte de Água Programado",
      data: new Date(2023, 8, 12, 8, 0),
      tipo: "Alerta",
      capacidadeMaxima: 0,
      prazoInscricao: new Date(2023, 8, 10),
      localizacao: "Todo o Condomínio",
      descricao:
        "Informamos que haverá um corte de água programado para manutenção da rede hidráulica. O corte está previsto para durar aproximadamente 5 horas. Recomendamos que os moradores armazenem água para uso durante este período.",
      participantes: 0,
    },
    // Adicionar novo evento com data futura para testar o botão de confirmação
    {
      id: 6,
      nome: "Workshop de Sustentabilidade",
      data: dataEvento,
      tipo: "Evento",
      capacidadeMaxima: 30,
      prazoInscricao: prazoInscricao,
      localizacao: "Auditório Central",
      descricao:
        "Aprenda práticas sustentáveis para implementar em sua residência e no condomínio. Especialistas vão compartilhar dicas sobre economia de água, energia, reciclagem e compostagem. Haverá distribuição de material educativo e sorteio de kits ecológicos entre os participantes. Não perca esta oportunidade de contribuir para um mundo mais sustentável!",
      participantes: 12,
    },
  ]

  return eventos.find((evento) => evento.id === Number.parseInt(id))
}

// Função para obter a cor do badge com base no tipo de evento
const getTipoBadgeClass = (tipo: string) => {
  switch (tipo) {
    case "Reunião":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100"
    case "Alerta":
      return "bg-red-100 text-red-800 hover:bg-red-100"
    case "Evento":
      return "bg-green-100 text-green-800 hover:bg-green-100"
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100"
  }
}

export default function EventoDetalhe({ params }: { params: { id: string } }) {
  const router = useRouter()
  const evento = getEventoDetalhes(params.id)
  const [presencaConfirmada, setPresencaConfirmada] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error"
    message: string
  } | null>(null)

  // Verificar se o usuário já confirmou presença ao carregar a página
  useEffect(() => {
    if (evento) {
      // Em uma aplicação real, você buscaria esta informação da API
      // Aqui estamos apenas simulando com localStorage
      const confirmacoes = localStorage.getItem("eventosConfirmados")
      if (confirmacoes) {
        const eventosConfirmados = JSON.parse(confirmacoes)
        setPresencaConfirmada(eventosConfirmados.includes(evento.id))
      }
    }
  }, [evento])

  // Função para confirmar ou cancelar presença
  const togglePresenca = async () => {
    if (!evento) return

    setIsLoading(true)

    try {
      // Simular uma chamada de API
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Atualizar o estado local
      const novoEstado = !presencaConfirmada
      setPresencaConfirmada(novoEstado)

      // Em uma aplicação real, você enviaria esta informação para a API
      // Aqui estamos apenas simulando com localStorage
      const confirmacoes = localStorage.getItem("eventosConfirmados")
      let eventosConfirmados = confirmacoes ? JSON.parse(confirmacoes) : []

      if (novoEstado) {
        // Adicionar à lista de confirmados
        if (!eventosConfirmados.includes(evento.id)) {
          eventosConfirmados.push(evento.id)
        }
        setStatusMessage({
          type: "success",
          message: `Você confirmou sua presença em "${evento.nome}"`,
        })
      } else {
        // Remover da lista de confirmados
        eventosConfirmados = eventosConfirmados.filter((id: number) => id !== evento.id)
        setStatusMessage({
          type: "success",
          message: `Você cancelou sua presença em "${evento.nome}"`,
        })
      }

      localStorage.setItem("eventosConfirmados", JSON.stringify(eventosConfirmados))
    } catch (error) {
      console.error("Erro ao confirmar presença:", error)
      setStatusMessage({
        type: "error",
        message: "Ocorreu um erro ao processar sua solicitação",
      })
    } finally {
      setIsLoading(false)

      // Limpar a mensagem após 3 segundos
      setTimeout(() => {
        setStatusMessage(null)
      }, 3000)
    }
  }

  // Verificar se o evento permite confirmação de presença
  const podeConfirmarPresenca =
    evento && (evento.tipo === "Evento" || evento.tipo === "Reunião") && new Date() < evento.prazoInscricao

  if (!evento) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.push("/forum")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Evento não encontrado</h1>
        </div>
        <p>O evento que procura não existe ou foi removido.</p>
        <Button onClick={() => router.push("/forum")}>Voltar para o Fórum</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.push("/forum")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">{evento.nome}</h1>
        <Badge className={getTipoBadgeClass(evento.tipo)} variant="outline">
          {evento.tipo}
        </Badge>
      </div>

      {statusMessage && (
        <div
          className={cn(
            "p-4 rounded-md",
            statusMessage.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800",
          )}
        >
          {statusMessage.message}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Detalhes do Evento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Data do Evento</p>
                <p>{format(evento.data, "d 'de' MMMM 'de' yyyy, HH:mm", { locale: pt })}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Localização</p>
                <p>{evento.localizacao}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Participantes</p>
                <p>
                  {evento.participantes} / {evento.capacidadeMaxima}
                  {evento.tipo !== "Alerta" && evento.participantes < evento.capacidadeMaxima && (
                    <span className="ml-2 text-sm text-green-600">(Vagas disponíveis)</span>
                  )}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="mb-2 font-medium">Descrição</h3>
            <p className="whitespace-pre-line">{evento.descricao}</p>
          </div>

          <Separator />

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium">Prazo de Inscrição</p>
              <p>{format(evento.prazoInscricao, "d 'de' MMMM 'de' yyyy", { locale: pt })}</p>
            </div>

            {podeConfirmarPresenca && (
              <Button
                onClick={togglePresenca}
                disabled={isLoading}
                variant={presencaConfirmada ? "outline" : "default"}
                className={cn(
                  "min-w-[180px]",
                  presencaConfirmada && "border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700",
                )}
              >
                {isLoading ? (
                  "Processando..."
                ) : presencaConfirmada ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Presença Confirmada
                  </>
                ) : (
                  "Confirmar Presença"
                )}
              </Button>
            )}

            {evento.tipo !== "Alerta" && new Date() >= evento.prazoInscricao && (
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300">
                Prazo de inscrição encerrado
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

