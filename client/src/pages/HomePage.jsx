import Layout from "../components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CaregiverCard from "./client/CaregiverCard";
import CaregiverCardSkeleton from "./client/CaregiverCardSkeleton";
import { useSelector } from "react-redux";
import Profile from "./caregiver/Profile";

const HomePage = () => {
  const [caregivers, setCaregivers] = useState([]);
  const { user } = useSelector((state) => state.user);
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
      {user?.role === "client" ? (
        <div className="flex flex-wrap justify-start items-center gap-6 ml-5">
          {caregivers && caregivers.length > 0 ? (
            caregivers.map((caregiver) => (
              <CaregiverCard key={caregiver._id} caregiver={caregiver} />
            ))
          ) : (
            <div className="flex flex-wrap justify-start items-center gap-6">
              <CaregiverCardSkeleton />
              <CaregiverCardSkeleton />
              <CaregiverCardSkeleton />
              <CaregiverCardSkeleton />
              <CaregiverCardSkeleton />
              <CaregiverCardSkeleton />
              <CaregiverCardSkeleton />
              <CaregiverCardSkeleton />
            </div>
          )}
        </div>
      ) : (
        <Profile />
      )}
    </Layout>
  );
};

export default HomePage;
