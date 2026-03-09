import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../auth/AuthContext";

import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Typography
} from "@mui/material";

interface Reservation {
  id: string;
  reservationNumber: string;
  guest: {
    full_name: string;
  };
  roomId: string;
  checkIn: any;
  checkOut: any;
  status: string;
}

function ReservationsList() {
  const { tenantId, branchId } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const loadReservations = async () => {
    if (!tenantId || !branchId) return;

    const q = query(
      collection(db, "reservations"),
      where("tenantId", "==", tenantId),
      where("branchId", "==", branchId)
    );

    const snapshot = await getDocs(q);

    const data: Reservation[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Reservation)
    }));

    setReservations(data);
  };

  useEffect(() => {
    loadReservations();
  }, [tenantId, branchId]);

  return (
    <div style={{ padding: 40 }}>
      <Typography variant="h4" gutterBottom>
        Reservations
      </Typography>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Reservation</TableCell>
              <TableCell>Guest</TableCell>
              <TableCell>Room</TableCell>
              <TableCell>Check-In</TableCell>
              <TableCell>Check-Out</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {reservations.map((r) => (
              <TableRow key={r.id}>
                <TableCell>{r.reservationNumber}</TableCell>
                <TableCell>{r.guest.full_name}</TableCell>
                <TableCell>{r.roomId}</TableCell>

                <TableCell>
                  {r.checkIn?.toDate().toLocaleDateString()}
                </TableCell>

                <TableCell>
                  {r.checkOut?.toDate().toLocaleDateString()}
                </TableCell>

                <TableCell>{r.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
}

export default ReservationsList;