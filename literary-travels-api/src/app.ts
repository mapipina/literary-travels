import express, { Request, Response } from 'express';
import cors from 'cors';
import { getBooksByLocation } from './services/WikidataService';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'Literary Travels API is running.' });
});

app.get('/api/search', async (req: Request, res: Response) => {
  // res.json({ message: `Search successful for: ${query}`, data: [] });
  try {
    const location = req.query.query as string;
  
    if (!location) {
      return res.status(400).json({ error: 'Location param is required.' });
    }
  
    const books = await getBooksByLocation(location);
    return res.status(200).json({ message: `Found matched books for ${location}`, data: [...books] });
  } catch (e) {
    console.error(`Error occurred retrieving data from Wikidata: ${e}`);
    return res.status(500).json({ error: 'Failed to retrieve data from Wikidata' });
  }
});

export default app; 
