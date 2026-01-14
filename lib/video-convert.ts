import { exec } from "child_process"
import { promisify } from "util"
import { writeFile, unlink, readFile } from "fs/promises"
import { tmpdir } from "os"
import { join } from "path"
import { randomBytes } from "crypto"

const execAsync = promisify(exec)

const videoExtensions = [".mov", ".avi", ".mkv", ".webm", ".wmv", ".flv", ".m4v"]

export function needsConversion(filename: string): boolean {
  const ext = filename.toLowerCase().substring(filename.lastIndexOf("."))
  return videoExtensions.includes(ext)
}

// Sanitize filename to prevent command injection
function sanitizeFilename(filename: string): string {
  // Extract extension safely
  const ext = filename.toLowerCase().substring(filename.lastIndexOf("."))
  const safeExt = videoExtensions.includes(ext) ? ext : ".tmp"
  // Generate random safe filename
  return `video-${randomBytes(8).toString("hex")}${safeExt}`
}

export async function convertToMp4(buffer: Buffer, originalName: string): Promise<{ buffer: Buffer<ArrayBuffer>; filename: string }> {
  const timestamp = Date.now()
  // Use sanitized filename instead of user input
  const safeFilename = sanitizeFilename(originalName)
  const inputPath = join(tmpdir(), `input-${timestamp}-${safeFilename}`)
  const outputPath = join(tmpdir(), `output-${timestamp}.mp4`)

  try {
    // Write input file
    await writeFile(inputPath, buffer)

    // Convert to MP4 with H.264 codec for browser compatibility
    await execAsync(
      `ffmpeg -i "${inputPath}" -c:v libx264 -preset fast -crf 23 -c:a aac -movflags +faststart -y "${outputPath}"`,
      { timeout: 300000 } // 5 min timeout
    )

    // Read output file
    const outputBuffer = await readFile(outputPath)
    
    // New filename with .mp4 extension
    const newFilename = originalName.substring(0, originalName.lastIndexOf(".")) + ".mp4"

    return { buffer: outputBuffer, filename: newFilename }
  } finally {
    // Cleanup temp files
    try { await unlink(inputPath) } catch {}
    try { await unlink(outputPath) } catch {}
  }
}
