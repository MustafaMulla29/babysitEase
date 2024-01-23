import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import BookingDetails from "./BookingDetails";
import BookingDetailsSkeleton from "./BookingDetailsSkeleton";
import { Typography } from "@mui/material";

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

  useEffect(() => {
    const bookingStatus = async () => {
      try {
        await axios.post(
          "http://localhost:8070/api/v1/caregiver/bookingStatus",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } catch (error) {
        return;
      }
    };
    bookingStatus();
  }, []);
  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-4">Bookings page</h1>
      {bookings && bookings?.length > 0 ? (
        bookings.map((booking) => (
          <BookingDetails key={booking._id} booking={booking} />
        ))
      ) : !bookings ? (
        <div>
          <BookingDetailsSkeleton />
          <BookingDetailsSkeleton />
          <BookingDetailsSkeleton />
        </div>
      ) : (
        <figure className="w-1/3 m-auto">
          <img
            src="./../../../img/no_bookings.jpg"
            className="w-full h-full"
            alt="no bookings"
          />
          <Typography className="my-2 text-[19px] text-center">
            You don&apos;t have any bookings as of now
          </Typography>
        </figure>
      )}
    </Layout>
  );
};

export default Bookings;
