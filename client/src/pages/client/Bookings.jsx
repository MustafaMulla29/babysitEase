import axios from "axios";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

const Bookings = () => {
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    const getAllBookings = async () => {
      try {
        const res = await axios.get();
      } catch (error) {
        console.log(error);
      }
    };
  });
  return <></>;
};

export default Bookings;
