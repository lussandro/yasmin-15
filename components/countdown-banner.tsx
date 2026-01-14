"use client"

import { useState, useEffect } from "react"
import { Sparkles } from "lucide-react"

const PARTY_DATE = new Date("2026-01-09T20:00:00-03:00")

export function CountdownBanner() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [partyStarted, setPartyStarted] = useState(false)

  useEffect(() => {
    const calculateCountdown = () => {
      const now = new Date()
      const diff = PARTY_DATE.getTime() - now.getTime()

      if (diff <= 0) {
        setPartyStarted(true)
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeLeft({ days, hours, minutes, seconds })
    }

    calculateCountdown()
    const interval = setInterval(calculateCountdown, 1000)

    return () => clearInterval(interval)
  }, [])

  if (partyStarted) {
    return (
      <div className="bg-accent/20 border-b border-accent/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" />
            <p className="text-base font-semibold text-foreground">A festa começou!</p>
            <Sparkles className="w-5 h-5 text-accent" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-primary/10 border-b border-primary/20 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-6">
          <p className="text-sm font-medium text-muted-foreground">Faltam para a festa:</p>

          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center">
              <p className="text-2xl font-bold text-primary tabular-nums">{timeLeft.days}</p>
              <p className="text-xs text-muted-foreground">{timeLeft.days === 1 ? "dia" : "dias"}</p>
            </div>

            <span className="text-primary/50">:</span>

            <div className="flex flex-col items-center">
              <p className="text-2xl font-bold text-primary tabular-nums">{timeLeft.hours}</p>
              <p className="text-xs text-muted-foreground">hrs</p>
            </div>

            <span className="text-primary/50">:</span>

            <div className="flex flex-col items-center">
              <p className="text-2xl font-bold text-primary tabular-nums">{timeLeft.minutes}</p>
              <p className="text-xs text-muted-foreground">min</p>
            </div>

            <span className="text-primary/50">:</span>

            <div className="flex flex-col items-center">
              <p className="text-2xl font-bold text-primary tabular-nums">{timeLeft.seconds}</p>
              <p className="text-xs text-muted-foreground">seg</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
