import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import {
  Avatar,
  Button,
  Chip,
  IconButton,
  Skeleton,
  Tooltip,
  Typography,
  Zoom,
} from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "axios";
import DependentInputModal from "./DependentInputModal";
import DependentCard from "./DependentCard";
// import { FaRegEdit } from "react-icons/fa";
import { CiLocationOn } from "react-icons/ci";
import Lottie from "react-lottie";
import block from "./../../lotties/alert.json";
import { FaRegEdit } from "react-icons/fa";
import { IoMdAddCircle } from "react-icons/io";
import UpdateClientProfileModal from "./UpdateClientProfileModal";

const Profile = () => {
  const [client, setClient] = useState(null);
  const params = useParams();
  // eslint-disable-next-line no-unused-vars
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenProfileModal = () => {
    setProfileModalOpen(true);
  };

  const handleCloseProfileModal = () => {
    setProfileModalOpen(false);
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

  const applyOptions = {
    loop: true,
    autoplay: true,
    animationData: block,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <Layout>
      {client?.isBlocked && (
        <div className="py-1 px-1 rounded-lg bg-red-200 border border-black-300 bg-opacity-80  m-auto">
          <div className="h-full w-ful flex items-start gap-10">
            <div className="pointer-events-none">
              <Lottie
                options={applyOptions}
                isClickToPauseDisabled={true}
                width={100}
              />
            </div>
            <div className="max-w-xl">
              <Typography variant="h6" className="text-lg font-semibold">
                Your account has been blocked by the admin. Reasons could be:{" "}
              </Typography>
              <ol className="list-disc pl-5">
                <li className="text-sm">Violation of Community Guidelines</li>
                <li className="text-sm">Inappropriate Behavior</li>
                <li className="text-sm">Spam or Misuse</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto p-4 relative">
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
                {/* <FaRegEdit
                      className="text-base cursor-pointer"
                      onClick={handleOpenProfileModal}
                    /> */}
                <div className="absolute top-12 right-12">
                  <Button
                    onClick={handleOpenProfileModal}
                    className="hover:ring-1 hover:ring-gray-200 bg-slate-300 rounded-lg hover:bg-slate-200 transition-all duration-300  px-2 flex items-center gap-1 font-semibold text-sm text-black "
                  >
                    <FaRegEdit className="text-base cursor-pointer" />
                    <span className="">Edit profile</span>
                  </Button>
                </div>
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
            <Typography
              variant="p"
              className="text-[18px] font-[500] flex items-center gap-3"
            >
              <span>
                {loading ? (
                  <Skeleton
                    animation="wave"
                    variant="text"
                    sx={{ fontSize: "1rem" }}
                    width={100}
                  />
                ) : (
                  "Additional addresses"
                )}
              </span>
            </Typography>
            {client?.additionalAddresses.length === 0 && (
              <div className="flex items-center justify-center w-3/4 m-auto h-16">
                <Typography variant="p" className="text-sm text-center ">
                  You can add other potential addresses of your dependents and
                  You can use these addresses while booking caregiver. Click on
                  update profile icon to add
                </Typography>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {client ? (
                client?.additionalAddresses ? (
                  client?.additionalAddresses?.map((address, index) => (
                    <Chip
                      key={index}
                      label={address}
                      className="text-base bg-[#f2f7f2]"
                    />
                  ))
                ) : (
                  <Chip label={"N/L"} className="text-base bg-[#f2f7f2]" />
                )
              ) : (
                <div className="flex flex-wrap gap-2">
                  <Skeleton
                    animation="wave"
                    width={70}
                    height={40}
                    className="rounded-2xl"
                  />
                  <Skeleton
                    animation="wave"
                    width={70}
                    height={40}
                    className="rounded-2xl"
                  />
                  <Skeleton
                    animation="wave"
                    width={70}
                    height={40}
                    className="rounded-2xl"
                  />
                  <Skeleton
                    animation="wave"
                    width={70}
                    height={40}
                    className="rounded-2xl"
                  />
                </div>
              )}
            </div>
          </div>

          <hr className="mb-8" />

          <div className="mb-8">
            <Typography
              variant="p"
              className="text-[18px] font-[500] flex items-center gap-3"
            >
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
              {client?.dependents.length < 5 && (
                <span>
                  <Tooltip
                    title="Add dependent"
                    TransitionComponent={Zoom}
                    arrow
                    placement="right-start"
                  >
                    <IconButton onClick={handleOpenModal}>
                      <IoMdAddCircle
                        className="text-lg cursor-pointer"
                        onClick={handleOpenModal}
                      />
                    </IconButton>
                  </Tooltip>
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
        <UpdateClientProfileModal
          open={isProfileModalOpen}
          onClose={handleCloseProfileModal}
          client={client}
        />
      </div>
    </Layout>
  );
};

export default Profile;
