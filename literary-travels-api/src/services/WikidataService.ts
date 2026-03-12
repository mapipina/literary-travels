import axios from 'axios';
import { WikiDataDTO } from '../models/WikiDataDTO';

export interface WikidataRawResponse {
    head: {
        vars: string[];
    };
    results: {
        bindings: Array<{
            [key: string]: {
                type: string;
                value: string;
                "xml:lang"?: string;
            };
        }>;
    };
}

const reqURL = 'https://query.wikidata.org/sparql';

const parseCoordinates = (pointString?: string): { lat: number, lng: number } | undefined => {
    if (!pointString) return undefined;

    const match = pointString.match(/Point\(([^ ]+) ([^ ]+)\)/);
    if (match) {
        return {
            lng: parseFloat(match[1]!),
            lat: parseFloat(match[2]!)
        };
    }
    return undefined;
};

export const getWikiData = async (location: string): Promise<WikidataRawResponse> => {
    const sparqlQuery = `
        SELECT ?book ?bookLabel ?authorLabel ?locationLabel ?coordinates ?genreLabel ?pubDate ?isbn13 ?isbn10 WHERE {
        ?book wdt:P31/wdt:P279* wd:Q7725634. # instance of literary work
        ?book wdt:P840 ?location.            # narrative location
        ?location wdt:P625 ?coordinates.     
        
        # Filter by the user's search term (case-insensitive)
        ?location rdfs:label ?locName.
        FILTER(LANG(?locName) = "en")
        FILTER(CONTAINS(LCASE(?locName), LCASE("${location}")))

        OPTIONAL { ?book wdt:P50 ?author. } 
        OPTIONAL { ?book wdt:P136 ?genre. }
        OPTIONAL { ?book wdt:P577 ?pubDate. }
        OPTIONAL { ?book wdt:P212 ?isbn13. } # ISBN-13
        OPTIONAL { ?book wdt:P957 ?isbn10. } # ISBN-10
        
        SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
        }
        LIMIT 50`;

    const response = await axios.get(reqURL, {
        params: { query: sparqlQuery },
        headers: {
            'Accept': 'application/sparql-results+json',
            'User-Agent': `LiteraryTravelsApp/1.0 (${process.env.WIKIDATA_EMAIL})`
        }
    });

    return response.data;
}

export const getBooksByLocation = async (location: string): Promise<WikiDataDTO[]> => {
    try {
        const data = await getWikiData(location);

        return Array.from(
            data.results.bindings.reduce((acc: Map<string, WikiDataDTO>, binding: any) => {
                const wikidataUri = binding.book?.value;
                const wikidataId = wikidataUri ? wikidataUri.split('/').pop() : null;

                if (!wikidataId) return acc; 

                const existingBook = acc.get(wikidataId);

                if (existingBook) {
                    // Need to handle multiple genres
                    const newGenre = binding.genreLabel?.value;
                    if (newGenre && !existingBook.genres.includes(newGenre)) {
                        existingBook.genres.push(newGenre);
                    }

                    // Need to handle multiple authors and mention illustrators
                    const newAuthor = binding.authorLabel?.value;
                    if (newAuthor && !existingBook.author.includes(newAuthor)) {
                        existingBook.author += `, ${newAuthor}`; 
                    }
                } else {
                    let publicationYear = null;
                    if (binding.pubDate?.value) {
                        const date = new Date(binding.pubDate.value);
                        if (!isNaN(date.getTime())) {
                            publicationYear = date.getFullYear();
                        }
                    }

                    acc.set(wikidataId, {
                        wikidataId,
                        isbn: binding.isbn13?.value || binding.isbn10?.value || null,
                        title: binding.bookLabel?.value,
                        author: binding.authorLabel?.value || 'Unknown',
                        location: binding.locationLabel?.value,
                        coordinates: parseCoordinates(binding.coordinates?.value),
                        genres: binding.genreLabel?.value ? [binding.genreLabel.value] : [],
                        publicationYear
                    });
                }

                return acc;
            }, new Map<string, WikiDataDTO>()).values()
        );
        
    } catch (error) {
        console.error(`Error fetching books by location ${location}: ${error}`);
        throw error;
    }
};
