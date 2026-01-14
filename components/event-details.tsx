import { Card } from "@/components/ui/card"
import { Calendar, Clock, MapPin } from "lucide-react"

export function EventDetails() {
  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground text-center mb-16">
          Detalhes da Festa
        </h2>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-8 text-center bg-card border-border shadow-lg hover:shadow-xl transition-shadow">
            <Calendar className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-card-foreground mb-2">Data</h3>
            <p className="text-2xl font-bold text-primary">09/jan/26</p>
          </Card>

          <Card className="p-8 text-center bg-card border-border shadow-lg hover:shadow-xl transition-shadow">
            <Clock className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-card-foreground mb-2">Horário</h3>
            <p className="text-2xl font-bold text-primary">20h</p>
          </Card>

          <Card className="p-8 text-center bg-card border-border shadow-lg hover:shadow-xl transition-shadow">
            <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-card-foreground mb-2">Local</h3>
            <p className="text-xl font-bold text-primary mb-2">Realize Eventos</p>
            <p className="text-muted-foreground">Rua João Born, 1405 | Ponte do Imaruim - Palhoça/SC</p>
          </Card>
        </div>
      </div>
    </section>
  )
}
