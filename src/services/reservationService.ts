import {
  collection,
  query,
  where,
  getDocs,
  runTransaction,
  doc,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../firebase";

/**
 * Generate Reservation Number
 * Format: RES-{BRANCH}-{YYYYMMDD}-{COUNTER}
 */
async function generateReservationNumber(
  tenantId: string,
  branchId: string,
  branchCode: string
): Promise<string> {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");

  const dateStr = `${yyyy}${mm}${dd}`;
  const counterDocId = `${tenantId}_${branchId}_${dateStr}`;
  const counterRef = doc(db, "reservation_counters", counterDocId);

  return await runTransaction(db, async (transaction) => {
    const counterSnap = await transaction.get(counterRef);

    let newCounter = 1;

    if (counterSnap.exists()) {
      const data = counterSnap.data();
      newCounter = data.counter + 1;

      transaction.update(counterRef, {
        counter: newCounter,
      });
    } else {
      transaction.set(counterRef, {
        tenant_id: tenantId,
        branch_id: branchId,
        date: dateStr,
        counter: newCounter,
        created_at: serverTimestamp(),
      });
    }

    const formattedCounter = String(newCounter).padStart(4, "0");

    return `RES-${branchCode}-${dateStr}-${formattedCounter}`;
  });
}

/**
 * Check Room Availability
 */
async function checkRoomAvailability(
  tenantId: string,
  branchId: string,
  roomId: string,
  checkIn: Date,
  checkOut: Date
) {
  const reservationsRef = collection(db, "reservations");

  const q = query(
    reservationsRef,
    where("tenant_id", "==", tenantId),
    where("branch_id", "==", branchId),
    where("room_id", "==", roomId),
    where("is_deleted", "==", false),
    where("status", "in", ["reserved", "checked_in"])
  );

  const snapshot = await getDocs(q);

  for (const docSnap of snapshot.docs) {
    const existing = docSnap.data();

    const existingCheckIn = existing.check_in_date.toDate();
    const existingCheckOut = existing.check_out_date.toDate();

    const overlap =
      existingCheckIn < checkOut &&
      existingCheckOut > checkIn;

    if (overlap) {
      throw new Error("Room is already booked for selected dates.");
    }
  }
}

/**
 * Create Reservation (Transaction Safe)
 */
export async function createReservation(data: {
  tenantId: string;
  branchId: string;
  branchCode: string;
  roomId: string;
  categoryId: string;
  guest: any;
  checkIn: Date;
  checkOut: Date;
  nightlyRate: number;
  createdBy: string;
  source: "walk_in" | "online" | "agent" | "phone";
}) {
  const {
    tenantId,
    branchId,
    branchCode,
    roomId,
    categoryId,
    guest,
    checkIn,
    checkOut,
    nightlyRate,
    createdBy,
    source
  } = data;

  if (checkOut <= checkIn) {
    throw new Error("Check-out date must be after check-in date.");
  }

  await checkRoomAvailability(
    tenantId,
    branchId,
    roomId,
    checkIn,
    checkOut
  );

  const nights =
    Math.ceil(
      (checkOut.getTime() - checkIn.getTime()) /
        (1000 * 60 * 60 * 24)
    );

  const totalRoomAmount = nights * nightlyRate;

  const reservationNumber = await generateReservationNumber(
    tenantId,
    branchId,
    branchCode
  );

  const reservationRef = doc(collection(db, "reservations"));

  await runTransaction(db, async (transaction) => {
    transaction.set(reservationRef, {
      tenant_id: tenantId,
      branch_id: branchId,
      reservation_number: reservationNumber,

      room_id: roomId,
      category_id: categoryId,

      guest,

      check_in_date: checkIn,
      check_out_date: checkOut,
      number_of_nights: nights,

      nightly_rate: nightlyRate,
      total_room_amount: totalRoomAmount,

      status: source === "walk_in" ? "checked_in" : "reserved",
      source,

      created_by: createdBy,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),

      is_deleted: false,
    });
  });

  return reservationNumber;
}