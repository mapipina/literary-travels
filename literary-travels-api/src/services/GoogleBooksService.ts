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
        } else if (title && author) {
            query = `intitle:"${title}"+inauthor:"${author}"`;
        } else {
            throw new Error('Must provide either an ISBN or Title/Author pair for metadata search.');
        }

        const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=1`;
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
