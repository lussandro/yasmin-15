"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Upload, Camera, Sparkles, Heart, Lock, Download, Calendar, Trash2, Video } from "lucide-react"
import useSWR from "swr"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Photo {
  url: string
  objectName: string
  guestName: string
  uploadedAt: string
  isVideo?: boolean
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const PARTY_DATE = new Date("2026-01-09T20:00:00-03:00") // January 9, 2026 at 8 PM

export function LivePhotoGallery() {
  const [guestName, setGuestName] = useState("")
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [adminPassword, setAdminPassword] = useState("")
  const [isAdmin, setIsAdmin] = useState(false)
  const [showAdminDialog, setShowAdminDialog] = useState(false)
  const [daysUntilParty, setDaysUntilParty] = useState(0)
  const [partyStarted, setPartyStarted] = useState(false)
  const [photoToDelete, setPhotoToDelete] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const { data, mutate } = useSWR<{ photos: Photo[] }>("/api/party-photos/list", fetcher, {
    refreshInterval: 5000,
  })

  useEffect(() => {
    const calculateCountdown = () => {
      const now = new Date()
      const diff = PARTY_DATE.getTime() - now.getTime()
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24))

      setDaysUntilParty(days)
      setPartyStarted(diff <= 0)
    }

    calculateCountdown()
    const interval = setInterval(calculateCountdown, 1000 * 60 * 60) // Update every hour

    return () => clearInterval(interval)
  }, [])

  const handleAdminLogin = () => {
    if (adminPassword === "Yasmin@2025") {
      setIsAdmin(true)
      setShowAdminDialog(false)
      setAdminPassword("")
    } else {
      alert("Senha incorreta!")
      setAdminPassword("")
    }
  }

  const handleDownloadAll = async () => {
    if (!data?.photos || data.photos.length === 0) {
      alert("Não há fotos para baixar!")
      return
    }

    try {
      // Download each photo
      for (const photo of data.photos) {
        const response = await fetch(photo.url)
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        const ext = photo.isVideo ? "mp4" : "jpg"
        a.download = `yasmin-15anos-${photo.guestName}-${new Date(photo.uploadedAt).getTime()}.${ext}`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)

        // Small delay between downloads
        await new Promise((resolve) => setTimeout(resolve, 500))
      }
    } catch (error) {
      console.error("Erro ao baixar fotos:", error)
      alert("Erro ao baixar fotos. Tente novamente.")
    }
  }

  const handleUpload = async (file: File) => {
    if (!file) return

    if (!partyStarted) {
      alert(
        `As fotos só podem ser enviadas após o início da festa!\nFaltam ${daysUntilParty} dias para a festa começar.`,
      )
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("guestName", guestName || "Convidado")

      const response = await fetch("/api/party-photos/upload", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        mutate()
        setGuestName("")

        const fileInput = document.getElementById("file-input") as HTMLInputElement
        if (fileInput) fileInput.value = ""
      }
    } catch (error) {
      console.error("Upload failed:", error)
    } finally {
      setUploading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleUpload(file)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const file = e.dataTransfer.files?.[0]
    if (file && (file.type.startsWith("image/") || file.type.startsWith("video/"))) {
      handleUpload(file)
    }
  }

  const handleDeletePhoto = async (objectName: string) => {
    setDeleting(true)
    try {
      const response = await fetch("/api/party-photos/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ objectName }),
      })

      if (response.ok) {
        mutate()
        setPhotoToDelete(null)
      } else {
        alert("Erro ao excluir foto. Tente novamente.")
      }
    } catch (error) {
      console.error("Delete failed:", error)
      alert("Erro ao excluir foto. Tente novamente.")
    } finally {
      setDeleting(false)
    }
  }

  const photos = data?.photos || []

  return (
    <section className="py-20 px-4 relative">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-accent" />
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">Galeria da Festa</h2>
            <Sparkles className="w-6 h-6 text-accent" />
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Compartilhe os melhores momentos da festa! Suas fotos e vídeos aparecerão aqui em tempo real.
          </p>

          {!partyStarted && (
            <div className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-accent/20 rounded-full border border-accent/30">
              <Calendar className="w-5 h-5 text-accent" />
              <p className="text-lg font-semibold text-foreground">
                Faltam <span className="text-accent text-2xl mx-1">{daysUntilParty}</span>
                {daysUntilParty === 1 ? "dia" : "dias"} para a festa!
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end mb-4">
          {!isAdmin ? (
            <Dialog open={showAdminDialog} onOpenChange={setShowAdminDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Lock className="w-4 h-4" />
                  Admin
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Acesso Administrativo</DialogTitle>
                  <DialogDescription>Digite a senha para acessar as funções administrativas</DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4 mt-4">
                  <Input
                    type="password"
                    placeholder="Senha"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAdminLogin()}
                  />
                  <Button onClick={handleAdminLogin}>Entrar</Button>
                </div>
              </DialogContent>
            </Dialog>
          ) : (
            <div className="flex gap-2">
              <Button onClick={handleDownloadAll} variant="outline" size="sm" className="gap-2 bg-transparent">
                <Download className="w-4 h-4" />
                Baixar Todas ({photos.length})
              </Button>
              <Button onClick={() => setIsAdmin(false)} variant="outline" size="sm">
                Sair
              </Button>
            </div>
          )}
        </div>

        {/* Upload Section */}
        <Card className="p-6 md:p-8 mb-12 bg-card/50 backdrop-blur-sm border-2 border-accent/20">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-2">
              <Camera className="w-5 h-5 text-accent" />
              <h3 className="text-xl font-semibold text-foreground">Envie sua foto ou vídeo</h3>
            </div>

            {!partyStarted && (
              <div className="bg-accent/10 border border-accent/30 rounded-lg p-4 mb-2">
                <p className="text-sm text-foreground font-medium">
                  ⏰ O envio de fotos e vídeos estará disponível apenas após o início da festa
                </p>
                <p className="text-xs text-muted-foreground mt-1">Data: 09/01/2026 às 20h</p>
              </div>
            )}

            <Input
              type="text"
              placeholder="Seu nome (opcional)"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className="bg-background/50"
              disabled={!partyStarted}
            />

            <div
              className={`relative border-2 border-dashed rounded-lg p-8 transition-all ${
                !partyStarted
                  ? "border-muted-foreground/20 bg-muted/20 cursor-not-allowed opacity-50"
                  : dragActive
                    ? "border-accent bg-accent/10"
                    : "border-muted-foreground/30 hover:border-accent/50"
              }`}
              onDragEnter={partyStarted ? handleDrag : undefined}
              onDragLeave={partyStarted ? handleDrag : undefined}
              onDragOver={partyStarted ? handleDrag : undefined}
              onDrop={partyStarted ? handleDrop : undefined}
            >
              <input
                id="file-input"
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
                disabled={uploading || !partyStarted}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              />
              <div className="flex flex-col items-center gap-3 text-center pointer-events-none">
                <Upload className="w-12 h-12 text-accent" />
                <div>
                  <p className="text-lg font-medium text-foreground">
                    {uploading
                      ? "Enviando..."
                      : partyStarted
                        ? "Clique ou arraste sua foto ou vídeo aqui"
                        : "Aguardando início da festa..."}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">Fotos (PNG, JPG) ou Vídeos (MP4, MOV) até 50MB</p>
                </div>
              </div>
            </div>

            <Button
              onClick={() => document.getElementById("file-input")?.click()}
              disabled={uploading || !partyStarted}
              className="w-full md:w-auto"
            >
              <Camera className="w-4 h-4 mr-2" />
              {uploading ? "Enviando..." : "Escolher Foto ou Vídeo"}
            </Button>
          </div>
        </Card>

        {/* Photos Grid */}
        {photos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {photos.map((photo, index) => (
              <Card
                key={photo.url}
                className="group overflow-hidden bg-card/30 backdrop-blur-sm border-accent/20 hover:border-accent/50 transition-all duration-300 hover:scale-[1.02] animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {photo.isVideo ? (
                  <a href={photo.url} target="_blank" rel="noopener noreferrer" className="block relative cursor-pointer">
                    <div className="w-full aspect-video bg-black flex items-center justify-center">
                      <Video className="w-16 h-16 text-accent" />
                    </div>
                    {isAdmin && (
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 z-10"
                        onClick={(e) => { e.preventDefault(); setPhotoToDelete(photo.objectName); }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                    <div className="p-3 bg-card/80">
                      <div className="flex items-center gap-2 text-foreground">
                        <Video className="w-4 h-4 text-accent" />
                        <p className="font-medium">{photo.guestName}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Clique para assistir - {new Date(photo.uploadedAt).toLocaleString("pt-BR", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </a>
                ) : (
                  <div className="relative aspect-square">
                    <img
                      src={photo.url || "/placeholder.svg"}
                      alt={`Foto de ${photo.guestName}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {isAdmin && (
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        onClick={() => setPhotoToDelete(photo.objectName)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <div className="flex items-center gap-2 text-foreground">
                        <Heart className="w-4 h-4 text-accent" />
                        <p className="font-medium">{photo.guestName}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(photo.uploadedAt).toLocaleString("pt-BR", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Camera className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">
              {partyStarted
                ? "Seja o primeiro a compartilhar uma foto ou vídeo da festa!"
                : "As fotos e vídeos aparecerão aqui durante a festa!"}
            </p>
          </div>
        )}

        {/* Photo Counter */}
        {photos.length > 0 && (
          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-accent">{photos.length}</span>{" "}
              {photos.length === 1 ? "arquivo compartilhado" : "arquivos compartilhados"}
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!photoToDelete} onOpenChange={() => setPhotoToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir foto?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A foto será permanentemente removida da galeria.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => photoToDelete && handleDeletePhoto(photoToDelete)}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  )
}
