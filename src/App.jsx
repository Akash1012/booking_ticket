import CinemaSeatBooking from "./components/cinema-seat-booking";

const App = () => {
  return (
    <>
      <CinemaSeatBooking
        layout={{ rows: 8, seatsPerRow: 12, aislePosition: 6 }}
        seatTypes={{
          regular: {
            name: "Regular",
            price: 150,
            rows: [0, 1, 2],
            color: "blue",
          },
          premium: {
            name: "Premium",
            price: 250,
            rows: [3, 4, 5],
            color: "#21c1cc",
          },
          vip: { name: "VIP", price: 350, rows: [6, 7], color: "#edb009" },
        }}
        bookedSeats={["A1", "A8", "B3", "C12", "F5", "G2"]}
      />
    </>
  );
};

export default App;
