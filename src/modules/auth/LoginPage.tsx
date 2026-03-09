import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div
      style={{
        width: "220px",
        height: "100vh",
        background: "#111827",
        color: "white",
        padding: "20px"
      }}
    >
      <h2 style={{ color: "gold" }}>Hotel PMS</h2>

      <ul style={{ listStyle: "none", padding: 0 }}>

        <li style={{ marginBottom: "15px" }}>
          <Link to="/">Dashboard</Link>
        </li>

        <li style={{ marginBottom: "15px" }}>
          <Link to="/revenue">Revenue</Link>
        </li>

        <li style={{ marginBottom: "15px" }}>
          <Link to="/room-board">Room Board</Link>
        </li>

        <li style={{ marginBottom: "15px" }}>
          <Link to="/rooms">Rooms</Link>
        </li>

        <li style={{ marginBottom: "15px" }}>
          <Link to="/reservation-calendar">Reservation Calendar</Link>
        </li>

        <li style={{ marginBottom: "15px" }}>
          <Link to="/guest-folio">Guest Folio</Link>
        </li>

        <li style={{ marginBottom: "15px" }}>
          <Link to="/invoice">Invoice</Link>
        </li>

      </ul>
    </div>
  );
}