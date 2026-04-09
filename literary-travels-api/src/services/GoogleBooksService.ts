import axios from 'axios';

export interface BookMetadataDTO {
    description: string | null;
    coverUrl: string | null;
    pageCount: number | null;
    averageRating: number | null;
}

export const getBookMetadata = async (
    isbn?: string | null,
    title?: string,
    author?: string
): Promise<BookMetadataDTO | null> => {
    try {
        let query = '';

        if (isbn) {
            query = `isbn:${isbn}`;
        } else if (title) {
            query = `intitle:"${title}"`;
            if (author && author !== 'Unknown') {
                query += `+inauthor:"${author}"`;
            }
        } else {
            throw new Error('Must provide either an ISBN or Title/Author pair for metadata search.');
        }

        const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
        const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=1${apiKey ? `&key=${apiKey}` : ''}`;
        const response = await axios.get(url);

        if (!response.data.items || response.data.items.length === 0) {
            return null;
        }

        const volumeInfo = response.data.items[0].volumeInfo;

        return {
            description: volumeInfo.description || null,
            coverUrl: volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:') || null,
            pageCount: volumeInfo.pageCount || null,
            averageRating: volumeInfo.averageRating || null,
        };

    } catch (error) {
        console.error('Failed to fetch Google Books metadata:', error);
        return null;
    }
};
