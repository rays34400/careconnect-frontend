import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "@/pages/public/Home";
import ProfessionalsPage from "@/pages/public/ProfessionalsPage";
import ProfessionalDetailPage from "@/pages/public/ProfessionalDetailPage";
import LoginPage from "@/pages/public/LoginPage";
import RegisterPage from "@/pages/public/RegisterPage";
import VerifyEmailPage from "@/pages/autre/VerifyEmailPage";
import ProfilePage from "@/pages/common/ProfilePage";
import PatientAppointmentsPage from "@/pages/patient/PatientAppointmentsPage";
import ProfessionalAvailabilitiesPage from "@/pages/Professional/ProfessionalAvailabilitiesPage";
import ProfessionalPendingAppointmentsPage from "@/pages/Professional/ProfessionalPendingAppointmentsPage";
import PatientPendingAppointmentsPage from "@/pages/patient/PatientPendingAppointmentsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/professionals" element={<ProfessionalsPage />} />
        <Route path="/professionals/:id" element={<ProfessionalDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/appointments" element={<PatientAppointmentsPage />} />
        <Route path="/professional/availabilities" element={<ProfessionalAvailabilitiesPage />}/>
        <Route path="/professional/pending-appointments" element={<ProfessionalPendingAppointmentsPage />} />
        <Route path="/patient/pending-appointments" element={<PatientPendingAppointmentsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;