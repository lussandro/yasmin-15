import { uploadJson, getPublicUrl } from "@/lib/minio"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { guestName, message } = body

    if (!message || message.trim().length === 0) {
      return NextResponse.json({ error: "Mensagem é obrigatória" }, { status: 400 })
    }

    if (message.length > 500) {
      return NextResponse.json({ error: "Mensagem muito longa (máximo 500 caracteres)" }, { status: 400 })
    }

    const timestamp = Date.now()
    const displayName = (guestName || "Convidado").trim().slice(0, 50)
    const fileNameSafe = displayName.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9\s]/g, "").replace(/\s/g, "_")
    const objectName = `messages/${timestamp}-${fileNameSafe || "Convidado"}.json`

    const messageData = {
      guestName: displayName || "Convidado",
      message: message.trim(),
      createdAt: new Date().toISOString(),
    }

    const url = await uploadJson(objectName, messageData)

    return NextResponse.json({
      id: objectName,
      url,
      objectName,
      ...messageData,
    })
  } catch (error) {
    console.error("Error creating message:", error)
    return NextResponse.json({ error: "Falha ao enviar mensagem" }, { status: 500 })
  }
}
