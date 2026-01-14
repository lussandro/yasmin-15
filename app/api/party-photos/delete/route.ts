import { deleteObject } from "@/lib/minio"
import { type NextRequest, NextResponse } from "next/server"

export async function DELETE(request: NextRequest) {
  try {
    const { objectName } = await request.json()

    if (!objectName) {
      return NextResponse.json({ error: "No object name provided" }, { status: 400 })
    }

    await deleteObject(objectName)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json({ error: "Delete failed" }, { status: 500 })
  }
}
