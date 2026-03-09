import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";

import AdminDashboard from "./pages/dashboard/AdminDashboard";
import RevenueDashboard from "./pages/dashboard/RevenueDashboard";

import Rooms from "./pages/Rooms";
import ReservationCalendar from "./pages/ReservationCalendar";
import GuestFolio from "./pages/GuestFolio";
import Invoice from "./pages/Invoice";
import RoomBoard from "./pages/RoomBoard";

function App() {
  return (
    <Router>

      <div style={{ display: "flex" }}>

        <Sidebar />

        <div style={{ flex: 1, padding: "25px" }}>

          <Routes>

            <Route path="/" element={<AdminDashboard />} />

            <Route path="/revenue" element={<RevenueDashboard />} />

            <Route path="/rooms" element={<Rooms />} />

            <Route
              path="/reservation-calendar"
              element={<ReservationCalendar />}
            />

            <Route
              path="/guest-folio"
              element={<GuestFolio />}
            />

            <Route
              path="/invoice"
              element={<Invoice />}
            />

            <Route
              path="/room-board"
              element={<RoomBoard />}
            />

          </Routes>

        </div>

      </div>

    </Router>
  );
}

export default App;