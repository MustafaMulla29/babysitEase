import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Avatar, Chip, Typography } from "@mui/material";

const CaregiverDetails = () => {
  const [caregiver, setCaregiver] = useState(null);
  const params = useParams();

  useEffect(() => {
    const getNurseInfo = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8070/api/v1/user/getCaregiverDetails/${params.userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (res.data.success) {
          setCaregiver(res.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getNurseInfo();
  }, [params.userId]);
  return (
    <Layout>
      <div className="container mx-auto p-4">
        <div className="bg-white p-6 rounded-md shadow-md">
          {/* Header Section */}
          <div className="flex items-center gap-4 mb-8">
            <Avatar
              alt="Profile Picture"
              src={`http://localhost:8070/${caregiver?.profilePicture}`}
              sx={{ width: 80, height: 80 }}
            />
            <div>
              <Typography variant="h4" className="mb-2 font-bold">
                {caregiver?.name}
              </Typography>
              <Typography>{caregiver?.address}</Typography>
              <Chip
                label={caregiver?.availability ? "Available" : "Unavailable"}
                color={caregiver?.availability ? "success" : "error"}
              />
              <Typography>
                {caregiver?.rating === 0 ? "" : `Rating: ${caregiver?.rating}`}
              </Typography>
            </div>
          </div>
          {/* Divider */}
          <hr className="mb-8" />

          {/* Description Section */}
          <div className="mb-8">
            <Typography variant="h6">Description</Typography>
            <Typography>{caregiver?.description}</Typography>
          </div>
          <hr className="mb-8" />

          {/* Other Details Section */}
          <div className="mb-8">
            <Typography variant="h6">Other details</Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Typography>
                Lower limit of client: {caregiver?.ageRange?.lowerLimit}
              </Typography>
              <Typography>
                Upper limit of client: {caregiver?.ageRange?.upperLimit}
              </Typography>
              <Typography>Fees per day: {caregiver?.feesPerDay}</Typography>
              <Typography>Gender: {caregiver?.gender}</Typography>
              <Typography>
                Experience: {caregiver?.yearsExperience} years
              </Typography>
            </div>
          </div>
          <hr className="mb-8" />

          {/* Preferred Cities Section */}
          <div className="mb-8">
            <Typography variant="h6">Preferred cities</Typography>
            <div className="flex flex-wrap gap-2">
              {caregiver?.preferredCities?.map((city, index) => (
                <Chip
                  key={index}
                  label={city}
                  className="text-base bg-[#f2f7f2]"
                />
              ))}
            </div>
          </div>
          <hr className="mb-8" />

          {/* Qualification Section */}
          <div className="mb-8">
            <Typography variant="h6">Qualification</Typography>
            <div className="flex flex-wrap gap-2">
              {caregiver?.qualification?.map((qual, index) => (
                <Chip
                  key={index}
                  label={qual}
                  className="text-base bg-[#f2f7f2]"
                />
              ))}
            </div>
          </div>
          <hr className="mb-8" />

          {/* Specialisation Section */}
          <div className="mb-8">
            <Typography variant="h6">Specialisation</Typography>
            <div className="flex flex-wrap gap-2">
              {caregiver?.specialisation?.map((spec, index) => (
                <Chip
                  key={index}
                  label={spec}
                  className="text-base bg-[#f2f7f2]"
                />
              ))}
            </div>
          </div>
          <hr className="mb-8" />
          <div className="mb-8">
            <Typography variant="h6">Certifications</Typography>
            <div className="flex flex-wrap gap-4">
              {caregiver?.certifications?.map((certificate, index) => (
                <Avatar
                  key={index}
                  alt="certificate"
                  src={`http://localhost:8070/${certificate}`}
                  sx={{ width: 80, height: 80 }}
                />
              ))}
            </div>
          </div>
          <hr className="mb-8" />

          {/* Reviews Section */}
          <div>
            <Typography variant="h6">Reviews</Typography>
            <div className="mt-4 space-y-2">
              {caregiver?.review?.map((review, index) => {
                return (
                  <div key={index}>
                    <Typography>{review}</Typography>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CaregiverDetails;
