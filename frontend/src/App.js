import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Layout } from "@/components/Layout";
import { Toaster } from "@/components/ui/sonner";

import ProjectPage from "@/pages/ProjectPage";
import ProsopographyPage from "@/pages/ProsopographyPage";
import ProsopographyDetailPage from "@/pages/ProsopographyDetailPage";
import BibliographyPage from "@/pages/BibliographyPage";
import NetworksPage from "@/pages/NetworksPage";
import AdminLoginPage from "@/pages/AdminLoginPage";
import AdminDashboard from "@/pages/AdminDashboard";

function App() {
    return (
        <div className="App">
            <AuthProvider>
                <BrowserRouter>
                    <Layout>
                        <Routes>
                            <Route path="/" element={<ProjectPage />} />
                            <Route path="/prosopography" element={<ProsopographyPage />} />
                            <Route path="/prosopography/:id" element={<ProsopographyDetailPage />} />
                            <Route path="/bibliography" element={<BibliographyPage />} />
                            <Route path="/networks" element={<NetworksPage />} />
                            <Route path="/admin/login" element={<AdminLoginPage />} />
                            <Route path="/admin" element={<AdminDashboard />} />
                        </Routes>
                    </Layout>
                </BrowserRouter>
                <Toaster />
            </AuthProvider>
        </div>
    );
}

export default App;
