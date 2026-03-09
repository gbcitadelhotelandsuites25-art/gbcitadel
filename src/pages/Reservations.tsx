import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { createReservation } from "../services/reservationService";
import { useAuth } from "../auth/AuthContext";
import { auth, db } from "../firebase";

import {
  TextField,
  Button,
  MenuItem,
  Typography,
  Box
} from "@mui/material";

function Reservations() {
  const { tenantId, branchId } = useAuth();

  const [guestName, setGuestName] = useState("");
  const [phone, setPhone] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const [rooms, setRooms] = useState<any[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // LOAD ROOMS FROM FIRESTORE
  useEffect(() => {
    const loadRooms = async () => {
      const snapshot = await getDocs(collection(db, "rooms"));

      const roomList: any[] = [];

      snapshot.forEach((doc) => {
        roomList.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      setRooms(roomList);

      if (roomList.length > 0) {
        setSelectedRoom(roomList[0]);
      }
    };

    loadRooms();
  }, []);

  const handleRoomChange = (roomId: string) => {
    const room = rooms.find((r) => r.id === roomId);
    setSelectedRoom(room);
  };

  // 🔒 CHECK DOUBLE BOOKING
  const checkRoomAvailability = async () => {
    const q = query(
      collection(db, "reservations"),
      where("roomId", "==", selectedRoom.id)
    );

    const snapshot = await getDocs(q);

    const newCheckIn = new Date(checkIn);
    const newCheckOut = new Date(checkOut);

    for (const doc of snapshot.docs) {
      const data: any = doc.data();

      const existingCheckIn = data.checkIn.toDate();
      const existingCheckOut = data.checkOut.toDate();

      const overlap =
        newCheckIn < existingCheckOut && newCheckOut > existingCheckIn;

      if (overlap) {
        throw new Error("Room already booked for these dates.");
      }
    }
  };

  const handleCreate = async (source: "walk_in" | "phone") => {
    try {
      setLoading(true);
      setMessage("");

      const user = auth.currentUser;

      if (!user) {
        alert("Not logged in");
        return;
      }

      if (!tenantId || !branchId) {
        alert("Tenant or branch missing.");
        return;
      }

      if (!guestName || !phone || !checkIn || !checkOut) {
        alert("Please fill all fields.");
        return;
      }

      // 🔒 Prevent double booking
      await checkRoomAvailability();

      const reservationNumber = await createReservation({
        tenantId,
        branchId,
        branchCode: "ABK",

        roomId: selectedRoom.id,
        categoryId: selectedRoom.category,

        guest: {
          full_name: guestName,
          phone,
          email: null,
          id_type: null,
          id_number: null,
        },

        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        nightlyRate: selectedRoom.price,

        createdBy: user.uid,
        source,
      });

      setMessage(`Reservation Created: ${reservationNumber}`);

      setGuestName("");
      setPhone("");
      setCheckIn("");
      setCheckOut("");

    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ padding: 4, maxWidth: 500, color: "white" }}>
      <Typography variant="h4" sx={{ color: "gold", marginBottom: 3 }}>
        Reservations
      </Typography>

      <TextField
        label="Guest Name"
        fullWidth
        margin="normal"
        value={guestName}
        onChange={(e) => setGuestName(e.target.value)}
      />

      <TextField
        label="Phone Number"
        fullWidth
        margin="normal"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <TextField
        select
        label="Select Room"
        fullWidth
        margin="normal"
        value={selectedRoom?.id || ""}
        onChange={(e) => handleRoomChange(e.target.value)}
      >
        {rooms.map((room) => (
          <MenuItem key={room.id} value={room.id}>
            Room {room.number} — {room.category}
          </MenuItem>
        ))}
      </TextField>

      {selectedRoom && (
        <Typography sx={{ marginTop: 2 }}>
          Room Price: <strong>₦{selectedRoom.price?.toLocaleString()}</strong>
        </Typography>
      )}

      <TextField
        type="date"
        label="Check-In"
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true }}
        value={checkIn}
        onChange={(e) => setCheckIn(e.target.value)}
      />

      <TextField
        type="date"
        label="Check-Out"
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true }}
        value={checkOut}
        onChange={(e) => setCheckOut(e.target.value)}
      />

      <Box sx={{ marginTop: 3, display: "flex", gap: 2 }}>
        <Button
          variant="contained"
          onClick={() => handleCreate("phone")}
          disabled={loading}
        >
          Create Reservation
        </Button>

        <Button
          variant="contained"
          color="success"
          onClick={() => handleCreate("walk_in")}
          disabled={loading}
        >
          Walk-In Check-In
        </Button>
      </Box>

      {message && (
        <Typography sx={{ marginTop: 3, color: "gold" }}>
          {message}
        </Typography>
      )}
    </Box>
  );
}

export default Reservations;