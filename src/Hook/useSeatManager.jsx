import { useState, useMemo, useCallback } from "react";

export function useSeatsManager({ layout, seatTypes, bookedSeats }) {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [flBookSeat, setFlBookSeat] = useState(bookedSeats || []);

  const getSeatType = (rw) => {
    const entries = Object.entries(seatTypes);
    for (let i = 0; i < entries.length; i++) {
      const [type, config] = entries[i];
      if (config.rows.includes(rw)) {
        return { type, ...config };
      }
    }
  };

  const seats = useMemo(() => {
    const renderSeats = [];
    for (let row = 0; row < layout.rows; row++) {
      const seatRow = [];
      const seatTypeInfo = getSeatType(row);

      for (let i = 0; i < layout.seatsPerRow; i++) {
        const seatId = `${String.fromCharCode(65 + row)}${i + 1}`;
        seatRow.push({
          id: seatId,
          row,
          seat: i,
          name: seatTypeInfo.type,
          price: seatTypeInfo.price,
          color: seatTypeInfo.color,
          status: flBookSeat.includes(seatId) ? "booked" : "available",
        });
      }
      renderSeats.push(seatRow);
    }
    return renderSeats;
  }, [layout, seatTypes, flBookSeat, getSeatType]);

  const toggleSeat = useCallback((seat) => {
    if (seat.status === "booked") return;

    setSelectedSeats((prev) =>
      prev.includes(seat.id)
        ? prev.filter((id) => id !== seat.id)
        : [...prev, seat.id]
    );
  }, []);

  const getSeatState = useCallback(
    (seatId) => {
      if (flBookSeat.includes(seatId)) return "booked";
      if (selectedSeats.includes(seatId)) return "selected";
      return "available";
    },
    [flBookSeat, selectedSeats]
  );

  const getSeatColor = useCallback(
    (seatState, seatType) => {
      switch (seatState) {
        case "booked":
          return "#adb5bd";
        case "selected":
          return "#28a745";
        default:
          return seatTypes[seatType].color;
      }
    },
    [seatTypes]
  );

  const getSeatClassName = useCallback((seatState) => {
    return `seat ${seatState !== "available" ? seatState : ""}`;
  }, []);

  const totalAmount = useMemo(() => {
    return seats
      .flat()
      .filter((seat) => selectedSeats.includes(seat.id))
      .reduce((sum, seat) => sum + seat.price, 0);
  }, [selectedSeats, seats]);

  const finalBookSeat = useCallback(() => {
    setFlBookSeat((prev) => [...prev, ...selectedSeats]);
    let bkFinal = selectedSeats;
    setSelectedSeats([]);

    return bkFinal;
  }, [selectedSeats]);

  return {
    seats,
    selectedSeats,
    totalAmount,
    toggleSeat,
    finalBookSeat,
    getSeatState,
    getSeatColor,
    getSeatClassName,
  };
}
