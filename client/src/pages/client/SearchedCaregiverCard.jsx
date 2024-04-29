import { Avatar, Chip, Rating, Typography } from "@mui/material";
import { IoIosArrowUp } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import React from "react";
import { CiLocationOn } from "react-icons/ci";
// import { LiaRupeeSignSolid } from "react-icons/lia";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { PropTypes } from "prop-types";

const SearchedCaregiverCard = React.memo(({ caregiver, searchBy }) => {
  const {
    user: { name, city, profilePicture },
    rating,
    feesPerDay,
    userId,
    preferredCities,
    specialisation,
  } = caregiver;
  const navigate = useNavigate();

  return (
    <>
      <div
        className=" w-full relative flex flex-row items-center rounded-lg overflow-hidden transition hover:bg-slate-100 cursor-pointer py-1 px-1 group"
        onClick={() => navigate(`/caregiver/${userId}`)}
      >
        <div className="flex items-center">
          <Avatar
            className="object-cover"
            alt={name}
            src={`http://localhost:8070/${profilePicture}`}
            sx={{ width: 70, height: 70 }}
          />
          <div className="ml-2">
            <div className="space-y-[6px]">
              <Typography
                variant="h6"
                component="div"
                className="font-semibold  text-xl "
              >
                {name?.charAt(0).toUpperCase()}
                {name?.slice(1, name.length)}
              </Typography>
              {/* <Typography
                variant="span"
                className=" flex items-center gap-1 text-gray-600"
              >
                <span>
                  <CiLocationOn />
                </span>{" "}
                <span>{city}</span>
              </Typography> */}
              <div className="flex items-center gap-2 ">
                {searchBy === "preferredCities" &&
                  preferredCities?.map((city, index) => {
                    return (
                      <Chip
                        key={index}
                        label={city}
                        className="text-sm bg-slate-200 rounded-lg"
                      />
                    );
                  })}
                {searchBy === "specialisation" &&
                  specialisation?.map((city, index) => {
                    return (
                      <Chip
                        key={index}
                        label={city}
                        className="text-sm bg-slate-200 rounded-lg"
                      />
                    );
                  })}
              </div>
            </div>
            <div className="flex items-center gap-1 mt-1">
              {rating !== 0 && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  className=" flex items-center gap-2 mr-1"
                >
                  {/* <AiFillStar className="text-blue-500 text-lg" /> */}
                  <Rating
                    name="read-only"
                    value={rating}
                    readOnly
                    precision={0.5}
                  />
                </Typography>
              )}
              <Typography variant="span" color="text.secondary" className="">
                <span className="flex items-center">
                  &#40;
                  <FaIndianRupeeSign />
                  {feesPerDay}/day&#41;
                </span>
              </Typography>
              <span></span>
            </div>
          </div>
          <Typography
            variant="span"
            className="cursor-pointer absolute right-4 p-2 hover:bg-slate-100 rounded-full group-hover:translate-x-2 transition-[transform]"
            onClick={() => navigate(`/caregiver/${userId}`)}
          >
            <IoIosArrowUp className="text-2xl rotate-90 " />
          </Typography>
        </div>
      </div>
    </>
  );
});

SearchedCaregiverCard.displayName = "SearchedCaregiverCard";

SearchedCaregiverCard.propTypes = {
  caregiver: PropTypes.shape({
    user: PropTypes.shape({
      name: PropTypes.string.isRequired,
      city: PropTypes.string.isRequired,
      profilePicture: PropTypes.string.isRequired,
    }).isRequired,
    userId: PropTypes.string.isRequired,
    feesPerDay: PropTypes.number.isRequired,
    rating: PropTypes.number.isRequired,
    preferredCities: PropTypes.array,
    specialisation: PropTypes.array,
  }).isRequired,
  searchBy: PropTypes.string.isRequired,
};

export default SearchedCaregiverCard;
