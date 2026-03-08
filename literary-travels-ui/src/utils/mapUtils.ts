import type { Book } from '../services/apiClient';

export interface GroupedLocation {
    location: string;
    coordinates: { lat: number; lng: number };
    books: Book[];
}

export const groupBooksByLocation = (books: Book[]): GroupedLocation[] => {
    const grouped = new Map<string, GroupedLocation>();
    // TODO: only store starred books so it appears in tooltip on the map. 
    books.forEach(book => {
        if (!book.coordinates) return;

        const key = `${book.coordinates.lat},${book.coordinates.lng}`;

        if (!grouped.has(key)) {
            grouped.set(key, {
                location: book.location,
                coordinates: book.coordinates,
                books: []
            });
        }
        // overridding the ts compiler here since we know the value will exist after the check above
        grouped.get(key)!.books.push(book);
    });

    return Array.from(grouped.values());
};
