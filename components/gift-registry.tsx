"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Gift, Check, QrCode, Copy } from "lucide-react"
import { cn } from "@/lib/utils"

const STORAGE_URL = process.env.NEXT_PUBLIC_STORAGE_URL || "http://localhost:9002/yasmin-15"

interface GiftItem {
  id: number
  name: string
  claimed: boolean
}

const STORAGE_KEY = "yasmin-gifts-v3"

const defaultGifts: GiftItem[] = [
  { id: 1, name: "Perfume (frutado, floral e suave)", claimed: false },
  { id: 2, name: "Joias (prata, ouro ou semijoias; anel tamanho: 14)", claimed: false },
  { id: 3, name: "Maquiagem (natural, tons coral ou cereja)", claimed: false },
  {
    id: 4,
    name: "Livro (sou difícil com livros; se não quiser arriscar, cartão-presente da livraria)",
    claimed: false,
  },
  { id: 5, name: "Roupa (PP ou P, calça tamanho: 34)", claimed: false },
  { id: 6, name: "Cartão-presente", claimed: false },
  { id: 7, name: "Sapato (número: 37)", claimed: false },
  { id: 8, name: "Relógio (pequeno e fino, analógico ou digital)", claimed: false },
  { id: 9, name: "Fone de ouvido (bluetooth)", claimed: false },
  { id: 10, name: "Câmera fotográfica (analógica ou digital)", claimed: false },
  { id: 11, name: "Vale massagem ou outra experiência", claimed: false },
  { id: 12, name: "Decoração para o quarto (discos da Billie Eilish, etc)", claimed: false },
  { id: 13, name: "Workshop de gastronomia ou outra experiência", claimed: false },
  { id: 14, name: "Cesta personalizada (petiscos milk free, produtos, etc)", claimed: false },
  { id: 15, name: "Jogos (tabuleiro, cartas, etc)", claimed: false },
  { id: 16, name: "Material de papelaria", claimed: false },
  { id: 17, name: "Skincare (pele oleosa; produtos destinados para esse tipo)", claimed: false },
]

export function GiftRegistry() {
  const [gifts, setGifts] = useState<GiftItem[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setGifts(JSON.parse(stored))
      } else {
        setGifts(defaultGifts)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultGifts))
      }
    } catch (error) {
      console.error("[v0] Error loading gifts:", error)
      setGifts(defaultGifts)
    } finally {
      setLoading(false)
    }
  }, [])

  const toggleGift = (id: number) => {
    setGifts((prevGifts) => {
      const updatedGifts = prevGifts.map((gift) => (gift.id === id ? { ...gift, claimed: !gift.claimed } : gift))
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedGifts))
      } catch (error) {
        console.error("[v0] Error saving gifts:", error)
      }
      return updatedGifts
    })
  }

  const copyPixCode = async () => {
    const pixCode =
      "00020101021126580014br.gov.bcb.pix0136bcf53586-a982-4700-ad63-a41fc39bd9325204000053039865802BR5921YASMIN CRISTINA MATOS6007PALHOCA62070503***63041427"
    try {
      await navigator.clipboard.writeText(pixCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("[v0] Error copying PIX code:", error)
    }
  }

  if (loading) {
    return (
      <section className="py-20 md:py-32 bg-secondary/20">
        <div className="container mx-auto px-4">
          <p className="text-center text-muted-foreground">Carregando lista de presentes...</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 md:py-32 bg-secondary/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Gift className="w-8 h-8 text-primary" />
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground text-center">Lista de Presentes</h2>
        </div>

        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Clique no presente que deseja dar para Yasmin. Os presentes escolhidos ficarão marcados.
        </p>

        <div className="max-w-4xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {gifts.map((gift) => (
            <Card
              key={gift.id}
              className={cn(
                "p-6 transition-all duration-300 cursor-pointer hover:shadow-lg",
                gift.claimed
                  ? "bg-primary/10 border-primary shadow-md"
                  : "bg-card border-border hover:border-primary/50",
              )}
              onClick={() => toggleGift(gift.id)}
            >
              <div className="flex items-center justify-between">
                <span className={cn("text-lg font-medium", gift.claimed ? "text-primary" : "text-card-foreground")}>
                  {gift.name}
                </span>
                {gift.claimed && <Check className="w-5 h-5 text-primary flex-shrink-0" />}
              </div>
              {gift.claimed && <p className="text-sm text-primary/70 mt-2">Presente escolhido</p>}
            </Card>
          ))}
        </div>

        <div className="mt-16 max-w-2xl mx-auto">
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <QrCode className="w-6 h-6 text-primary" />
              <h3 className="text-2xl font-serif font-bold text-foreground">Presente Virtual</h3>
            </div>

            <p className="text-muted-foreground mb-6 leading-relaxed">
              Se preferir, você também pode presentear a Yasmin com um mimo virtual via PIX. Seu carinho será muito
              especial e ajudará a realizar seus sonhos!
            </p>

            <div className="bg-background p-6 rounded-lg inline-block">
              <img
                src={`${STORAGE_URL}/assets/pix-qrcode.png`}
                alt="QR Code PIX"
                className="w-64 h-64 mx-auto"
              />
              <p className="text-sm text-muted-foreground mt-4 mb-4">Escaneie o QR Code para enviar seu mimo</p>

              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-sm font-medium text-foreground mb-2">Ou copie o código PIX:</p>
                <div className="bg-muted p-3 rounded text-xs font-mono break-all text-muted-foreground mb-3">
                  00020101021126580014br.gov.bcb.pix0136bcf53586-a982-4700-ad63-a41fc39bd9325204000053039865802BR5921YASMIN
                  CRISTINA MATOS6007PALHOCA62070503***63041427
                </div>
                <Button onClick={copyPixCode} variant="outline" className="w-full bg-transparent">
                  <Copy className="w-4 h-4 mr-2" />
                  {copied ? "Copiado!" : "Copiar código PIX"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
