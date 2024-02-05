import Layout from "../components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CaregiverCard from "./client/CaregiverCard";
import CaregiverCardSkeleton from "./client/CaregiverCardSkeleton";
import { useSelector } from "react-redux";
import Profile from "./caregiver/Profile";
import { Tab, Tabs, Typography } from "@mui/material";
import { Navigate, useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";

const HomePageNew = () => {
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

  useEffect(() => {
    const getAllCaregivers = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:8070/api/v1/user/getAllCaregivers?page=1&pageSize=${pageSize}&tab=${selectedTab}`,
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
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong", {
          position: toast.POSITION.TOP_CENTER,
        });
      } finally {
        setLoading(false);
      }
    };
    getAllCaregivers();
  }, [page, pageSize, selectedTab]);

  const loadMore = async () => {
    try {
      setLoading(true);
      const nextPage = Math.ceil(caregivers.length / pageSize) + 1; // Calculate the next page based on the current list length

      const res = await axios.get(
        `http://localhost:8070/api/v1/user/getAllCaregivers?page=${nextPage}&pageSize=${pageSize}&tab=${selectedTab}`,
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
      toast.error("Something went wrong", {
        position: toast.POSITION.TOP_CENTER,
      });
    } finally {
      setLoading(false);
    }
  };

  // Handler function for tab change
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    if (searchBy !== "-1") setSearchBy("-1");
    if (searchString.length > 0) setSearchString("");
  };

  const hasMoreCaregivers = caregivers.length < totalCaregivers;

  // const onSearch = async () => {
  //   try {
  //     if (searchString.length === 0 || searchBy === "-1") {
  //       // Reset search results and exit
  //       setSearchResults([]);
  //       return;
  //     }
  //     setLoading(true);
  //     setSearchSubmitted(true);
  //     const res = await axios.get(
  //       `http://localhost:8070/api/v1/user/searchCaregivers?term=${searchString}&searchBy=${searchBy}&tab=${selectedTab}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
  //         },
  //       }
  //     );
  //     if (res.data.success) {
  //       setSearchResults(res.data.combinedCaregivers);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     toast.error("Something went wrong", {
  //       position: toast.POSITION.TOP_CENTER,
  //     });
  //   } finally {
  //     setLoading(false);
  //     setSearchSubmitted(false);
  //   }
  // };

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
            <Typography variant="h3" className=" ">
              Hello {user?.name} 👋
            </Typography>
            <SearchBar
              onSearch={onSearch}
              searchString={searchString}
              searchStringLength={searchString?.length}
              setSearchString={setSearchString}
              searchBy={searchBy}
              setSearchBy={setSearchBy}
            />

            {/* <div className=" flex items-center p-0">
                <Select
                  className="appearance-none text-center rounded-full  bg-white border-[#d9edd9] hover:border-[#848e84] border-2 py-2 px-4  outline-none"
                  id="searchDropdown"
                  value={searchBy}
                  style={{ padding: "0px" }}
                  onChange={(e) => setSearchBy(e.target.value)}
                >
                  <MenuItem
                    style={{ paddingTop: "10px", paddingBottom: "10px" }}
                    value="-1"
                    className=""
                  >
                    Search by
                  </MenuItem>
                  <MenuItem
                    style={{ paddingTop: "10px", paddingBottom: "10px" }}
                    value="preferredCities"
                    className=""
                  >
                    Preferred Cities
                  </MenuItem>
                  <MenuItem
                    style={{ paddingTop: "10px", paddingBottom: "10px" }}
                    value="specialisation"
                    className=""
                  >
                    Specialisation
                  </MenuItem>
                  <MenuItem
                    style={{ paddingTop: "10px", paddingBottom: "10px" }}
                    value="ageRange"
                    className=""
                  >
                    Age range
                  </MenuItem>
                </Select>
              </div> */}
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
            {/* <div>
              <Select
                defaultValue={"default"}
                value={sortBy}
                className="p-1 rounded-full text-sm outline-none border-[#d9edd9] hover:border-[#282928] border-1 focus:border-[#9ed49e]"
                style={{ padding: "0px 0px" }}
                onChange={handleSortByChange}
              >
                <MenuItem
                  style={{ paddingTop: "10px", paddingBottom: "10px" }}
                  value="default"
                >
                  Sort by
                </MenuItem>
                <MenuItem
                  style={{ paddingTop: "10px", paddingBottom: "10px" }}
                  value="age-asc"
                >
                  Age (Low to High)
                </MenuItem>
                <MenuItem
                  style={{ paddingTop: "10px", paddingBottom: "10px" }}
                  value="age-desc"
                >
                  Age (High to Low)
                </MenuItem>
                <MenuItem
                  style={{ paddingTop: "10px", paddingBottom: "10px" }}
                  value="rating-desc"
                >
                  Rating (High to Low)
                </MenuItem>
                <MenuItem
                  style={{ paddingTop: "10px", paddingBottom: "10px" }}
                  value="rating-asc"
                >
                  Rating (Low to High)
                </MenuItem>
              </Select>
            </div> */}
            {/* Other content */}
          </div>
          {/* {selectedTab === 0 &&
            searchResults.length === 0 &&
            (loading ? (
              <div className="flex flex-wrap justify-start items-center gap-6">
                <CaregiverCardSkeleton />
                <CaregiverCardSkeleton />
                <CaregiverCardSkeleton />
                <CaregiverCardSkeleton />
              </div>
            ) : (
              !loading && (
                <div className="flex flex-wrap justify-start items-center gap-11 mt-5">
                  {caregivers && caregivers.length > 0 ? (
                    caregivers
                      .filter(
                        (caregiver) => caregiver.user?.role === "babysitter"
                      )
                      .map((caregiver, index) => (
                        <CaregiverCard
                          key={caregiver._id}
                          caregiver={caregiver}
                          index={index}
                        />
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
              )
            ))}

          {searchString.length > 0 && searchResults.length > 0 ? (
            <div className="flex flex-wrap justify-start items-center gap-11 mt-5">
              {searchResults.map((caregiver, index) => (
                <CaregiverCard
                  key={caregiver._id}
                  caregiver={caregiver}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <figure className="w-1/3 m-auto">
              <img src="./../../img/404.jpg" className="w-full h-full" />
              <Typography variant="h6" className="my-2 text-center">
                No results found
              </Typography>
            </figure>
          )} */}

          {selectedTab === 0 &&
            (loading ? (
              <div className="flex flex-wrap justify-start items-center gap-6">
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
            ))}

          {/* {selectedTab === 1 &&
            searchResults.length === 0 &&
            (loading ? (
              <div className="flex flex-wrap justify-start items-center gap-6">
                <CaregiverCardSkeleton />
                <CaregiverCardSkeleton />
                <CaregiverCardSkeleton />
                <CaregiverCardSkeleton />
              </div>
            ) : (
              <div className="flex flex-wrap justify-start items-center gap-11  mt-5">
                {caregivers && caregivers.length > 0 ? (
                  caregivers
                    .filter((caregiver) => caregiver.user?.role === "nurse")
                    .map((caregiver, index) => (
                      <CaregiverCard
                        key={caregiver._id}
                        caregiver={caregiver}
                        index={index}
                      />
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
            ))} */}

          {selectedTab === 1 && loading ? (
            <div className="flex flex-wrap justify-start items-center gap-6">
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
          )}

          {!loading && hasMoreCaregivers && (
            <div className="flex justify-center mt-5">
              <button
                onClick={loadMore}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
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
};

export default HomePageNew;
