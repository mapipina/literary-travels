import express, { Request, Response } from 'express';
import cors from 'cors';
import { getBooksByLocation } from './services/WikidataService';
import SavedBook from './models/SavedBook';
import sequelize from './config/database';
import SearchCache from './models/SearchCache';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', async (_req: Request, res: Response) => {
  try {
    await sequelize.authenticate();
    
    res.status(200).json({ 
      status: 'ok', 
      database: 'connected',
      message: 'Literary Travels API and Neon DB are healthy.' 
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({ 
      status: 'error', 
      database: 'disconnected',
      message: 'API is up, but the database is unreachable.' 
    });
  }
});

app.get('/api/search', async (req: Request, res: Response) => {
try {
    const location = req.query.query as string;
    if (!location) {
      return res.status(400).json({ error: 'Location param is required.' });
    }

    const normalizedLocation = location.toLowerCase().trim();
    const cachedSearch = await SearchCache.findOne({ 
        where: { location: normalizedLocation } 
    });

    if (cachedSearch && new Date() < cachedSearch.expiresAt) {
      console.log(`Cache HIT for location: ${normalizedLocation}`);
      return res.status(200).json({ 
        message: `Found cached books for ${location}`, 
        data: cachedSearch.data 
      });
    }

    console.log(`Cache MISS for location: ${normalizedLocation}. Fetching from Wikidata...`);

    const books = await getBooksByLocation(location);
    if (books.length > 0) {
        const expirationDate = new Date();
        expirationDate.setHours(expirationDate.getHours() + 24); // Cache for 24 hours

        await SearchCache.upsert({
            location: normalizedLocation,
            data: books,
            expiresAt: expirationDate
        });
    }
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
    if (!book?.title || !book?.author || !book?.location || !book?.coordinates?.lat || !book?.coordinates?.lng) {
      return res.status(400).json({
        error: 'Critical data missing from request. Required: title, author, location, coordinates.lat, coordinates.lng'
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
        message: 'This book is already in your saved trips.', 
        book: existingBook
      });
    }

    const newBook = await SavedBook.create({
      title: book.title,
      author: book.author,
      location: book.location,
      lat: book.coordinates.lat,
      lng: book.coordinates.lng,
      genres: book.genres || [],
      publicationYear: book.publicationYear || null
    });

    return res.status(201).json({
      message: 'Book saved successfully',
      book: newBook
    });
  } catch (e) {
    console.error(`Error occurred trying to save book to db: ${e}`);
    return res.status(500).json({ error: 'Failed to save book to db' });
  }
});

app.get('/api/books', async (_req: Request, res: Response) => {
  try {
    const savedBooks = await SavedBook.findAll({
      order: [['createdAt', 'DESC']]
    });

    const formattedBooks = savedBooks.map(book => {
      const data = book.get({ plain: true });
      return {
        ...data,
        coordinates: {
          lat: data.lat,
          lng: data.lng
        }
      };
    });

    return res.status(200).json({
      message: formattedBooks.length > 0 ? 'Found these associated books' : 'No books saved yet',
      data: formattedBooks
    });
  } catch (e) {
    console.log(`Error occurred retrieving books: ${e}`);
    return res.status(500).json({ error: 'Failed to retrieve books from db' });
  }
});

export default app; 
