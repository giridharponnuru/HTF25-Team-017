import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import CitizenAuth from "./pages/CitizenAuth";
import AdminAuth from "./pages/AdminAuth";
import CitizenDashboard from "./pages/CitizenDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import "./App.css"; // Optional if you want global styling

function App() {
  return (
    <Router>
      <Routes>
        {/* 🌿 Landing Page */}
        <Route path="/" element={<Landing />} />

        {/* 👤 Citizen Routes */}
        <Route path="/citizen-auth" element={<CitizenAuth />} />
        <Route path="/citizen" element={<CitizenDashboard />} />

        {/* 🧑‍💼 Admin Routes */}
        <Route path="/admin-auth" element={<AdminAuth />} />
        <Route path="/admin" element={<AdminDashboard />} />

        {/* ⚠️ Fallback route (optional) */}
        <Route
          path="*"
          element={
            <div
              style={{
                color: "white",
                backgroundColor: "#001a0d",
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "1.5rem",
              }}
            >
              404 – Page Not Found
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
