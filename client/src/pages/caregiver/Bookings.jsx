import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import CaregiverBookingDetails from "./BookingDetails";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import { Typography } from "@mui/material";

const Bookings = () => {
  const [bookings, setBookings] = useState(null);

  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    const getBookings = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8070/api/v1/caregiver/getBookings",
          {
            params: { caregiverId: user?._id },
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

  useEffect(() => {
    const bookingStatus = async () => {
      try {
        const res = await axios.post(
          "http://localhost:8070/api/v1/caregiver/bookingStatus",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } catch (error) {
        // console.log(error);
        // toast.error("Something went wrong", {
        //   position: toast.POSITION.TOP_CENTER,
        // });
        return;
      }
    };
    bookingStatus();
  }, []);
  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-4">Bookings page</h1>
      {bookings ? (
        bookings.map((booking) => (
          <CaregiverBookingDetails key={booking._id} booking={booking} />
        ))
      ) : (
        <Typography>You don't have any bookings as of now</Typography>
      )}
    </Layout>
  );
};

export default Bookings;
