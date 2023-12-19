import Layout from "../components/Layout";
import axios from "axios";
import React, { useEffect } from "react";

const HomePage = () => {
  //login user data
  const getUserData = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8070/api/v1/user/getUserData",
        {},
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getUserData();
  }, []);

  return (
    <>
      <Layout>
        <h1 className="text-2xl  text-center">Homepage</h1>
      </Layout>
    </>
  );
};

export default HomePage;
