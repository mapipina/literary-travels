import axios from "axios";
import type Book from "../types/Book";
import type { SavedBook } from "../types/Book";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const searchBooks = async (location: string): Promise<Book[]> => {
  try {
    const res = await axios.get(`${API_URL}/api/search`, {
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

export const saveBook = async (bookData: SavedBook) => {
  try {
    const response = await axios.post(`${API_URL}/api/books`, {
      book: bookData
    });
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Failed to save book';
    throw new Error(errorMessage);
  }
};

export const getAllSavedBooks = async (): Promise<Book[]> => {
  try {
    const response = await axios.get(`${API_URL}/api/books`);
    return response.data.data;

  } catch (e) {
    console.error(`Error occurred fetching stored books: ${e}`);
    return [];
  }
}

export const fetcher = (url: string) => axios.get(`${API_URL}${url}`).then(res => res.data.data);