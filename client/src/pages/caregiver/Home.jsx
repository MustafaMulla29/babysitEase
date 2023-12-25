import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { toast } from "react-toastify";
import axios from "axios";

const Home = () => {
  const [caregivers, setCaregivers] = useState([]);
  useEffect(() => {
    try {
      const res = axios.get(
        "http://localhost:8070/api/v1/user/getAllCaregivers",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data.success) {
        setCaregivers(res.data.data);
      }
    } catch (error) {
      toast.error("Something went wrong", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  }, []);
  return (
    <Layout>
      <h1>Client homepage</h1>
    </Layout>
  );
};

export default Home;
