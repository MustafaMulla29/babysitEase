import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { Avatar, Skeleton, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "axios";
import DependentInputModal from "./DependentInputModal";
import DependentCard from "./DependentCard";
import { MdOutlineAddCircleOutline } from "react-icons/md";
// import { FaRegEdit } from "react-icons/fa";
import { CiLocationOn } from "react-icons/ci";

const Profile = () => {
  const [client, setClient] = useState(null);
  const params = useParams();
  // eslint-disable-next-line no-unused-vars
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // const handleEditClick = () => {
  //   setEditModalOpen(true);
  // };

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
      {client?.isBlocked && (
        <div className="py-5 px-8 rounded-lg bg-[#FCE8E6]">
          <div className="h-full w-ful flex items-start gap-10">
            <img
              src="./../../../img/blocked.png"
              alt="account_blocked"
              className="w-24"
            />
            <div className="max-w-lg">
              <Typography variant="h6" className="text-lg font-semibold">
                Your account has been blocked by the admin. Reasons could be:{" "}
              </Typography>
              <ol className="list-disc pl-5">
                <li>Violation of Community Guidelines</li>
                <li>Inappropriate Behavior</li>
                <li>Spam or Misuse</li>
              </ol>
            </div>
          </div>
        </div>
      )}
      <div className="container mx-auto p-4 ">
        <div className="bg-white p-6 rounded-md shadow-md">
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
                src={
                  client?.profilePicture
                    ? `http://localhost:8070/${client.profilePicture}`
                    : "./../../img/default_avatar.jpg"
                }
                sx={{ width: 80, height: 80 }}
              />
            )}

            <div>
              <Typography
                variant="h4"
                className="mb-2 font-bold flex items-center gap-5"
              >
                {loading ? (
                  <Skeleton
                    animation="wave"
                    width={100}
                    variant="text"
                    sx={{ fontSize: "2rem" }}
                  />
                ) : (
                  client?.name
                )}
                {/* <div className="items-start ml-3">
                  {loading ? (
                    <Skeleton
                      animation="wave"
                      variant="circular"
                      width={20}
                      height={20}
                    />
                  ) : (
                    <FaRegEdit
                      className="text-base cursor-pointer"
                      onClick={handleEditClick}
                    />
                  )}
                </div> */}
              </Typography>
              <Typography variant="p">
                {loading ? (
                  <Skeleton
                    animation="wave"
                    variant="text"
                    sx={{ fontSize: "1rem" }}
                    width={200}
                  />
                ) : (
                  <span className="flex items-center gap-1">
                    <CiLocationOn />
                    {client?.address}
                  </span>
                )}
              </Typography>
              <Typography variant="p">
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
          </div>
          <hr className="mb-8" />

          {/* Other Details Section */}
          {/* <div className="mb-8">
            <div className="">
              <Typography variant="p">
                {loading ? (
                  <Skeleton
                    animation="wave"
                    variant="text"
                    width={100}
                    sx={{ fontSize: "1rem" }}
                  />
                ) : (
                  `Gender: ${client?.gender}`
                )}
              </Typography>
            </div>
          </div>
          <hr className="mb-8" /> */}

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
                  <MdOutlineAddCircleOutline
                    className="text-lg cursor-pointer"
                    onClick={handleOpenModal}
                  />
                </span>
              )}
            </Typography>

            {client?.dependents?.length === 0 ? (
              <div className="flex items-center justify-center flex-col w-1/2 m-auto">
                <img
                  src="./../../../img/no_dependents.png"
                  className="w-full h-full"
                  alt=""
                />
                <Typography variant="h6">
                  No dependents. Add by clicking + icon above
                </Typography>
              </div>
            ) : (
              <div className="flex flex-wrap gap-11">
                {client?.dependents?.map((dependent, index) => (
                  <DependentCard
                    dependent={dependent}
                    key={index}
                    loading={loading}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <DependentInputModal open={isModalOpen} onClose={handleCloseModal} />
      </div>
    </Layout>
  );
};

export default Profile;
