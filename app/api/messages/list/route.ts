import { listObjects, getObject, getPublicUrl } from "@/lib/minio"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const objects = await listObjects("messages/")

    const messages = await Promise.all(
      objects.map(async (obj) => {
        try {
          const buffer = await getObject(obj.name)
          const data = JSON.parse(buffer.toString("utf-8"))
          return {
            id: obj.name,
            url: getPublicUrl(obj.name),
            objectName: obj.name,
            ...data,
          }
        } catch {
          return null
        }
      })
    )

    const validMessages = messages
      .filter((msg): msg is NonNullable<typeof msg> => msg !== null)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return NextResponse.json({ messages: validMessages })
  } catch (error) {
    console.error("Error listing messages:", error)
    return NextResponse.json({ messages: [] })
  }
}
