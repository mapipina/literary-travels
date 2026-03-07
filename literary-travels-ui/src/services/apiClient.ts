import axios from "axios";

export interface Book {
    title: string;
    author: string;
    location: string;
    coordinates?: { lat: number; lng: number };
}
export const searchBooks = async (location: string): Promise<[]> => {
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
