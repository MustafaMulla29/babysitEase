/* eslint-disable no-unused-vars */
import Layout from "../components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import CaregiverCard from "./client/CaregiverCard";
import CaregiverCardSkeleton from "./client/CaregiverCardSkeleton";
import { useDispatch, useSelector } from "react-redux";
import Profile from "./caregiver/Profile";
import { Tab, Tabs, Typography } from "@mui/material";
import { Navigate, useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import { openAlert } from "../redux/features/messageSlice";
import {
  resetSubscription,
  selectIsSubscribed,
  setSubscribed,
} from "../redux/features/subscriptionSlice";
import React from "react";

const Homepage = React.memo(() => {
  const [caregivers, setCaregivers] = useState([]);
  const { user } = useSelector((state) => state.user);
  const [selectedTab, setSelectedTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(2);
  const [totalCaregivers, setTotalCaregivers] = useState(1);
  const [searchString, setSearchString] = useState("");
  const [searchBy, setSearchBy] = useState("-1");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isSubscribed = useSelector(selectIsSubscribed);

  useEffect(() => {
    const getAllCaregivers = async () => {
      try {
        setLoading(true);

        // Check if user is defined and has an _id before making the request
        if (user?._id) {
          const res = await axios.get(
            `http://localhost:8070/api/v1/user/getAllCaregivers?page=1&pageSize=${pageSize}&tab=${selectedTab}&clientId=${user._id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          if (res.data.success) {
            setCaregivers(res.data.data.caregivers);
            setTotalCaregivers(res.data.data.totalCaregivers);
          }
        }
      } catch (error) {
        console.log(error);
        dispatch(
          openAlert({ severity: "error", content: "Something went wrong!" })
        );
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === "client") getAllCaregivers();
  }, [page, pageSize, selectedTab, user?._id]);

  const loadMore = async () => {
    try {
      setLoading(true);
      const nextPage = Math.ceil(caregivers.length / pageSize) + 1;

      const res = await axios.get(
        `http://localhost:8070/api/v1/user/getAllCaregivers?page=${nextPage}&pageSize=${pageSize}&tab=${selectedTab}&clientId=${user?._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data.success) {
        setCaregivers((prevCaregivers) => [
          ...prevCaregivers,
          ...res.data.data.caregivers,
        ]);
      }
    } catch (error) {
      console.log(error);
      // toast.error("Something went wrong");
      dispatch(
        openAlert({ severity: "error", content: "Something went wrong!" })
      );
    } finally {
      setLoading(false);
    }
  };

  // Handler function for tab change
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    setCaregivers([]);
    if (searchBy !== "-1") setSearchBy("-1");
    if (searchString.length > 0) setSearchString("");
  };

  const hasMoreCaregivers = caregivers.length < totalCaregivers;

  const onSearch = () => {
    if (searchString.length === 0 || searchBy === "-1") {
      // Reset search results and exit
      return;
    }

    // Redirect to the search page with the search query
    navigate(`/search?q=${searchString}&searchby=${searchBy}`);
  };

  return (
    <Layout>
      {user?.role === "client" ? (
        <div>
          <div className="space-y-5">
            <Typography
              variant="h3"
              className=""
              // style={{ fontFamily: "arboria-bold sans serif" }}
            >
              Hello {user?.name.charAt(0).toUpperCase()}
              {user?.name.slice(1, user?.name.length)} 👋
            </Typography>
            <SearchBar
              onSearch={onSearch}
              searchString={searchString}
              searchStringLength={searchString?.length}
              setSearchString={setSearchString}
              searchBy={searchBy}
              setSearchBy={setSearchBy}
            />
          </div>

          <div className="flex flex-row items-center justify-between">
            <Tabs
              value={selectedTab}
              onChange={handleTabChange}
              aria-label="basic tabs example"
              className="mt-8"
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab label="Babysitters" />
              <Tab label="Nurses" />
            </Tabs>
          </div>

          {/* {selectedTab === 0 &&
            (loading ? (
              <div className="flex flex-wrap justify-start items-center gap-6 mt-5">
                <CaregiverCardSkeleton />
                <CaregiverCardSkeleton />
                <CaregiverCardSkeleton />
                <CaregiverCardSkeleton />
              </div>
            ) : (
              <div className="flex flex-wrap justify-start items-center gap-11 mt-5">
                {caregivers
                  ?.filter((caregiver) => caregiver.user?.role === "babysitter")
                  .map((caregiver, index) => (
                    <CaregiverCard
                      key={caregiver._id}
                      caregiver={caregiver}
                      index={index}
                    />
                  ))}
              </div>
            ))} */}

          {selectedTab === 0 && (
            <div>
              <div className="flex flex-wrap justify-start items-center gap-11 mt-5">
                {caregivers
                  ?.filter((caregiver) => caregiver.user?.role === "babysitter")
                  .map((caregiver, index) => (
                    <CaregiverCard
                      key={caregiver._id}
                      caregiver={caregiver}
                      index={index}
                    />
                  ))}
              </div>

              {loading && (
                <div className="flex flex-wrap justify-start items-center gap-6 mt-5">
                  <CaregiverCardSkeleton />
                  <CaregiverCardSkeleton />
                  <CaregiverCardSkeleton />
                  <CaregiverCardSkeleton />
                </div>
              )}
            </div>
          )}

          {/* {selectedTab === 1 && loading ? (
            <div className="flex flex-wrap justify-start items-center gap-6 mt-5">
              <CaregiverCardSkeleton />
              <CaregiverCardSkeleton />
              <CaregiverCardSkeleton />
              <CaregiverCardSkeleton />
            </div>
          ) : (
            <div className="flex flex-wrap justify-start items-center gap-11 mt-5">
              {caregivers
                ?.filter((caregiver) => caregiver.user?.role === "nurse")
                .map((caregiver, index) => (
                  <CaregiverCard
                    key={caregiver._id}
                    caregiver={caregiver}
                    index={index}
                  />
                ))}
            </div>
          )} */}

          {selectedTab === 1 && (
            <div>
              <div className="flex flex-wrap justify-start items-center gap-11 mt-5">
                {caregivers
                  ?.filter((caregiver) => caregiver.user?.role === "nurse")
                  .map((caregiver, index) => (
                    <CaregiverCard
                      key={caregiver._id}
                      caregiver={caregiver}
                      index={index}
                    />
                  ))}
              </div>

              {loading && (
                <div className="flex flex-wrap justify-start items-center gap-6 mt-5">
                  <CaregiverCardSkeleton />
                  <CaregiverCardSkeleton />
                  <CaregiverCardSkeleton />
                  <CaregiverCardSkeleton />
                </div>
              )}
            </div>
          )}

          {!loading && hasMoreCaregivers && (
            <div className="flex justify-center mt-5">
              <button
                onClick={loadMore}
                className="bg-blue-500 hover:ring-1 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      ) : user?.role === "admin" ? (
        <Navigate to="/admin/caregivers" />
      ) : (
        <Profile />
      )}
    </Layout>
  );
});

Homepage.displayName = "Homepage";
export default Homepage;
