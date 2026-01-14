import Image from "next/image"

const STORAGE_URL = process.env.NEXT_PUBLIC_STORAGE_URL || "http://localhost:9002/yasmin-15"

export function PhotoGallery() {
  const photos = [
    {
      src: `${STORAGE_URL}/photos/photo1.jpg`,
      alt: "Yasmin em look casual elegante com saia jeans",
      className: "md:col-span-2 md:row-span-2",
    },
    {
      src: `${STORAGE_URL}/photos/photo2.jpg`,
      alt: "Yasmin em vestido branco delicado",
      className: "md:col-span-1 md:row-span-1",
    },
    {
      src: `${STORAGE_URL}/photos/photo3.jpg`,
      alt: "Yasmin em barco na praia ao pôr do sol",
      className: "md:col-span-1 md:row-span-1",
    },
    {
      src: `${STORAGE_URL}/photos/photo4.jpg`,
      alt: "Yasmin em top verde oliva",
      className: "md:col-span-1 md:row-span-1",
    },
    {
      src: `${STORAGE_URL}/photos/photo5.jpg`,
      alt: "Yasmin em vestido preto elegante",
      className: "md:col-span-2 md:row-span-1",
    },
  ]

  return (
    <section className="py-20 md:py-32 bg-secondary/20">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground text-center mb-16">
          Galeria de Fotos
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl mx-auto">
          {photos.map((photo, index) => (
            <div
              key={index}
              className={`relative overflow-hidden rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 ${photo.className}`}
            >
              <div className="relative aspect-[3/4]">
                <Image
                  src={photo.src || "/placeholder.svg"}
                  alt={photo.alt}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
