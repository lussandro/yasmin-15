import { deleteObject } from "@/lib/minio"
import { type NextRequest, NextResponse } from "next/server"

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { objectName } = body

    if (!objectName) {
      return NextResponse.json({ error: "Object name é obrigatório" }, { status: 400 })
    }

    await deleteObject(objectName)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting message:", error)
    return NextResponse.json({ error: "Falha ao excluir mensagem" }, { status: 500 })
  }
}
