import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Box, Typography } from "@mui/material";

function ReservationCalendar() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const roomSnapshot = await getDocs(collection(db, "rooms"));
      const reservationSnapshot = await getDocs(collection(db, "reservations"));

      const roomList: any[] = [];
      const reservationList: any[] = [];

      roomSnapshot.forEach((doc) => {
        roomList.push({ id: doc.id, ...doc.data() });
      });

      reservationSnapshot.forEach((doc) => {
        reservationList.push({ id: doc.id, ...doc.data() });
      });

      setRooms(roomList);
      setReservations(reservationList);
    };

    loadData();
  }, []);

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" sx={{ marginBottom: 3 }}>
        Reservation Calendar
      </Typography>

      {rooms.map((room) => (
        <Box
          key={room.id}
          sx={{
            border: "1px solid #ccc",
            padding: 2,
            marginBottom: 1,
          }}
        >
          Room {room.number}
        </Box>
      ))}
    </Box>
  );
}

export default ReservationCalendar;