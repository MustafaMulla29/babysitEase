import { useEffect, useState } from "react";
import Layout from "./../components/Layout";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import BookingDetails from "./BookingDetails";

const Bookings = () => {
  const [bookings, setBookings] = useState(null);

  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    const getBookings = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8070/api/v1/user/getBookings",
          {
            params: { clientId: user?._id },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (res.data.success) {
          setBookings(res.data.data);
        }
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong", {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    };
    getBookings();
  }, [user]);
  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-4">Bookings page</h1>
      {bookings &&
        bookings.map((booking) => (
          <BookingDetails key={booking._id} booking={booking} />
        ))}
    </Layout>
  );
};

export default Bookings;
