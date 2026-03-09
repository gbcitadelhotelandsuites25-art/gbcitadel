import { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

interface Room {
  id: string;
  number: string;
  category: string;
  price: number;
  status: string;
}

export default function Rooms() {
  const [rooms, setRooms] = useState<Room[]>([]);

  const fetchRooms = async () => {
    const querySnapshot = await getDocs(collection(db, "rooms"));
    const roomList: Room[] = [];

    querySnapshot.forEach((docSnap) => {
      roomList.push({
        id: docSnap.id,
        ...(docSnap.data() as Omit<Room, "id">),
      });
    });

    setRooms(roomList);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const updateRoomStatus = async (roomId: string, status: string) => {
    await updateDoc(doc(db, "rooms", roomId), {
      status: status,
    });

    fetchRooms();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "vacant":
        return "lightgreen";
      case "occupied":
        return "red";
      case "reserved":
        return "orange";
      case "dirty":
        return "brown";
      case "cleaning":
        return "skyblue";
      default:
        return "gray";
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Rooms & Housekeeping</h2>

      {rooms.map((room) => (
        <div
          key={room.id}
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            marginBottom: "10px",
            borderRadius: "8px",
          }}
        >
          <strong>Room {room.number}</strong> — {room.category}

          <span
            style={{
              marginLeft: "10px",
              padding: "4px 10px",
              borderRadius: "5px",
              backgroundColor: getStatusColor(room.status),
              color: "#000",
              fontWeight: "bold",
            }}
          >
            {room.status.toUpperCase()}
          </span>

          <div style={{ marginTop: "10px" }}>
            {room.status === "dirty" && (
              <button
                onClick={() => updateRoomStatus(room.id, "cleaning")}
                style={{ marginRight: "10px" }}
              >
                Start Cleaning
              </button>
            )}

            {room.status === "cleaning" && (
              <button
                onClick={() => updateRoomStatus(room.id, "vacant")}
                style={{ marginRight: "10px" }}
              >
                Mark Clean
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}