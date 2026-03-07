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
        SELECT ?bookLabel ?authorLabel ?locationLabel ?coordinates ?genreLabel ?pubDate WHERE {
        ?book wdt:P31/wdt:P279* wd:Q7725634. # instance of literary work
        ?book wdt:P840 ?location.            # narrative location
        ?location wdt:P625 ?coordinates.     # coordinate location, will come necessary for map pinning and visualization
        
        # Filter by the user's search term (case-insensitive)
        ?location rdfs:label ?locName.
        FILTER(LANG(?locName) = "en")
        FILTER(CONTAINS(LCASE(?locName), LCASE("${location}")))

        OPTIONAL { ?book wdt:P50 ?author. } 
        OPTIONAL { ?book wdt:P136 ?genre. }
        OPTIONAL { ?book wdt:P577 ?pubDate. }
        
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
        return data.results.bindings.map(binding => ({
            title: binding.bookLabel?.value,
            author: binding.authorLabel?.value || 'Unknown',
            location: binding.locationLabel?.value,
            coordinates: parseCoordinates(binding.coordinates?.value),
            genre: binding.genreLabel?.value,
            publicationYear: binding.pubDate?.value?.substring(0, 4)
        }));
    } catch (error) {
        console.error(`Error fetching books by location ${location}: ${error}`);
        throw error;
    }
};
