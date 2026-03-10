import { useEffect, useState } from "react";
import { BookGrid } from "../components/BookGrid";
import { getAllSavedBooks } from "../services/apiClient";
import type Book from "../types/Book";

export const SavedTrips: React.FC = () => {
    const [savedBooks, setSavedBooks] = useState<Book[]>([]);

    useEffect(() => {
        const loadSavedBooks = async () => {
            const books = await getAllSavedBooks();
            setSavedBooks(books);
        };

        loadSavedBooks();
    }, []);

    return (
        <BookGrid books={savedBooks} showSaveButton={false} />
    );
};