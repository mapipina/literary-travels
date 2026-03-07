# Literary Travels
Embark on a literary journey by searching for books inspired by your travels.

## Updated Vision
Using Wikidata to help users with their search. This project will involve a user portal in which users can

1. Conduct search for books based on upcoming trip
2. "Pin" book to location (will start with US for easy map viz setup and catering to first tier audience)
3. Data Tables will display
    - Book Title, Country, Aggregated Rating, User Rating
4. I'm mulling through a GoodReads / alternative type of experience where they can store reviews for books as well as their rating. (Using Wikidata for books, still need to collect aggregated review data)
5. Thinking through a UI for logged in users to share a peek of their current literary travel reading "project" to peers, as READ-ONLY

## Phases
**Phase 1: Core Search Pipeline (Completed)**
* Set up the full-stack foundation with a Node.js Express backend and a React frontend.
* Integrated Wikidata via SPARQL queries to fetch specific book metadata (Title, Author, Genre, Year, and WKT Coordinates) based on global travel destinations.
* Built out a responsive UI using Mantine components, including dynamic search inputs and a robust results grid.
* Established comprehensive unit and integration testing pipelines across both environments.

**Phase 2: Map Visualization & "My Trips" (Up Next)**
* **Map Visualization:** Integrate React-Leaflet to consume geographic coordinates and plot interactive pins for each book's location, centering the map dynamically on the searched city.
* **Data Persistence:** Initialize a PostgreSQL database to power the "Saved Trips" and "My Map" features, allowing users to curate and persist reading lists for upcoming vacations.
* **Infrastructure & Deployment:** Dockerize the frontend and backend, provision AWS resources (RDS, EC2/App Runner), and finalize CI/CD pipelines.
* **Tech Debt & Housekeeping:** Standardize React component architecture and ensure codebase health before scaling to additional regions or complex UI features.

## Tech Stack
* TypeScript
* React + Mantine (UI Library)
* Node.js + Express
* React-Leaflet (Map Visualization)
* Postgres + Sequelize (or alternative ORM)
* AWS - *tbd* still debating if I want to use RDS, API Gateway, etc.
* Terraform
* Vitest, Cypress, react-testing-library
* GitHub Actions