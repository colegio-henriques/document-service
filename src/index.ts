import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { uploadMiddleware } from './middlewares/upload';
import { uploadDocument, getSignedUrl } from './services/storageService';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8083;

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'UP', service: 'document-service' });
});

// Endpoint seguro de Upload
app.post('/documents/upload', uploadMiddleware.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'Nenhum ficheiro fornecido no campo "file".' });
      return;
    }

    // Na prática verificaríamos permissões de admin/professor aqui via JWT middleware

    const filePath = await uploadDocument(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );

    res.status(201).json({
      message: 'Documento armazenado em cofre virtual.',
      file_path: filePath
    });
  } catch (error) {
    console.error('Erro no upload:', error);
    res.status(500).json({ error: 'Falha ao gravar documento no Google Cloud Storage.' });
  }
});

// Endpoint para visualizar um documento seguro
app.get('/documents/view', async (req: Request, res: Response) => {
  try {
    const { path } = req.query;

    if (!path || typeof path !== 'string') {
      res.status(400).json({ error: 'Parâmetro de query ?path= é obrigatório.' });
      return;
    }

    const url = await getSignedUrl(path);

    res.status(200).json({
      message: 'Link temporário gerado (expira em 15m)',
      signed_url: url
    });
  } catch (error) {
    console.error('Erro na visualização:', error);
    res.status(500).json({ error: 'Falha ao recuperar ficheiro encriptado.' });
  }
});

app.listen(PORT, () => {
  console.log(`[document-service] Servidor REST a correr na porta ${PORT}`);
});
