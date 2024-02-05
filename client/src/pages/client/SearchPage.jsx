import {
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Typography,
} from "@mui/material";
import CaregiverCard from "./CaregiverCard";
import SearchBar from "../../components/SearchBar";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Layout from "../../components/Layout";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import CaregiverCardSkeleton from "./CaregiverCardSkeleton";

const SearchPage = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [tab, setTab] = useState("babysitter");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [searchString, setSearchString] = useState(searchParams.get("q"));
  const [searchBy, setSearchBy] = useState(searchParams.get("searchby"));

  //   useEffect(() => {
  //     const fetchSearchResults = async () => {
  //       try {
  //         if (searchString.length === 0 || searchBy === "-1") {
  //           // Reset search results and exit
  //           setSearchResults([]);
  //           return;
  //         }
  //         const res = await axios.get(
  //           `http://localhost:8070/api/v1/user/searchCaregivers?term=${searchString}&searchBy=${searchBy}&tab=${0}`,
  //           {
  //             headers: {
  //               Authorization: `Bearer ${localStorage.getItem("token")}`,
  //             },
  //           }
  //         );
  //         if (res.data.success) {
  //           setSearchResults(res.data.combinedCaregivers);
  //         }
  //       } catch (error) {
  //         console.log(error);
  //         toast.error("Something went wrong", {
  //           position: toast.POSITION.TOP_CENTER,
  //         });
  //       }
  //     };

  //     if (searchString) {
  //       fetchSearchResults();
  //     }
  //   }, [searchString, searchBy]);
  useEffect(() => {
    onSearch();
  }, []);

  useEffect(() => {
    const newSearchParams = new URLSearchParams();
    if (searchString) newSearchParams.append("q", searchString);
    if (searchBy) newSearchParams.append("searchby", searchBy);

    // Replace the current entry in the history stack with the new URL
    navigate({
      search: newSearchParams.toString(),
    });
  }, [searchString, searchBy, navigate]);

  const onSearch = async () => {
    try {
      if (searchString.length === 0 || searchBy === "-1") {
        // Reset search results and exit
        setSearchResults([]);
        return;
      }
      setLoading(true);
      const res = await axios.get(
        `http://localhost:8070/api/v1/user/searchCaregivers?term=${searchString}&searchBy=${searchBy}&tab=${tab}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        setSearchResults(res.data.combinedCaregivers);
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

  return (
    //TODO:SHOW BABYSITTERS AND NURSES SEPERATELY
    <Layout>
      <div className="relative">
        <Link
          to="/"
          className="absolute -top-12 -left-20 text-lg p-2 rounded-full hover:bg-slate-100"
        >
          <IoIosArrowBack />
        </Link>
        <SearchBar
          onSearch={onSearch}
          searchString={searchString}
          setSearchString={setSearchString}
          searchStringLength={searchString?.length}
          searchBy={searchBy}
          setSearchBy={setSearchBy}
        />

        <div className="flex items-center justify-between">
          <Typography variant="h6" className="my-3">
            Search Results for: {searchString}
          </Typography>
          <FormControl>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
            >
              <FormControlLabel
                name="tab"
                className=""
                value="babysitter"
                checked={tab === "babysitter"}
                onChange={(e) => setTab(e.target.value)}
                required
                control={<Radio />}
                label="Babysitter"
              />
              <FormControlLabel
                name="tab"
                value="nurse"
                className=""
                checked={tab === "nurse"}
                onChange={(e) => setTab(e.target.value)}
                required
                control={<Radio />}
                label="Nurse"
              />
            </RadioGroup>
          </FormControl>
        </div>

        {loading ? (
          <div className="flex flex-wrap justify-start items-center gap-6">
            <CaregiverCardSkeleton />
            <CaregiverCardSkeleton />
            <CaregiverCardSkeleton />
            <CaregiverCardSkeleton />
          </div>
        ) : searchResults.length > 0 ? (
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
        )}
      </div>
    </Layout>
  );
};

export default SearchPage;
