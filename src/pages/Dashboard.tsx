import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

function Dashboard() {
  const [rooms, setRooms] = useState<any[]>([]);

  const fetchRooms = async () => {
    const data = await getDocs(collection(db, "rooms"));
    const fetched = data.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setRooms(fetched);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const totalRooms = rooms.length;

  const availableRooms = rooms.filter(
    r => r.status?.trim() === "Available"
  ).length;

  const occupiedRooms = rooms.filter(
    r => r.status?.trim() === "Occupied"
  ).length;

  const maintenanceRooms = rooms.filter(
    r => r.status?.trim() === "Maintenance"
  ).length;

  const potentialRevenue = rooms
    .filter(r => r.status?.trim() === "Available")
    .reduce(
      (sum, room) =>
        sum + Number(room.currentPrice || room.price || 0),
      0
    );

  const occupancyRate =
    totalRooms > 0
      ? ((occupiedRooms / totalRooms) * 100).toFixed(1)
      : 0;

  const cardStyle = {
    background: "#1a1a1a",
    padding: "20px",
    borderRadius: "10px",
    color: "white",
    minWidth: "220px",
    textAlign: "center" as const
  };

  return (
    <div>
      <h1 style={{ color: "gold" }}>Admin Dashboard</h1>

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginTop: "30px" }}>

        <div style={cardStyle}>
          <h2>Total Rooms</h2>
          <p style={{ fontSize: "28px", color: "gold" }}>{totalRooms}</p>
        </div>

        <div style={cardStyle}>
          <h2>Available</h2>
          <p style={{ fontSize: "28px", color: "lime" }}>{availableRooms}</p>
        </div>

        <div style={cardStyle}>
          <h2>Occupied</h2>
          <p style={{ fontSize: "28px", color: "orange" }}>{occupiedRooms}</p>
        </div>

        <div style={cardStyle}>
          <h2>Maintenance</h2>
          <p style={{ fontSize: "28px", color: "red" }}>{maintenanceRooms}</p>
        </div>

        <div style={cardStyle}>
          <h2>Occupancy Rate</h2>
          <p style={{ fontSize: "26px", color: "gold" }}>
            {occupancyRate}%
          </p>
        </div>

        <div style={cardStyle}>
          <h2>Potential Revenue</h2>
          <p style={{ fontSize: "24px", color: "gold" }}>
            ₦{potentialRevenue.toLocaleString()}
          </p>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;