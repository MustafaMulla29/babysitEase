import Layout from "../components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CaregiverCard from "./client/CaregiverCard";
import CaregiverCardSkeleton from "./client/CaregiverCardSkeleton";
import { useSelector } from "react-redux";
import Profile from "./caregiver/Profile";
import { Tab, Tabs, TextField, Typography } from "@mui/material";
import { CiSearch } from "react-icons/ci";

const HomePage = () => {
  const [caregivers, setCaregivers] = useState([]);
  const { user } = useSelector((state) => state.user);
  const [selectedTab, setSelectedTab] = useState(0);

  // Handler function for tab change
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };
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
        <div>
          <div className="space-y-5">
            <Typography variant="h3" className=" ">
              Hello {user?.name} 👋
            </Typography>
            <div className="relative mb-8">
              <span className="absolute inset-y-0 left-0 pl-3  flex items-center">
                <CiSearch className="text-xl" />
              </span>
              <input
                type="search"
                name=""
                className="pl-9 w-full py-2 pr-4 rounded-3xl outline-none border-[#d9edd9] hover:border-[#848e84] border-2 focus:border-[#9ed49e]"
                placeholder="Search caregiver"
                id=""
              />
            </div>
          </div>
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            aria-label="basic tabs example"
            className="mt-5"
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="Babysitters" />
            <Tab label="Nurses" />
          </Tabs>
          {selectedTab === 0 && (
            <div className="flex flex-wrap justify-center items-center gap-11 ml-5 mt-5">
              {caregivers && caregivers.length > 0 ? (
                caregivers
                  .filter((caregiver) => caregiver.user.role === "babysitter")
                  .map((caregiver) => (
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
          )}
          {selectedTab === 1 && (
            <div className="flex flex-wrap justify-center items-center gap-11 ml-5 mt-5">
              {caregivers && caregivers.length > 0 ? (
                caregivers
                  .filter((caregiver) => caregiver.user.role === "nurse")
                  .map((caregiver) => (
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
          )}
          {/* <div className="flex flex-wrap justify-center items-center gap-11 ml-5 mt-3">
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
          </div> */}
        </div>
      ) : (
        <Profile />
      )}
    </Layout>
  );
};

export default HomePage;
