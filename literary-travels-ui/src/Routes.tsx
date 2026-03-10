import { Routes, Route } from "react-router-dom";
import { SearchPage } from "./pages/SearchPage";
import { SavedTrips } from "./pages/SavedTrips";

export const AppRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<SearchPage />} />
            <Route path="/my-trips" element={<SavedTrips />} />
        </Routes>
    );
};
