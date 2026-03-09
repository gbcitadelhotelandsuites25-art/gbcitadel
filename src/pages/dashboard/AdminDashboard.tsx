import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

export default function AdminDashboard() {

  const [rooms,setRooms] = useState<any[]>([]);

  const fetchRooms = async () => {

    const data = await getDocs(collection(db,"rooms"));

    const fetched = data.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    setRooms(fetched);
  };

  useEffect(()=>{
    fetchRooms();
  },[]);

  const totalRooms = rooms.length;

  const availableRooms = rooms.filter(
    r => r.status === "vacant"
  ).length;

  const occupiedRooms = rooms.filter(
    r => r.status === "occupied"
  ).length;

  const maintenanceRooms = rooms.filter(
    r => r.status === "maintenance"
  ).length;

  const occupancyRate =
    totalRooms > 0
      ? ((occupiedRooms / totalRooms) * 100).toFixed(1)
      : 0;

  const cardStyle = {
    background:"#1f2937",
    padding:"20px",
    borderRadius:"10px",
    minWidth:"200px"
  };

  return (

    <div>

      <h1>Admin Dashboard</h1>

      <div style={{display:"flex",gap:"20px",flexWrap:"wrap"}}>

        <div style={cardStyle}>
          <h3>Total Rooms</h3>
          <p>{totalRooms}</p>
        </div>

        <div style={cardStyle}>
          <h3>Available</h3>
          <p>{availableRooms}</p>
        </div>

        <div style={cardStyle}>
          <h3>Occupied</h3>
          <p>{occupiedRooms}</p>
        </div>

        <div style={cardStyle}>
          <h3>Maintenance</h3>
          <p>{maintenanceRooms}</p>
        </div>

        <div style={cardStyle}>
          <h3>Occupancy Rate</h3>
          <p>{occupancyRate}%</p>
        </div>

      </div>

    </div>

  );
}