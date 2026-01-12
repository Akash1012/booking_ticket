import { useSeatsManager } from "../Hook/useSeatManager";
import "./styles.css";

function SeatSVG({ color }) {
  return (
    <svg viewBox="0 0 64 64" width="100%" height="100%">
      <rect x="8" y="10" rx="8" ry="8" width="48" height="28" fill={color} />
      <rect x="12" y="38" rx="6" ry="6" width="16" height="14" fill={color} />
      <rect x="36" y="38" rx="6" ry="6" width="16" height="14" fill={color} />
    </svg>
  );
}

function Legend({ color, label }) {
  return (
    <div className="legend-item">
      <div className="legend-box" style={{ background: color }} />
      <span>{label}</span>
    </div>
  );
}

export default function CinemaSeatBooking(props) {
  const {
    layout = { rows: 8, seatsPerRow: 12, aislePosition: 6 },
    seatTypes,
    bookedSeats = [],
    currency = "₹",
  } = props;

  const {
    seats,
    selectedSeats,
    totalAmount,
    toggleSeat,
    finalBookSeat,
    getSeatState,
    getSeatColor,
    getSeatClassName,
  } = useSeatsManager({ layout, seatTypes, bookedSeats });

  const handlePay = () => {
    const booked = finalBookSeat();
    debugger;
    alert(`Your ${booked.join(", ")} is Booked`);
  };

  return (
    <div className="cinema">
      <h1 className="title">Cinema Hall Booking</h1>

      <div className="screen-wrapper">
        <div className="screen">SCREEN</div>
      </div>

      <div className="seat-map">
        {seats.map((row, rowIndex) => {
          const rowLabel = String.fromCharCode(65 + rowIndex);

          return (
            <div key={rowLabel} className="seat-row">
              <span className="row-label">{rowLabel}</span>

              {row.map((seat) => {
                const seatState = getSeatState(seat.id);
                const colorSeat = getSeatColor(seatState, seat.name);

                return (
                  <div key={seat.id}>
                    {rowIndex === layout.aislePosition && (
                      <div className="aisle" />
                    )}

                    <div
                      className={`tooltip-container ${getSeatClassName(
                        seatState
                      )}`}
                      onClick={() => toggleSeat(seat)}
                    >
                      <div
                        className="tooltip-text"
                        style={{
                          backgroundColor: colorSeat,
                        }}
                      >
                        {seatState}
                      </div>
                      <SeatSVG color={colorSeat} />
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      <div className="legend">
        {Object.values(seatTypes).map((t) => (
          <Legend key={t.name} color={t.color} label={t.name} />
        ))}
        <Legend color="#adb5bd" label="Booked" />
        <Legend color="#28a745" label="Selected" />
      </div>

      <div className="summary">
        <p>
          <strong>Seats:</strong>{" "}
          {selectedSeats.length ? selectedSeats.join(", ") : "-"}
        </p>
        <p>
          <strong>Total:</strong> {currency} {totalAmount}
        </p>
        <button disabled={!selectedSeats.length} onClick={handlePay}>
          Proceed to Pay
        </button>
      </div>
    </div>
  );
}

// import { useState, useMemo } from "react";

// import "./styles.css";

// export default function CinemaSeatBooking(props) {
//   const [selectedSeats, setSelectedSeats] = useState([]);

//   const {
//     layout = {
//       rows: 8,
//       seatsPerRow: 12,
//       aislePosition: 6,
//     },
//     seatTypes = {
//       regular: {
//         name: "Regular",
//         price: 150,
//         rows: [0, 1, 2],
//         color: "blue",
//       },
//       premium: {
//         name: "Premium",
//         price: 250,
//         rows: [3, 4, 5],
//         color: "#21c1cc",
//       },
//       vip: {
//         name: "VIP",
//         price: 350,
//         rows: [6, 7],
//         color: "#edb009",
//       },
//     },
//     bookedSeats = [],
//     currency = "₹",
//   } = props;

//   const [flBookSeat, setFlBookSeat] = useState(bookedSeats);

//   const getSeatType = (rw) => {
//     const getTheEntries = Object.entries(seatTypes);
//     for (let i = 0; i < getTheEntries.length; i++) {
//       const [type, config] = getTheEntries[i];

//       if (config.rows.includes(rw)) {
//         return {
//           type,
//           ...config,
//         };
//       }
//     }
//   };

//   const initializeSeats = useMemo(() => {
//     const renderSeats = [];
//     for (let row = 0; row < layout.rows; row++) {
//       const seatRow = [];
//       const seatTypeInfo = getSeatType(row);
//       for (let i = 0; i < layout.seatsPerRow; i++) {
//         const seatId = `${String.fromCharCode(65 + row)}${i + 1}`;
//         seatRow.push({
//           id: seatId,
//           row,
//           seat: i,
//           name: seatTypeInfo.type,
//           price: seatTypeInfo.price,
//           color: seatTypeInfo.color,
//           status: flBookSeat.includes(seatId) ? "booked" : "available",
//           selected: false,
//         });
//       }
//       renderSeats.push(seatRow);
//     }
//     return renderSeats;
//   }, [layout, seatTypes, flBookSeat]);

//   const [seats, setSeats] = useState(initializeSeats);

//   const toggleSeat = (rowIndex) => {
//     const { row: selectedRow, seat } = rowIndex;

//     if (rowIndex.status === "booked") return;

//     // Update seat selection
//     setSeats((prevSeats) => {
//       return prevSeats.map((row, rIdx) =>
//         row.map((s, sIdx) => {
//           if (rIdx === selectedRow && sIdx === seat) {
//             return { ...s, selected: !s.selected };
//           }
//           return s;
//         })
//       );
//     });

//     setSelectedSeats((prev) =>
//       prev.includes(rowIndex.id)
//         ? prev.filter((s) => s !== rowIndex.id)
//         : [...prev, rowIndex.id]
//     );
//   };

//   console.log("sss", selectedSeats);

//   // const totalAmount = selectedSeats.reduce((sum, seat) => {
//   //   const row = layout.rows.find((r) => seat.startsWith(r.row));
//   //   return sum + seatTypes[row.type].price;
//   // }, 0);

//   const totalAmount = useMemo(() => {
//     return seats
//       .flat()
//       .filter((seat) => selectedSeats.includes(seat.id))
//       .reduce((sum, seat) => sum + seat.price, 0);
//   }, [selectedSeats, seats]);

//   const getSeatColor = (seatState, seatType) => {
//     switch (seatState) {
//       case "booked":
//         return "#adb5bd";
//       case "selected":
//         return "#28a745";
//       default:
//         return seatTypes[seatType].color;
//     }
//   };

//   const getSeatState = (seatId) => {
//     if (flBookSeat.includes(seatId)) return "booked";
//     if (selectedSeats.includes(seatId)) return "selected";
//     return "available";
//   };

//   const getSeatClassName = (seatState) => {
//     return `seat ${seatState !== "available" ? seatState : ""}`;
//   };

//   console.log("seats", seats);

//   const finalBookSeat = () => {
//     setFlBookSeat((prevBooked) => [...prevBooked, ...selectedSeats]);
//     let bkSeats = selectedSeats;
//     setSelectedSeats([]); // clear selection after payment
//     setSeats((prevSeats) =>
//       prevSeats.map((row) =>
//         row.map((s) =>
//           selectedSeats.includes(s.id)
//             ? { ...s, selected: false, status: "booked" }
//             : s
//         )
//       )
//     );

//     alert(`Your ${bkSeats.join(",")} is Booked`);
//   };

//   return (
//     <div className="cinema">
//       <h1 className="title">Cinema Hall Booking</h1>

//       {/* Screen */}
//       <div className="screen-wrapper">
//         <div className="screen">SCREEN</div>
//       </div>

//       <div className="seat-map">
//         {seats.map((row, rowIndex) => {
//           const renderSeat = `${String.fromCharCode(65 + rowIndex)}`;

//           return (
//             <div key={renderSeat} className="seat-row">
//               <span className="row-label">{renderSeat}</span>

//               {row.map((eachSeat, index) => {
//                 const { id, name } = eachSeat;
//                 const seatState = getSeatState(id);

//                 return (
//                   <div key={index}>
//                     {rowIndex === layout.aislePosition && (
//                       <div className="aisle" />
//                     )}

//                     <div
//                       className={getSeatClassName(seatState)}
//                       onClick={() => toggleSeat(eachSeat)}
//                     >
//                       <SeatSVG color={getSeatColor(seatState, name)} />
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           );
//         })}
//       </div>

//       <div className="legend">
//         {Object.values(seatTypes).map((t) => (
//           <Legend key={t.label} color={t.color} label={t.name} />
//         ))}
//         <Legend color="#adb5bd" label="Booked" />
//         <Legend color="#28a745" label="Selected" />
//       </div>

//       <div className="summary">
//         <h3>Booking Summary</h3>
//         <p>
//           <strong>Seats:</strong>{" "}
//           {selectedSeats.length ? selectedSeats.join(", ") : "-"}
//         </p>
//         <p>
//           <strong>Total:</strong> {currency} {totalAmount}
//         </p>
//         <button disabled={!selectedSeats.length} onClick={finalBookSeat}>
//           Proceed to Pay
//         </button>
//       </div>
//     </div>
//   );
// }
