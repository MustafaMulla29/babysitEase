import { MenuItem, Select, Typography } from "@mui/material";
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
    if (searchStringLength === 0) setSearchError("");
    else if (searchBy === "-1")
      setSearchError("Please select the search by option");
  }, [searchBy, searchStringLength]);

  return (
    <>
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
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
          onKeyDown={handleSearch}
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
      <div className="h-4">
        <Typography className="text-red-500 text-sm mt-3 ml-4">
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
