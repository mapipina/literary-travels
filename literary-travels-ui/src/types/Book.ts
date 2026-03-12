export default interface Book {
    wikidataId: string;
    isbn: string | null;
    title: string;
    author: string;
    location: string;
    coordinates?: { lat: number; lng: number };
    genres: string[];
    publicationYear: number | null;
}

export type SavedBook = Omit<Book, 'coordinates'> & {
    coordinates: { lat: number; lng: number };
    publicationYear: number;
}
