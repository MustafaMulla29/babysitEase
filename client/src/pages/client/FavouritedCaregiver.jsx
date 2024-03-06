import { Typography } from "@mui/material";
import Layout from "../../components/Layout";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { openAlert } from "../../redux/features/messageSlice";
import axios from "axios";
import CaregiverCard from "./CaregiverCard";
import CaregiverCardSkeleton from "./CaregiverCardSkeleton";
import NoFavourites from "../../components/NoFavourites";

const FavouritedCaregiver = () => {
  const [favouritedCaregivers, setFavouritedCaregivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    const getFavouritedCaregivers = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:8070/api/v1/user/getFavourites/${params.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setLoading(false);
        if (res.data.success) {
          setFavouritedCaregivers(res.data.data.caregivers);
        }
      } catch (error) {
        setLoading(false);
        console.log(error);
        dispatch(
          openAlert({ severity: "error", content: "Something went wrong!" })
        );
      }
    };
    getFavouritedCaregivers();
  }, []);

  return (
    <Layout>
      <Typography variant="h4">Your favourites</Typography>
      {loading ? (
        <div className="flex flex-wrap justify-start items-center gap-6 mt-5">
          <CaregiverCardSkeleton />
          <CaregiverCardSkeleton />
          <CaregiverCardSkeleton />
          <CaregiverCardSkeleton />
        </div>
      ) : (
        <div className="flex flex-wrap justify-start items-center gap-11 mt-5">
          {favouritedCaregivers?.length > 0 ? (
            favouritedCaregivers.map((caregiver, index) => {
              return (
                <CaregiverCard
                  caregiver={caregiver}
                  key={caregiver._id}
                  index={index}
                />
              );
            })
          ) : (
            <figure className="w-1/3 m-auto">
              <NoFavourites />
              <Typography variant="h5" className="text-center my-2">
                No favourites
              </Typography>
            </figure>
          )}
        </div>
      )}
    </Layout>
  );
};

export default FavouritedCaregiver;
