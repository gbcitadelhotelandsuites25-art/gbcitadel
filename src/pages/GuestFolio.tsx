import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

interface Order {
  id: string;
  roomNumber: string;
  department: string;
  total: number;
}

export default function GuestFolio() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [roomNumber, setRoomNumber] = useState("");
  const [totalBill, setTotalBill] = useState(0);

  const fetchOrders = async () => {
    if (!roomNumber) return;

    const q = query(
      collection(db, "orders"),
      where("roomNumber", "==", roomNumber)
    );

    const snapshot = await getDocs(q);

    const list: Order[] = [];
    let total = 0;

    snapshot.forEach((doc) => {
      const data = doc.data() as Order;

      list.push({
        id: doc.id,
        ...data,
      });

      total += data.total;
    });

    setOrders(list);
    setTotalBill(total);
  };

  useEffect(() => {
    fetchOrders();
  }, [roomNumber]);

  const printInvoice = () => {
    window.print();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Guest Folio</h2>

      <input
        placeholder="Enter Room Number"
        value={roomNumber}
        onChange={(e) => setRoomNumber(e.target.value)}
      />

      <hr />

      {orders.map((order) => (
        <div key={order.id} style={{ marginBottom: "10px" }}>
          {order.department.toUpperCase()} — ₦{order.total}
        </div>
      ))}

      <hr />

      <h3>Total: ₦{totalBill}</h3>

      <button onClick={printInvoice}>
        Print Invoice
      </button>
    </div>
  );
}