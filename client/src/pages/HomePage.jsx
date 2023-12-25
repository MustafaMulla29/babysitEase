import Layout from "../components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CaregiverCard from "./client/CaregiverCard";

const HomePage = () => {
  const [caregivers, setCaregivers] = useState([]);
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

  useEffect(() => {
    const getAllCaregivers = async () => {
      try {
        const res = await axios.get(
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
        console.log(error);
        toast.error("Something went wrong", {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    };
    getAllCaregivers();
  }, []);

  return (
    <Layout>
      <div className="flex flex-wrap justify-start items-center gap-6 ml-5">
        {caregivers?.map((caregiver) => (
          <CaregiverCard key={caregiver._id} caregiver={caregiver} />
        ))}
      </div>
    </Layout>
  );
};

export default HomePage;
