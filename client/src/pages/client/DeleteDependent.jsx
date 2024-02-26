import axios from "axios";
import { CgTrash } from "react-icons/cg";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../../redux/features/alertSlice";
import { PropTypes } from "prop-types";
import { openAlert } from "../../redux/features/messageSlice";

const DeleteDependent = ({ dependentId }) => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleDependentDelete = async () => {
    try {
      dispatch(showLoading());
      const res = await axios.delete(
        `http://localhost:8070/api/v1/user/deleteDependent/${user?._id}/${dependentId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data.success) {
        dispatch(
          openAlert({
            severity: "success",
            content: res.data.message,
          })
        );
      }
    } catch (error) {
      console.log(error);
      // toast.error("Something went wrong");
      dispatch(
        openAlert({
          severity: "error",
          content: "Something went wrong!",
        })
      );
    } finally {
      dispatch(hideLoading());
    }
  };

  return (
    <div
      className="absolute top-2 right-2 p-2 rounded-full hover:bg-slate-100 transition-all cursor-pointer"
      onClick={handleDependentDelete}
    >
      <CgTrash className="text-lg " />
    </div>
  );
};

DeleteDependent.propTypes = {
  dependentId: PropTypes.string.isRequired,
};

export default DeleteDependent;
