import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { AiFillEdit } from "react-icons/ai";
import { Avatar, Skeleton, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "axios";
import DependentInputModal from "./DependentInputModal";
import DependentCard from "./DependentCard";
import { FaPen, FaS } from "react-icons/fa6";

const Profile = () => {
  const [client, setClient] = useState(null);
  const params = useParams();
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleEditClick = () => {
    setEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const getNurseInfo = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:8070/api/v1/caregiver/getCaregiverInfo/${params.id}`,
          // { userId: params.id },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (res.data.success) {
          setClient(res.data.data);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    getNurseInfo();
  }, [params.id]);
  return (
    <Layout>
      <div className="container mx-auto p-4">
        <div className="bg-white p-6 rounded-md shadow-md">
          {/* Header Section */}
          <div className="flex items-center gap-4 mb-8">
            {loading ? (
              <Skeleton
                variant="circular"
                width={80}
                height={80}
                animation="wave"
              />
            ) : (
              <Avatar
                alt="Profile Picture"
                src={`http://localhost:8070/${client?.profilePicture}`}
                sx={{ width: 80, height: 80 }}
              />
            )}

            <div>
              <Typography variant="h4" className="mb-2 font-bold">
                {loading ? (
                  <Skeleton
                    animation="wave"
                    variant="text"
                    sx={{ fontSize: "2rem" }}
                  />
                ) : (
                  client?.name
                )}
              </Typography>
              <Typography>
                {loading ? (
                  <Skeleton
                    animation="wave"
                    variant="text"
                    sx={{ fontSize: "1rem" }}
                    width={200}
                  />
                ) : (
                  client?.address
                )}
              </Typography>
              <Typography>
                {loading ? (
                  <Skeleton
                    animation="wave"
                    variant="text"
                    sx={{ fontSize: "1rem" }}
                    width={80}
                  />
                ) : (
                  client?.city
                )}
              </Typography>
            </div>
            <div className="items-start">
              {loading ? (
                <Skeleton animation="wave" width={40} />
              ) : (
                <FaPen
                  className="text-base cursor-pointer"
                  onClick={handleEditClick}
                />
              )}
            </div>
          </div>
          {/* Divider */}
          <hr className="mb-8" />

          {/* Other Details Section */}
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Typography>
                {loading ? (
                  <Skeleton
                    animation="wave"
                    variant="text"
                    sx={{ fontSize: "1rem" }}
                  />
                ) : (
                  `Gender: ${client?.gender}`
                )}
              </Typography>
            </div>
          </div>
          <hr className="mb-8" />

          <div className="mb-8">
            <Typography variant="h6" className="flex items-center gap-3">
              <span>
                {loading ? (
                  <Skeleton
                    animation="wave"
                    variant="text"
                    sx={{ fontSize: "1rem" }}
                    width={100}
                  />
                ) : (
                  "Dependents"
                )}
              </span>
              {client?.dependents.length < 2 && (
                <span>
                  <FaPen
                    className="text-base cursor-pointer"
                    onClick={handleOpenModal}
                  />
                </span>
              )}
            </Typography>

            <div className="flex flex-wrap gap-7">
              {client?.dependents?.map((dependent, index) => (
                <DependentCard
                  dependent={dependent}
                  key={index}
                  loading={loading}
                />
              ))}
            </div>
          </div>
        </div>
        <DependentInputModal open={isModalOpen} onClose={handleCloseModal} />
      </div>
    </Layout>
  );
};

export default Profile;
