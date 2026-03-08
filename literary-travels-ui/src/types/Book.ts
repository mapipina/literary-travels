export default interface Book {
    title: string;
    author: string;
    location: string;
    coordinates?: { lat: number; lng: number };
    genres: string[];
    publicationYear: number | null;
}
