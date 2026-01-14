"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { MessageCircleHeart, Send, Heart, Sparkles, Trash2, Star } from "lucide-react"
import useSWR from "swr"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Message {
  id: string
  url: string
  objectName: string
  guestName: string
  message: string
  createdAt: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const CARD_COLORS = [
  "from-accent/20 to-primary/10 border-accent/30",
  "from-primary/20 to-secondary/10 border-primary/30",
  "from-secondary/20 to-accent/10 border-secondary/30",
  "from-chart-2/20 to-chart-4/10 border-chart-2/30",
  "from-chart-4/20 to-accent/10 border-chart-4/30",
]

export function WishesSection() {
  const [guestName, setGuestName] = useState("")
  const [message, setMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [deletePassword, setDeletePassword] = useState("")
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [passwordError, setPasswordError] = useState(false)

  const { data, mutate } = useSWR<{ messages: Message[] }>("/api/messages/list", fetcher, {
    refreshInterval: 10000,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!message.trim()) {
      alert("Por favor, escreva uma mensagem!")
      return
    }

    if (message.length > 500) {
      alert("Mensagem muito longa! Máximo de 500 caracteres.")
      return
    }

    setSending(true)
    try {
      const response = await fetch("/api/messages/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          guestName: guestName.trim() || "Convidado",
          message: message.trim(),
        }),
      })

      if (response.ok) {
        mutate()
        setGuestName("")
        setMessage("")
      } else {
        const error = await response.json()
        alert(error.error || "Erro ao enviar mensagem")
      }
    } catch (error) {
      console.error("Error sending message:", error)
      alert("Erro ao enviar mensagem. Tente novamente.")
    } finally {
      setSending(false)
    }
  }

  const handleDeleteClick = (objectName: string) => {
    setMessageToDelete(objectName)
    setDeletePassword("")
    setPasswordError(false)
  }

  const handleDeleteConfirm = async () => {
    if (deletePassword !== "yasmin2026") {
      setPasswordError(true)
      return
    }

    if (!messageToDelete) return

    setDeleting(true)
    try {
      const response = await fetch("/api/messages/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ objectName: messageToDelete }),
      })

      if (response.ok) {
        mutate()
        setMessageToDelete(null)
        setDeletePassword("")
        setPasswordError(false)
      } else {
        alert("Erro ao excluir mensagem. Tente novamente.")
      }
    } catch (error) {
      console.error("Delete failed:", error)
      alert("Erro ao excluir mensagem. Tente novamente.")
    } finally {
      setDeleting(false)
    }
  }

  const handleCloseDeleteDialog = () => {
    setMessageToDelete(null)
    setDeletePassword("")
    setPasswordError(false)
  }

  const messages = data?.messages || []

  return (
    <section className="py-20 px-4 relative">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Star className="w-6 h-6 text-accent" />
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">Mural de Recados</h2>
            <Star className="w-6 h-6 text-accent" />
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Deixe sua mensagem especial para a Yasmin! Seus votos e carinho ficarão eternizados aqui.
          </p>
        </div>

        {/* Message Form */}
        <Card className="p-6 md:p-8 mb-12 bg-card/50 backdrop-blur-sm border-2 border-accent/20">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-2">
              <MessageCircleHeart className="w-5 h-5 text-accent" />
              <h3 className="text-xl font-semibold text-foreground">Deixe seu recado</h3>
            </div>

            <Input
              type="text"
              placeholder="Seu nome"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className="bg-background/50"
              maxLength={50}
            />

            <div className="relative">
              <textarea
                placeholder="Escreva sua mensagem para a Yasmin..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full min-h-[120px] p-4 rounded-lg bg-background/50 border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                maxLength={500}
              />
              <span className="absolute bottom-2 right-3 text-xs text-muted-foreground">
                {message.length}/500
              </span>
            </div>

            <Button type="submit" disabled={sending} className="w-full md:w-auto md:self-end">
              <Send className="w-4 h-4 mr-2" />
              {sending ? "Enviando..." : "Enviar Recado"}
            </Button>
          </form>
        </Card>

        {/* Messages Grid */}
        {messages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {messages.map((msg, index) => (
              <Card
                key={msg.id}
                className={`group relative p-5 bg-gradient-to-br ${CARD_COLORS[index % CARD_COLORS.length]} backdrop-blur-sm border-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-accent/10 animate-in fade-in slide-in-from-bottom-4`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => handleDeleteClick(msg.objectName)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground truncate">{msg.guestName}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(msg.createdAt).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-foreground/90 leading-relaxed whitespace-pre-wrap break-words">
                  {msg.message}
                </p>

                <Sparkles className="absolute bottom-3 right-3 w-4 h-4 text-accent/30" />
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <MessageCircleHeart className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">
              Seja o primeiro a deixar um recado especial para a Yasmin!
            </p>
          </div>
        )}

        {/* Message Counter */}
        {messages.length > 0 && (
          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-accent">{messages.length}</span>{" "}
              {messages.length === 1 ? "recado enviado" : "recados enviados"} com carinho
            </p>
          </div>
        )}
      </div>

      {/* Delete Password Dialog */}
      <Dialog open={!!messageToDelete} onOpenChange={handleCloseDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir recado</DialogTitle>
            <DialogDescription>
              Digite a senha para excluir este recado. Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 mt-4">
            <Input
              type="password"
              placeholder="Senha"
              value={deletePassword}
              onChange={(e) => {
                setDeletePassword(e.target.value)
                setPasswordError(false)
              }}
              onKeyDown={(e) => e.key === "Enter" && handleDeleteConfirm()}
              className={passwordError ? "border-destructive" : ""}
            />
            {passwordError && (
              <p className="text-sm text-destructive">Senha incorreta!</p>
            )}
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={handleCloseDeleteDialog} disabled={deleting}>
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteConfirm}
                disabled={deleting}
              >
                {deleting ? "Excluindo..." : "Excluir"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}
