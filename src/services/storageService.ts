import { storage, BUCKET_NAME_DOCUMENTS } from '../config/gcs';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

export const uploadDocument = async (fileBuffer: Buffer, originalName: string, mimeType: string): Promise<string> => {
  const bucket = storage.bucket(BUCKET_NAME_DOCUMENTS);
  const ext = path.extname(originalName);
  
  // Ex: "2026/07/uuid-1234.pdf" - Evita colisões de nomes e organiza em pastas
  const objectPath = `records/${new Date().getFullYear()}/${uuidv4()}${ext}`;
  const file = bucket.file(objectPath);

  console.log(`[GCS] A iniciar upload para gs://${BUCKET_NAME_DOCUMENTS}/${objectPath}...`);

  await file.save(fileBuffer, {
    metadata: {
      contentType: mimeType,
      cacheControl: 'no-cache',
    },
    resumable: false // Uploads pequenos (<5MB)
  });

  console.log(`[GCS] Ficheiro gravado com sucesso.`);
  return objectPath;
};

export const getSignedUrl = async (objectPath: string): Promise<string> => {
  const bucket = storage.bucket(BUCKET_NAME_DOCUMENTS);
  const file = bucket.file(objectPath);

  // Gera um link que só funciona durante 15 minutos (900000ms)
  // Perfeito para segurança: A aplicação só vê o documento temporalmente
  const [url] = await file.getSignedUrl({
    version: 'v4',
    action: 'read',
    expires: Date.now() + 15 * 60 * 1000, 
  });

  return url;
};
