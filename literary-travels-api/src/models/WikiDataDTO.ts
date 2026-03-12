export interface WikiDataDTO {
    wikidataId: string;
    isbn: string | null;
    title: string | undefined;
    author: string;
    location: string | undefined;
    coordinates: {lat: number, lng: number} | undefined; 
    genres: string[];
    publicationYear: number | null;
}
