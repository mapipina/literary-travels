export interface WikiDataDTO {
    title: string | undefined;
    author: string | undefined;
    location: string | undefined;
    coordinates: {lat: number, lng: number} | undefined; 
}