import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { toast } from "react-toastify";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Skeleton,
  Stack,
  Pagination,
  Tooltip,
  IconButton,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AdminProfile from "./AdminProfile";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../redux/features/alertSlice";
import { AiFillCheckCircle, AiFillCloseCircle } from "react-icons/ai";
import Zoom from "@mui/material/Zoom";
import { TbLockCancel } from "react-icons/tb";
import CaregiversSkeleton from "./CaregiversSkeleton";
import { FaRegClock } from "react-icons/fa";

const Caregivers = () => {
  const [caregivers, setCaregivers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleAccountStatus = async (record, status) => {
    try {
      const res = await axios.post(
        "http://localhost:8070/api/v1/admin/changeAccountStatus",
        { caregiverId: record._id, userId: record.userId, status: status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        toast.success(res.data.message, {
          position: toast.POSITION.TOP_CENTER,
        });
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  useEffect(() => {
    const getCaregivers = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8070/api/v1/admin/getAllCaregivers?page=${page}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (res.data.success) {
          setCaregivers(res.data.data);
          setTotalPages(res.data.totalPages);
        }
      } catch (error) {
        console.log(error);
        toast.success("Something went wrong", {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    };
    getCaregivers();
  }, [page]);

  const handleBlockUser = async (userId) => {
    try {
      dispatch(showLoading());
      const res = await axios.patch(
        `http://localhost:8070/api/v1/admin/blockUser/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        dispatch(hideLoading());
        toast.success(res.data.message, {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      toast.error("Something went wrong");
    }
  };
  return (
    <Layout>
      <div className="flex items-start gap-4 justify-between">
        <AdminProfile />
        <div className="w-full">
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    {caregivers && caregivers.length > 0 ? (
                      "Name"
                    ) : (
                      <Skeleton animation="wave" width={100} />
                    )}
                  </TableCell>
                  <TableCell>
                    {caregivers && caregivers.length > 0 ? (
                      "Email"
                    ) : (
                      <Skeleton animation="wave" width={100} />
                    )}
                  </TableCell>
                  <TableCell>
                    {caregivers && caregivers.length > 0 ? (
                      "Created at"
                    ) : (
                      <Skeleton animation="wave" width={100} />
                    )}
                  </TableCell>
                  <TableCell>
                    {caregivers && caregivers.length > 0 ? (
                      "Status"
                    ) : (
                      <Skeleton animation="wave" width={100} />
                    )}
                  </TableCell>
                  <TableCell>
                    {caregivers && caregivers.length > 0 ? (
                      "Actions"
                    ) : (
                      <Skeleton animation="wave" width={100} />
                    )}
                  </TableCell>
                </TableRow>
              </TableHead>
              {caregivers && caregivers.length > 0 ? (
                <TableBody>
                  {caregivers.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell
                        className="cursor-pointer hover:underline hover:underline-offset-4 transition-colors"
                        onClick={() => navigate(`/caregiver/${user?.userId}`)}
                      >
                        {user.name}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Typography
                          className={`${
                            user.status === "Pending"
                              ? "bg-orange-400"
                              : user.status === "Approved"
                              ? "bg-green-500"
                              : !user.status
                              ? "bg-blue-500"
                              : "bg-red-500"
                          } flex items-center gap-1 py-2 px-3 rounded-full w-fit text-sm text-white`}
                        >
                          {!user.status ? (
                            "Not Applied"
                          ) : user.status === "Pending" ? (
                            <FaRegClock className="text-sm" />
                          ) : user.status === "Approved" ? (
                            <AiFillCheckCircle className="text-sm" />
                          ) : (
                            <AiFillCloseCircle className="text-sm" />
                          )}
                          {user.status}
                        </Typography>
                      </TableCell>
                      <TableCell className="flex items-center justify-start">
                        {user.status && user.status === "Pending" ? (
                          <div className="space-x-3">
                            {/* <Button
                              variant="contained"
                              className="bg-[#1976d2] hover:bg-[#1565c0] ml-3"
                              onClick={() =>
                                handleAccountStatus(user, "Approved")
                              }
                            >
                              Approve
                            </Button>
                            <Button
                              variant="contained"
                              className="bg-[#f34c39] hover:bg-[#dd5f5f] ml-3"
                              onClick={() =>
                                handleAccountStatus(user, "Rejected")
                              }
                            >
                              Reject
                            </Button> */}
                            <Tooltip
                              title="Approve"
                              TransitionComponent={Zoom}
                              arrow
                            >
                              <IconButton
                                onClick={() =>
                                  handleAccountStatus(user, "Approved")
                                }
                              >
                                <AiFillCheckCircle className="text-3xl text-green-500 cursor-pointer" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip
                              title="Reject"
                              TransitionComponent={Zoom}
                              arrow
                            >
                              <IconButton
                                onClick={() =>
                                  handleAccountStatus(user, "Rejected")
                                }
                              >
                                <AiFillCloseCircle className="text-3xl text-red-500 cursor-pointer" />
                              </IconButton>
                            </Tooltip>
                          </div>
                        ) : (
                          user.status &&
                          user.status === "Approved" && (
                            // <Button
                            //   variant="contained"
                            //   className="bg-[#f34c39] hover:bg-[#dd5f5f] ml-3"
                            //   onClick={() => handleBlockUser(user._id)}
                            // >
                            //   Block
                            // </Button>
                            <Tooltip
                              title="Lock Caregiver"
                              TransitionComponent={Zoom}
                              arrow
                            >
                              <IconButton
                                onClick={() => handleBlockUser(user._id)}
                              >
                                <TbLockCancel className="text-2xl text-red-500 cursor-pointer" />
                              </IconButton>
                            </Tooltip>
                          )
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              ) : (
                <CaregiversSkeleton />
              )}
            </Table>
          </TableContainer>
          <Stack spacing={2} className="items-center justify-center mt-5">
            <Pagination
              count={totalPages}
              page={page}
              onChange={handleChangePage}
              variant="outlined"
              color="primary"
            />
          </Stack>
        </div>
      </div>
    </Layout>
  );
};

export default Caregivers;
