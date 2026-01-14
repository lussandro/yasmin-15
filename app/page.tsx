import { CountdownBanner } from "@/components/countdown-banner"
import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { PhotoGallery } from "@/components/photo-gallery"
import { EventDetails } from "@/components/event-details"
import { GiftRegistry } from "@/components/gift-registry"
import { WishesSection } from "@/components/wishes-section"
import { LivePhotoGallery } from "@/components/live-photo-gallery"

export default function Home() {
  return (
    <main className="min-h-screen">
      <CountdownBanner />
      <HeroSection />
      <AboutSection />
      <PhotoGallery />
      <EventDetails />
      <GiftRegistry />
      <WishesSection />
      <LivePhotoGallery />
    </main>
  )
}
