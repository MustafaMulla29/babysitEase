import { useCallback, useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { useSelector } from "react-redux";
import axios from "axios";
import BookingDetails from "./BookingDetails";
import BookingDetailsSkeleton from "./BookingDetailsSkeleton";
import { Typography } from "@mui/material";
import NoBookings from "../../components/NoBookings";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useSelector((state) => state.user);

  const getBookings = useCallback(async () => {
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
      // toast.error("Something went wrong", {
      //   position: toast.POSITION.TOP_CENTER,
      // });
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  useEffect(() => {
    getBookings();
  }, [getBookings]);

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-4">Bookings page</h1>
      <div className="flex items-start flex-row flex-wrap justify-around w-full">
        <div className="flex items-start flex-row flex-wrap justify-start w-full">
          {loading ? (
            <>
              <BookingDetailsSkeleton />
              <BookingDetailsSkeleton />
              <BookingDetailsSkeleton />
            </>
          ) : bookings.length > 0 ? (
            bookings.map((booking) => (
              <BookingDetails key={booking._id} booking={booking} />
            ))
          ) : (
            <figure className="w-1/3 m-auto">
              <NoBookings />
              <Typography variant="h5" className="my-2 text-[19px] text-center">
                You don&apos;t have any bookings as of now
              </Typography>
            </figure>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Bookings;
