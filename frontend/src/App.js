import "@/App.css";
import { HashRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";

import ProjectPage from "@/pages/ProjectPage";
import ProsopographyPage from "@/pages/ProsopographyPage";
import ProsopographyDetailPage from "@/pages/ProsopographyDetailPage";
import BibliographyPage from "@/pages/BibliographyPage";
import NetworksPage from "@/pages/NetworksPage";

function App() {
    return (
        <div className="App">
            <HashRouter>
                <Layout>
                    <Routes>
                        <Route path="/" element={<ProjectPage />} />
                        <Route path="/prosopography" element={<ProsopographyPage />} />
                        <Route path="/prosopography/:id" element={<ProsopographyDetailPage />} />
                        <Route path="/bibliography" element={<BibliographyPage />} />
                        <Route path="/networks" element={<NetworksPage />} />
                    </Routes>
                </Layout>
            </HashRouter>
        </div>
    );
}

export default App;
