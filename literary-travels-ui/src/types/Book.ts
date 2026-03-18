export default interface Book {
    wikidataId: string;
    isbn: string | null;
    title: string;
    author: string;
    location: string;
    coordinates?: { lat: number; lng: number };
    genres: string[];
    publicationYear: number | null;
    description?: string | null;
    coverUrl?: string | null; 
}

export type SavedBook = Omit<Book, 'coordinates' | 'publicationYear'> & {
    coordinates: { lat: number; lng: number };
    publicationYear: number;
}

export interface BookMetadata {
    description: string | null;
    coverUrl: string | null;
    pageCount: number | null;
    averageRating: number | null;
}
