import express, { Request, Response } from 'express';
import cors from 'cors';
import { getBooksByLocation } from './services/WikidataService';
import SavedBook from './models/SavedBook';
import { error } from 'node:console';

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
    const successMsg = books.length > 0 ? `Found matched books for ${location}` : `No books found based in ${location}`;
    return res.status(200).json({ message: successMsg, data: books });
  } catch (e) {
    console.error(`Error occurred retrieving data from Wikidata: ${e}`);
    return res.status(500).json({ error: 'Failed to retrieve data from Wikidata' });
  }
});

app.post('/api/books', async (req: Request, res: Response) => {
  try {
    const { book } = req.body;
    if (!book?.title || !book?.author || !book?.location || !book?.lat || !book?.lng) {
      return res.status(400).json({
        error: 'Critical data missing from request. Required: title, author, location, lat, lng'
      });
    }
    const existingBook = await SavedBook.findOne({
      where: {
        title: book.title,
        author: book.author
      }
    });

    if (existingBook) {
      return res.status(409).json({
        message: 'This book is already in your saved trips.', // TODO associate books to tripId and user
        book: existingBook
      });
    }

    const newBook = await SavedBook.create({
      title: book.title,
      author: book.author,
      location: book.location,
      lat: book.lat,
      lng: book.lng,
      genres: book.genres || [],
      publicationYear: book.publicationYear || null
    });

    return res.status(201).json({
      message: 'Book saved successfully',
      book: newBook
    });
  } catch (e) {
    console.error(`Error occurred trrying to save book to db: ${e}`);
    return res.status(500).json({ error: 'Failed to save book to db' });
  }
});

app.get('/api/books', async (_req: Request, res: Response) => {
  try {
    // assuming the user for this app is a single user + use case so no need to look up books by tripId or userId
    const savedBooks = await SavedBook.findAll();
    return res.status(200).json({
      message: savedBooks.length > 0 ? 'Found these associated books' : 'No books saved yet',
      data: savedBooks
    });
  } catch (e) {
    console.log(`Error occurred retrieving books: ${e}`);
    return res.status(500).json({ error: 'Failed to retrieve books from db' });
  }
});

export default app; 
