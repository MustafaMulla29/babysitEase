import Layout from "../components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CaregiverCard from "./client/CaregiverCard";
import CaregiverCardSkeleton from "./client/CaregiverCardSkeleton";
import { useSelector } from "react-redux";
import Profile from "./caregiver/Profile";
import {
  MenuItem,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { CiSearch } from "react-icons/ci";
import _ from "lodash";

const HomePage = () => {
  const [caregivers, setCaregivers] = useState([]);
  const { user } = useSelector((state) => state.user);
  const [selectedTab, setSelectedTab] = useState(0);
  const [searchCaregiver, setSearchCaregiver] = useState("");
  const [searchBy, setSearchBy] = useState("-1");
  const [searchedCaregivers, setSearchedCaregivers] = useState(null);
  const [searchError, setSearchError] = useState("");

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

  const babysitters = caregivers.filter(
    (caregiver) => caregiver.user.role === "babysitter"
  );
  const nurses = caregivers.filter(
    (caregiver) => caregiver.user.role === "nurse"
  );

  // const handleCaregiverSearch = (e) => {
  //   setSearchCaregiver(e.target.value);
  //   if (e.target.value.length === 0) {
  //     setSearchedCaregivers([]);
  //     return;
  //   }
  //   if (searchBy === "-1") {
  //     // Display an error or handle it according to your application logic
  //     return alert("Please select search by option");
  //   }

  //   //for babysitters
  //   if (searchBy === "preferredCities" && selectedTab === 0) {
  //     // Filter babysitters with preferredCities including the search value
  //     const filteredBabysitters = babysitters.filter((babysitter) => {
  //       return babysitter.preferredCities.some(
  //         (city) => city.toLowerCase() === e.target.value.toLowerCase()
  //       );
  //     });
  //     setSearchedCaregivers(filteredBabysitters);
  //   }

  //   if (searchBy === "specialisation" && selectedTab === 0) {
  //     const filteredBabysitters = babysitters.filter((babysitter) => {
  //       return babysitter.specialisation.some(
  //         (spec) => spec.toLowerCase() === e.target.value.toLowerCase()
  //       );
  //     });
  //     setSearchedCaregivers(filteredBabysitters);
  //   }

  //   if (searchBy === "ageRange" && selectedTab === 0) {
  //     const filteredBabysitters = babysitters.filter((babysitter) => {
  //       const age = babysitter.ageRange;
  //       return (
  //         age.lowerLimit >= parseInt(e.target.value) &&
  //         age.upperLimit <= parseInt(e.target.value)
  //       );
  //     });
  //     setSearchedCaregivers(filteredBabysitters);
  //   }

  //   //for nurses
  //   if (searchBy === "preferredCities" && selectedTab === 1) {
  //     // Filter babysitters with preferredCities including the search value
  //     const filteredNurses = nurses.filter((nurse) => {
  //       return nurse.preferredCities.some(
  //         (city) => city.toLowerCase() === e.target.value.toLowerCase()
  //       );
  //     });
  //     setSearchedCaregivers(filteredNurses);
  //   }

  //   if (searchBy === "specialisation" && selectedTab === 1) {
  //     const filteredNurses = nurses.filter((nurse) => {
  //       return nurse.specialisation.some(
  //         (spec) => spec.toLowerCase() === e.target.value.toLowerCase()
  //       );
  //     });
  //     setSearchedCaregivers(filteredNurses);
  //   }
  // };

  const handleCaregiverSearch = (e) => {
    setSearchCaregiver(e.target.value);

    if (e.target.value.length === 0) {
      setSearchError("");
      return;
    }

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

  // const debouncedSearch = _.debounce(handleCaregiverSearch, 300);

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
            <div className="relative mb-8 flex items-center justify-between gap-2">
              <span className="absolute inset-y-0 left-0 pl-3  flex items-center">
                <CiSearch className="text-xl" />
              </span>
              <input
                type="search"
                name=""
                className={`${
                  searchError && "border-red-600 focus:border-red-600"
                } pl-9 w-full py-2 pr-4 rounded-3xl outline-none border-[#d9edd9] hover:border-[#282928] border-2 focus:border-[#9ed49e]`}
                placeholder="Search caregiver"
                id=""
                value={searchCaregiver}
                onChange={handleCaregiverSearch}
              />

              <div className=" flex items-center p-0">
                <select
                  className="appearance-none text-center rounded-3xl bg-white border-[#d9edd9] hover:border-[#848e84] border-2 py-2 px-4  outline-none"
                  id="searchDropdown"
                  value={searchBy}
                  onChange={(e) => setSearchBy(e.target.value)}
                >
                  <option value="-1" className="py-2">
                    Search by
                  </option>
                  <option value="preferredCities" className="py-2">
                    Preferred Cities
                  </option>
                  <option value="specialisation" className="py-2">
                    Specialisation
                  </option>
                  <option value="ageRange" className="py-2">
                    Age range
                  </option>
                </select>
              </div>
            </div>
          </div>
          <div className="h-4">
            <Typography className="text-red-500 text-sm mt-3 ml-4">
              {searchError}
            </Typography>
          </div>
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
          {selectedTab === 0 &&
            ((searchCaregiver && searchError) ||
              (!searchError && !searchCaregiver)) && (
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

          {selectedTab === 0 && searchCaregiver && searchError === "" && (
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
                    <p>No results found</p>
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
              (!searchError && !searchCaregiver)) && (
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

          {selectedTab === 1 && searchCaregiver && searchError === "" && (
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
      ) : (
        <Profile />
      )}
    </Layout>
  );
};

export default HomePage;
