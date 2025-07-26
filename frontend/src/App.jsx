import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TitlePage from "./TitlePage";
import UploadOrManualPage from "./UploadOrManualPage";
import TaskDisplayPage from "./TaskDisplayPage";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<TitlePage />} />
                <Route path="/input" element={<UploadOrManualPage />} />
                <Route path="/tasks" element={<TaskDisplayPage />} />
            </Routes>
        </Router>
    );
}

export default App;