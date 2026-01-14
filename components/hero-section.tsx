import { Sparkles } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,182,193,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,218,185,0.1),transparent_50%)]" />

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="flex justify-center mb-6">
          <Sparkles className="w-12 h-12 text-primary animate-pulse" />
        </div>

        <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl font-bold text-foreground mb-6 text-balance">
          Yasmin
        </h1>

        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="h-px w-16 bg-primary" />
          <p className="text-3xl md:text-4xl font-light text-primary">15 Anos</p>
          <div className="h-px w-16 bg-primary" />
        </div>

        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed text-pretty">
          Hoje Yasmin brilha como nunca. São 15 anos de sonhos, sorrisos e luz — e o futuro inteiro a esperando de
          braços abertos.
        </p>
      </div>
    </section>
  )
}
