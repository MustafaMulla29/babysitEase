import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { PropTypes } from "prop-types";

const SearchBar = ({
  onSearch,
  searchString,
  setSearchString,
  searchStringLength,
  searchBy,
  setSearchBy,
}) => {
  const [searchError, setSearchError] = useState("");

  const handleSearch = (e) => {
    if (e.code === "Enter" && !searchError) {
      onSearch(searchString);
    }
  };

  useEffect(() => {
    if (searchStringLength === 0) {
      setSearchError("");
    }
    if (searchBy === "-1" && searchStringLength > 0) {
      setSearchError("Please select the search by option");
    } else {
      setSearchError("");
    }
  }, [searchBy, searchStringLength]);

  return (
    <>
      <div className="relative mb-4 flex items-center justify-between gap-2 ">
        <span className="absolute inset-y-0 left-0 pl-3  flex items-center">
          <CiSearch className="text-2xl" />
        </span>
        <input
          type="search"
          name=""
          className={`${
            searchError && "border-red-600 focus:border-red-600"
          } pl-10 w-full py-3 pr-4 rounded-full bg-slate-100  outline-none border-[#d9edd9] hover:border-[#282928] border-2 focus:border-[#9ed49e]`}
          placeholder="Search caregiver"
          id=""
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
          onKeyDown={handleSearch}
        />

        <div className=" flex items-center space-x-2 absolute cursor-pointer  right-0  outline-none">
          <select
            className="appearance-none  hover:bg-slate-100  text-center  outline-none rounded-full bg-white border-[#d9edd9] hover:border-[#848e84] border-2 py-[11px] px-3 "
            id="searchDropdown"
            value={searchBy}
            // style={{ padding: "0px" }}
            onChange={(e) => setSearchBy(e.target.value)}
          >
            <option
              style={{ paddingTop: "10px", paddingBottom: "10px" }}
              value="-1"
              className=""
            >
              Search by
            </option>
            <option
              style={{ paddingTop: "10px", paddingBottom: "10px" }}
              value="preferredCities"
              className=""
            >
              Preferred Cities
            </option>
            <option
              style={{ paddingTop: "10px", paddingBottom: "10px" }}
              value="specialisation"
              className=""
            >
              Specialisation
            </option>
            <option
              style={{ paddingTop: "10px", paddingBottom: "10px" }}
              value="ageRange"
              className=""
            >
              Age range
            </option>
          </select>
          {/* <span>
            <IoIosArrowUp className="rotate-180" />
          </span> */}
        </div>
      </div>
      <div className="h-4">
        <Typography className="text-red-500 text-sm mt-2 ml-4">
          {searchError}
        </Typography>
      </div>
    </>
  );
};

SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
  searchString: PropTypes.string.isRequired,
  setSearchString: PropTypes.func.isRequired,
  searchStringLength: PropTypes.number.isRequired,
  searchBy: PropTypes.string.isRequired,
  setSearchBy: PropTypes.func.isRequired,
};

export default SearchBar;
