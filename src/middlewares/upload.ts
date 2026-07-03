import multer from 'multer';

// O multer processa o ficheiro em memória (Buffer) antes de o enviar para o GCS
// Isto evita gravar temporariamente no disco do container (que é efémero no Cloud Run)
const storage = multer.memoryStorage();

// Middleware para upload único sob a chave "file" (limite 5MB)
export const uploadMiddleware = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});
