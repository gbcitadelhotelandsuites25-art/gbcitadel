import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

export default function RevenueDashboard() {

  const [barRevenue,setBarRevenue] = useState(0);
  const [restaurantRevenue,setRestaurantRevenue] = useState(0);
  const [poolRevenue,setPoolRevenue] = useState(0);
  const [laundryRevenue,setLaundryRevenue] = useState(0);

  const fetchRevenue = async () => {

    const snapshot = await getDocs(collection(db,"orders"));

    let bar = 0;
    let rest = 0;
    let pool = 0;
    let laundry = 0;

    snapshot.forEach((doc)=>{

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
    fetchRevenue();
  },[]);

  const totalRevenue =
    barRevenue +
    restaurantRevenue +
    poolRevenue +
    laundryRevenue;

  const card = {
    background:"#1f2937",
    padding:"20px",
    borderRadius:"10px",
    minWidth:"200px"
  };

  return (

    <div>

      <h1>Revenue Dashboard</h1>

      <div style={{display:"flex",gap:"20px",flexWrap:"wrap"}}>

        <div style={card}>
          <h3>Restaurant</h3>
          <p>₦{restaurantRevenue}</p>
        </div>

        <div style={card}>
          <h3>Bar</h3>
          <p>₦{barRevenue}</p>
        </div>

        <div style={card}>
          <h3>Pool</h3>
          <p>₦{poolRevenue}</p>
        </div>

        <div style={card}>
          <h3>Laundry</h3>
          <p>₦{laundryRevenue}</p>
        </div>

        <div style={card}>
          <h3>Total Revenue</h3>
          <p>₦{totalRevenue}</p>
        </div>

      </div>

    </div>
  );
}