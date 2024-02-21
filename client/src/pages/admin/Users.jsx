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
  Typography,
  Tooltip,
  IconButton,
} from "@mui/material";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useNavigate } from "react-router-dom";
import AdminProfile from "./AdminProfile";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../redux/features/alertSlice";
import { TbLockCancel } from "react-icons/tb";
import Zoom from "@mui/material/Zoom";
import UsersSkeleton from "./UsersSkeleton";
import { AiFillLock } from "react-icons/ai";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handleChangePage = (event, value) => {
    setPage(value);
  };
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8070/api/v1/admin/getAllUsers?page=${page}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (res.data.success) {
          setUsers(res.data.data);
          setTotalPages(res.data.totalPages);
        }
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong", {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    };
    getUsers();
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
                    {users && users.length > 0 ? (
                      "Name"
                    ) : (
                      <Skeleton animation="wave" width={100} />
                    )}
                  </TableCell>
                  <TableCell>
                    {users && users.length > 0 ? (
                      "Email"
                    ) : (
                      <Skeleton animation="wave" width={100} />
                    )}
                  </TableCell>
                  <TableCell>
                    {users && users.length > 0 ? (
                      "Created at"
                    ) : (
                      <Skeleton animation="wave" width={100} />
                    )}
                  </TableCell>
                  <TableCell>
                    {users && users.length > 0 ? (
                      "Actions"
                    ) : (
                      <Skeleton animation="wave" width={100} />
                    )}
                  </TableCell>
                </TableRow>
              </TableHead>
              {users && users.length > 0 ? (
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user._id} className="">
                      <TableCell
                        className="cursor-pointer hover:underline hover:underline-offset-4 transition-colors"
                        onClick={() => navigate(`/client/${user?._id}`)}
                      >
                        {user.name}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {!user.isBlocked ? (
                          // <Button
                          //   variant="contained"
                          //   className="bg-[#f34c39] hover:bg-[#dd5f5f] ml-3"
                          //   onClick={() => handleBlockUser(user._id)}
                          // >
                          //   Block
                          // </Button>
                          <Tooltip
                            title="Lock User or Client"
                            TransitionComponent={Zoom}
                            arrow
                          >
                            <IconButton
                              onClick={() => handleBlockUser(user._id)}
                            >
                              <TbLockCancel className="text-2xl text-red-500 cursor-pointer" />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          <Typography className="bg-red-500 text-white flex items-center w-fit py-2 px-3 rounded-full text-sm gap-1">
                            <AiFillLock className="text-sm" />
                            User Blocked
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              ) : (
                <UsersSkeleton />
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

export default Users;
