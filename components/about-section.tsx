import { Card } from "@/components/ui/card"
import { Heart } from "lucide-react"

export function AboutSection() {
  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-12">
            <Heart className="w-8 h-8 text-primary" />
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground text-center">Sobre a Debutante</h2>
          </div>

          <Card className="p-8 md:p-12 bg-card border-border shadow-lg">
            <p className="text-lg md:text-xl text-card-foreground leading-relaxed text-pretty">
              Yasmin — uma menina forte, determinada e resiliente.
              <br />
              Carrega em si a doçura da delicadeza e a firmeza de quem sabe o que quer.
              <br />
              Seu olhar atento e intenso revela um mundo de sentimentos e sonhos,
              <br />
              enquanto seu brilho próprio é capaz de encantar e desconcertar quem a encontra.
            </p>
            <p className="text-lg md:text-xl text-card-foreground leading-relaxed mt-6 text-pretty">
              Seu sorriso, tímido e enigmático, desperta curiosidade e admiração.
              <br />
              Seu senso de justiça e sua autenticidade fazem dela alguém única,
              <br />
              uma alma que não passa despercebida.
            </p>
            <p className="text-lg md:text-xl text-card-foreground leading-relaxed mt-6 text-pretty">
              Quem a conhece de verdade sabe:
              <br />
              por trás da sua força e sinceridade, há um coração imenso —
              <br />
              carinhoso, amável e leal.
            </p>
            <p className="text-lg md:text-xl text-card-foreground leading-relaxed mt-6 text-pretty italic">
              Yasmin é assim… uma mistura linda de firmeza e ternura,
              <br />
              de coragem e sensibilidade.
            </p>
          </Card>
        </div>
      </div>
    </section>
  )
}
