import { Client } from "minio"

const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT || "minio",
  port: parseInt(process.env.MINIO_PORT || "9000"),
  useSSL: false, // Internal connection within Docker is always HTTP
  accessKey: process.env.MINIO_ACCESS_KEY || "minioadmin",
  secretKey: process.env.MINIO_SECRET_KEY || "minioadmin",
})

const BUCKET_NAME = process.env.MINIO_BUCKET || "yasmin-15"

export async function ensureBucket() {
  const exists = await minioClient.bucketExists(BUCKET_NAME)
  if (!exists) {
    await minioClient.makeBucket(BUCKET_NAME)
    const policy = {
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Principal: { AWS: ["*"] },
          Action: ["s3:GetObject"],
          Resource: [`arn:aws:s3:::${BUCKET_NAME}/*`],
        },
      ],
    }
    await minioClient.setBucketPolicy(BUCKET_NAME, JSON.stringify(policy))
  }
}

export function getPublicUrl(objectName: string): string {
  const useSSL = process.env.MINIO_USE_SSL === "true"
  const protocol = useSSL ? "https" : "http"
  const publicHost = process.env.MINIO_PUBLIC_HOST || "localhost"
  const publicPort = process.env.MINIO_PUBLIC_PORT || "9000"
  
  // Se usando SSL via proxy nginx, usa path /storage/ sem porta
  if (useSSL && publicPort === "443") {
    return `${protocol}://${publicHost}/storage/${BUCKET_NAME}/${objectName}`
  }
  
  return `${protocol}://${publicHost}:${publicPort}/${BUCKET_NAME}/${objectName}`
}

export async function uploadFile(
  objectName: string,
  buffer: Buffer,
  contentType: string
): Promise<string> {
  await ensureBucket()
  await minioClient.putObject(BUCKET_NAME, objectName, buffer, buffer.length, {
    "Content-Type": contentType,
  })
  return getPublicUrl(objectName)
}

export async function uploadJson(objectName: string, data: object): Promise<string> {
  const json = JSON.stringify(data)
  const buffer = Buffer.from(json, "utf-8")
  return uploadFile(objectName, buffer, "application/json")
}

export async function listObjects(prefix: string): Promise<
  Array<{
    name: string
    lastModified: Date
    size: number
  }>
> {
  await ensureBucket()
  return new Promise((resolve, reject) => {
    const objects: Array<{ name: string; lastModified: Date; size: number }> = []
    const stream = minioClient.listObjects(BUCKET_NAME, prefix, true)
    stream.on("data", (obj) => {
      if (obj.name) {
        objects.push({
          name: obj.name,
          lastModified: obj.lastModified || new Date(),
          size: obj.size || 0,
        })
      }
    })
    stream.on("end", () => resolve(objects))
    stream.on("error", reject)
  })
}

export async function getObject(objectName: string): Promise<Buffer> {
  await ensureBucket()
  const stream = await minioClient.getObject(BUCKET_NAME, objectName)
  const chunks: Buffer[] = []
  return new Promise((resolve, reject) => {
    stream.on("data", (chunk: Buffer) => chunks.push(chunk))
    stream.on("end", () => resolve(Buffer.concat(chunks)))
    stream.on("error", reject)
  })
}

export async function deleteObject(objectName: string): Promise<void> {
  await ensureBucket()
  await minioClient.removeObject(BUCKET_NAME, objectName)
}

export { minioClient, BUCKET_NAME }
