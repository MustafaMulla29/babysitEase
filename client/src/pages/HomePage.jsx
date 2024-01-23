import Layout from "../components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CaregiverCard from "./client/CaregiverCard";
import CaregiverCardSkeleton from "./client/CaregiverCardSkeleton";
import { useSelector } from "react-redux";
import Profile from "./caregiver/Profile";
import { MenuItem, Select, Tab, Tabs, Typography } from "@mui/material";
import { CiSearch } from "react-icons/ci";
import { Navigate } from "react-router-dom";

const HomePage = () => {
  const [caregivers, setCaregivers] = useState([]);
  const { user } = useSelector((state) => state.user);
  const [selectedTab, setSelectedTab] = useState(0);
  const [searchCaregiver, setSearchCaregiver] = useState("");
  const [searchBy, setSearchBy] = useState("-1");
  const [searchedCaregivers, setSearchedCaregivers] = useState(null);
  const [searchError, setSearchError] = useState("");
  const [sortBy, setSortBy] = useState("default");

  // Handler function for tab change
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };
  //login user data
  const getUserData = async () => {
    try {
      await axios.post(
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

  const babysitters = caregivers.filter(
    (caregiver) => caregiver.user.role === "babysitter"
  );
  const nurses = caregivers.filter(
    (caregiver) => caregiver.user.role === "nurse"
  );

  const handleCaregiverSearch = (e) => {
    setSearchCaregiver(e.target.value);

    if (e.target.value.length === 0) {
      setSearchError("");
      setSortBy("default");
      setCaregivers((prevCaregivers) => [...prevCaregivers]);
      return;
    }
    setSortBy("default");
    if (searchBy === "-1") {
      setSearchError("Please select the search by option");
      return;
    } else if (searchBy === "ageRange" && isNaN(e.target.value)) {
      setSearchError("Please enter a number");
      return;
    } else if (
      (searchBy === "preferredCities" || searchBy === "specialisation") &&
      !isNaN(e.target.value)
    ) {
      setSearchError("Please enter a valid string");
      return;
    }

    if (!searchError) {
      const filterCaregivers = (caregiversList, filterFn) => {
        const filteredCaregivers = caregiversList.filter(filterFn);
        setSearchedCaregivers(filteredCaregivers);
      };

      const filterByPreferredCities = (caregiver) =>
        caregiver.preferredCities.some(
          (city) => city.toLowerCase() === e.target.value.toLowerCase()
        );

      const filterBySpecialisation = (caregiver) =>
        caregiver.specialisation.some(
          (spec) => spec.toLowerCase() === e.target.value.toLowerCase()
        );

      const filterByAgeRange = (caregiver) => {
        const age = parseInt(e.target.value);

        return (
          !isNaN(age) &&
          age >= caregiver.ageRange.lowerLimit &&
          age <= caregiver.ageRange.upperLimit
        );
      };

      const filterBabysitters = () => {
        const filterFunction =
          searchBy === "preferredCities"
            ? filterByPreferredCities
            : searchBy === "specialisation"
            ? filterBySpecialisation
            : searchBy === "ageRange"
            ? filterByAgeRange
            : null;

        filterFunction && filterCaregivers(babysitters, filterFunction);
      };

      const filterNurses = () => {
        const filterFunction =
          searchBy === "preferredCities"
            ? filterByPreferredCities
            : searchBy === "specialisation"
            ? filterBySpecialisation
            : searchBy === "ageRange"
            ? filterByAgeRange
            : null;

        filterFunction && filterCaregivers(nurses, filterFunction);
      };

      selectedTab === 0 ? filterBabysitters() : filterNurses();
    }
  };

  const handleSortByChange = (e) => {
    const value = e.target.value;
    setSortBy(value);

    const applySorting = (caregiversList) => {
      switch (value) {
        case "age-asc":
          return [...caregiversList].sort(
            (a, b) => a.ageRange.lowerLimit - b.ageRange.upperLimit
          );
        case "age-desc":
          return [...caregiversList].sort(
            (a, b) => b.ageRange.upperLimit - a.ageRange.lowerLimit
          );
        case "rating-desc":
          return [...caregiversList].sort((a, b) => b.rating - a.rating);
        case "rating-asc":
          return [...caregiversList].sort((a, b) => a.rating - b.rating);
        // Add more cases for other sorting options as needed
        default:
          return caregiversList; // No sorting
      }
    };

    if (searchedCaregivers?.length > 0) {
      setSearchedCaregivers((prevSearchedCaregivers) =>
        applySorting(prevSearchedCaregivers)
      );
    } else if (selectedTab === 0) {
      setSearchedCaregivers(() => applySorting(babysitters));
    } else {
      setSearchedCaregivers(() => applySorting(nurses));
    }
  };

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
            <div className="relative mb-8 flex items-center justify-between gap-2">
              <span className="absolute inset-y-0 left-0 pl-3  flex items-center">
                <CiSearch className="text-2xl" />
              </span>
              <input
                type="search"
                name=""
                className={`${
                  searchError && "border-red-600 focus:border-red-600"
                } pl-10 w-full py-4 pr-4 rounded-full outline-none border-[#d9edd9] hover:border-[#282928] border-2 focus:border-[#9ed49e]`}
                placeholder="Search caregiver"
                id=""
                value={searchCaregiver}
                onChange={handleCaregiverSearch}
              />

              <div className=" flex items-center p-0">
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
              </div>
            </div>
          </div>
          <div className="h-4">
            <Typography className="text-red-500 text-sm mt-3 ml-4">
              {searchError}
            </Typography>
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
            <div>
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
            </div>
            {/* Other content */}
          </div>
          {selectedTab === 0 &&
            ((searchCaregiver && searchError) ||
              (!searchError && !searchCaregiver)) &&
            sortBy === "default" && (
              <div className="flex flex-wrap justify-start items-center gap-11 mt-5">
                {caregivers && caregivers.length > 0 ? (
                  caregivers
                    .filter((caregiver) => caregiver.user.role === "babysitter")
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
            )}

          {selectedTab === 0 &&
            (searchCaregiver || sortBy !== "default") &&
            searchError === "" && (
              <div className="flex flex-wrap justify-start items-center gap-11 mt-5">
                {searchedCaregivers && searchedCaregivers.length > 0 ? (
                  searchedCaregivers.map((caregiver, index) => (
                    <CaregiverCard
                      key={caregiver._id}
                      caregiver={caregiver}
                      index={index}
                    />
                  ))
                ) : (
                  <div className="text-center">
                    {searchedCaregivers && searchedCaregivers.length === 0 ? (
                      <figure className="w-1/3 m-auto">
                        <img
                          src="./../../img/404.jpg"
                          className="w-full h-full"
                        />
                        <Typography variant="h6" className="my-2">
                          No results found
                        </Typography>
                      </figure>
                    ) : (
                      <div className="flex flex-wrap justify-start items-center gap-6">
                        <CaregiverCardSkeleton />
                        <CaregiverCardSkeleton />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

          {selectedTab === 1 &&
            ((searchCaregiver && searchError) ||
              (!searchError && !searchCaregiver)) &&
            sortBy === "default" && (
              <div className="flex flex-wrap justify-start items-center gap-11  mt-5">
                {caregivers && caregivers.length > 0 ? (
                  caregivers
                    .filter((caregiver) => caregiver.user.role === "nurse")
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
            )}

          {selectedTab === 1 &&
            (searchCaregiver || sortBy !== "default") &&
            searchError === "" && (
              <div className="flex flex-wrap justify-start items-center gap-11 mt-5">
                {searchedCaregivers && searchedCaregivers.length > 0 ? (
                  searchedCaregivers.map((caregiver, index) => (
                    <CaregiverCard
                      key={caregiver._id}
                      caregiver={caregiver}
                      index={index}
                    />
                  ))
                ) : (
                  <div className="">
                    {searchCaregiver.length > 0 ? (
                      <p className="text-center">No results found</p>
                    ) : (
                      <div className="flex flex-wrap justify-start items-center gap-6">
                        <CaregiverCardSkeleton />
                        <CaregiverCardSkeleton />
                      </div>
                    )}
                  </div>
                )}
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

export default HomePage;
