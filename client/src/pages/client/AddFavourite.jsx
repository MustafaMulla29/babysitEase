import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import { Tooltip, IconButton, Zoom } from "@mui/material";
import axios from "axios";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../redux/features/alertSlice";
import { openAlert } from "../../redux/features/messageSlice";
import { PropTypes } from "prop-types";

const AddFavourite = ({ clientId, isFavourited, caregiverId }) => {
  const dispatch = useDispatch();

  const addFavourite = async () => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        `http://localhost:8070/api/v1/user/addFavourite`,
        {
          clientId: clientId,
          caregiverId: caregiverId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        dispatch(openAlert({ severity: "success", content: res.data.message }));
      } else {
        dispatch(openAlert({ severity: "error", content: res.data.message }));
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      dispatch(
        openAlert({ severity: "error", content: "Something went wrong" })
      );
    }
  };

  return (
    <>
      <div className="absolute top-2 right-2 ">
        <Tooltip
          title={!isFavourited ? "Add to favourites" : "Remove from favourites"}
          TransitionComponent={Zoom}
          arrow
        >
          <IconButton onClick={addFavourite}>
            {isFavourited ? (
              <IoMdHeart className="text-3xl text-red-600" />
            ) : (
              <IoMdHeartEmpty className="text-3xl text-gray-700" />
            )}
          </IconButton>
        </Tooltip>
      </div>
    </>
  );
};

AddFavourite.propTypes = {
  caregiverId: PropTypes.string.isRequired,
  clientId: PropTypes.string.isRequired,
  isFavourited: PropTypes.bool.isRequired,
};

export default AddFavourite;
