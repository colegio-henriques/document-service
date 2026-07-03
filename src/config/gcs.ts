import { Storage } from '@google-cloud/storage';
import dotenv from 'dotenv';

dotenv.config();

// Inicialização do cliente de Storage
// Tal como no Pub/Sub, usará as Application Default Credentials nativamente no Google Cloud
export const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT || 'colegio-henriques-prod',
});

// Buckets lógicos para separação de domínios e regras de retenção diferentes no futuro
export const BUCKET_NAME_DOCUMENTS = process.env.BUCKET_DOCS || 'ch-student-documents';
export const BUCKET_NAME_PUBLIC = process.env.BUCKET_PUBLIC || 'ch-public-assets';
