import { uploadFile } from "@/lib/minio"
import { needsConversion, convertToMp4 } from "@/lib/video-convert"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const guestName = formData.get("guestName") as string

    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo fornecido" }, { status: 400 })
    }

    const timestamp = Date.now()
    const displayName = (guestName || "Convidado").trim()
    const fileNameSafe = displayName.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]/g, "_") || "convidado"
    
    let buffer = Buffer.from(await file.arrayBuffer())
    let extension = file.name.split(".").pop() || "jpg"
    let contentType = file.type || "image/jpeg"

    // Convert video if needed for browser compatibility
    if (file.type.startsWith("video/") && needsConversion(file.name)) {
      console.log(`Converting video: ${file.name}`)
      const converted = await convertToMp4(buffer, file.name)
      buffer = converted.buffer
      extension = "mp4"
      contentType = "video/mp4"
      console.log(`Video converted successfully`)
    }

    const objectName = `party-photos/${timestamp}-${fileNameSafe}.${extension}`
    const url = await uploadFile(objectName, buffer, contentType)

    return NextResponse.json({
      url,
      objectName,
      guestName: displayName,
      uploadedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Falha no upload" }, { status: 500 })
  }
}
