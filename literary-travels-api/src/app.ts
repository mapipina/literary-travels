import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'Literary Travels API is running.' });
});

app.get('/api/search', (req: Request, res: Response) => {
  const { query } = req.query;
  res.json({ message: `Search successful for: ${query}`, data: [] });
});

export default app; 
