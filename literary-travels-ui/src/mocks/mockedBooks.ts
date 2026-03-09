import type Book from "../types/Book";
// need this for easier frontend test since wikidata is being a PITA
export const MOCK_BOOKS: Book[] = [
    {
        title: "The Marlow Murder Club",
        author: "Robert Thorogood",
        location: "Marlow, England",
        coordinates: { lat: 51.5715, lng: -0.7735 },
        genres: ["Mystery", "Cozy Mystery"],
        publicationYear: 2021
    },
    {
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        location: "Long Island, NY",
        coordinates: { lat: 40.75, lng: -73.4 },
        genres: ["Classic", "Literary Fiction"],
        publicationYear: 1925
    }
];
