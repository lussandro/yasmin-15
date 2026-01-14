import { listObjects, getPublicUrl } from "@/lib/minio"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const objects = await listObjects("party-photos/")

    const videoExtensions = ['.mp4', '.mov', '.avi', '.webm', '.mkv']

    const photos = objects
      .map((obj) => {
        const filename = obj.name.split("/").pop() || ""
        const parts = filename.split("-")
        const guestName = parts[1]?.replace(/_/g, " ")?.split(".")[0] || "Convidado"
        const ext = filename.substring(filename.lastIndexOf('.')).toLowerCase()
        const isVideo = videoExtensions.includes(ext)

        return {
          url: getPublicUrl(obj.name),
          objectName: obj.name,
          guestName,
          uploadedAt: obj.lastModified.toISOString(),
          isVideo,
        }
      })
      .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())

    return NextResponse.json({ photos })
  } catch (error) {
    console.error("Error listing photos:", error)
    return NextResponse.json({ photos: [] })
  }
}
