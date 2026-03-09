import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export default function Dashboard() {

  const [rooms,setRooms] = useState(0);
  const [available,setAvailable] = useState(0);
  const [occupied,setOccupied] = useState(0);
  const [maintenance,setMaintenance] = useState(0);

  const [roomRevenue,setRoomRevenue] = useState(0);
  const [barRevenue,setBarRevenue] = useState(0);
  const [restaurantRevenue,setRestaurantRevenue] = useState(0);
  const [poolRevenue,setPoolRevenue] = useState(0);
  const [laundryRevenue,setLaundryRevenue] = useState(0);

  const fetchDashboard = async () => {

    const roomSnapshot = await getDocs(collection(db,"rooms"));

    let total = 0;
    let vacant = 0;
    let occ = 0;
    let maint = 0;

    roomSnapshot.forEach((doc)=>{
      total++;

      const status = doc.data().status;

      if(status==="vacant") vacant++;
      if(status==="occupied") occ++;
      if(status==="maintenance") maint++;
    });

    setRooms(total);
    setAvailable(vacant);
    setOccupied(occ);
    setMaintenance(maint);

    const orderSnapshot = await getDocs(collection(db,"orders"));

    let bar = 0;
    let rest = 0;
    let pool = 0;
    let laundry = 0;

    orderSnapshot.forEach((doc)=>{

      const data = doc.data();

      if(data.department==="bar") bar += data.total;
      if(data.department==="restaurant") rest += data.total;
      if(data.department==="pool") pool += data.total;
      if(data.department==="laundry") laundry += data.total;

    });

    setBarRevenue(bar);
    setRestaurantRevenue(rest);
    setPoolRevenue(pool);
    setLaundryRevenue(laundry);

  };

  useEffect(()=>{
    fetchDashboard();
  },[]);

  const occupancyRate = rooms > 0 ? ((occupied / rooms) * 100).toFixed(1) : 0;

  const totalRevenue =
    roomRevenue +
    barRevenue +
    restaurantRevenue +
    poolRevenue +
    laundryRevenue;

  return (

    <div>

      <h2>Admin Dashboard</h2>

      <h3>Room Statistics</h3>

      <p>Total Rooms: {rooms}</p>
      <p>Available: {available}</p>
      <p>Occupied: {occupied}</p>
      <p>Maintenance: {maintenance}</p>
      <p>Occupancy Rate: {occupancyRate}%</p>

      <h3>Department Revenue</h3>

      <p>Rooms: ₦{roomRevenue}</p>
      <p>Restaurant: ₦{restaurantRevenue}</p>
      <p>Bar: ₦{barRevenue}</p>
      <p>Pool: ₦{poolRevenue}</p>
      <p>Laundry: ₦{laundryRevenue}</p>

      <h3>Total Revenue</h3>

      <p>₦{totalRevenue}</p>

    </div>

  );
}