import axios from "axios";
import type Book from "../types/Book";

export const searchBooks = async (location: string): Promise<Book[]> => {
    try {
        const res = await axios.get('http://localhost:3000/api/search', {
            params: {
                query: location
            }
        });
        return res.data.data;
    } catch (err) {
        console.error(`Error occurred while fetching books for ${location}: ${err}`);
        return [];
    }

}
