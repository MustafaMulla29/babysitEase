import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { toast } from "react-toastify";
import axios from "axios";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../redux/features/alertSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Skeleton,
} from "@mui/material";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useNavigate } from "react-router-dom";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10);

  const handleChangePage = (e) => {
    setPage((prev) => prev + 1);
  };
  const navigate = useNavigate();

  const handleViewDetails = (userId) => {
    // Add logic to handle the view details action (e.g., navigate to a user details page)
    console.log(`View details for user with ID: ${userId}`);
  };

  useEffect(() => {
    const getUsers = async () => {
      try {
        // dispatch(showLoading());
        const res = await axios.get(
          "http://localhost:8070/api/v1/admin/getAllUsers",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (res.data.success) {
          setUsers(res.data.data);
        }
        // dispatch(hideLoading());
      } catch (error) {
        console.log(error);
        // dispatch(hideLoading());
        toast.success("Something went wrong", {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    };
    getUsers();
  }, []);
  return (
    <Layout>
      <div>
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
                  <TableRow
                    key={user._id}
                    className="cursor-pointer hover:bg-slate-100 transition-colors"
                    onClick={() => navigate(`/client/${user?._id}`)}
                  >
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.createdAt}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        className="bg-[#f34c39] hover:bg-[#dd5f5f] ml-3"
                      >
                        Block
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            ) : (
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Skeleton animation="wave" width={200} />
                  </TableCell>
                  <TableCell>
                    <Skeleton animation="wave" width={200} />
                  </TableCell>
                  <TableCell>
                    <Skeleton animation="wave" width={200} />
                  </TableCell>
                  <TableCell>
                    <Skeleton animation="wave" width={200} />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Skeleton animation="wave" width={200} />
                  </TableCell>
                  <TableCell>
                    <Skeleton animation="wave" width={200} />
                  </TableCell>
                  <TableCell>
                    <Skeleton animation="wave" width={200} />
                  </TableCell>
                  <TableCell>
                    <Skeleton animation="wave" width={200} />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Skeleton animation="wave" width={200} />
                  </TableCell>
                  <TableCell>
                    <Skeleton animation="wave" width={200} />
                  </TableCell>
                  <TableCell>
                    <Skeleton animation="wave" width={200} />
                  </TableCell>
                  <TableCell>
                    <Skeleton animation="wave" width={200} />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Skeleton animation="wave" width={200} />
                  </TableCell>
                  <TableCell>
                    <Skeleton animation="wave" width={200} />
                  </TableCell>
                  <TableCell>
                    <Skeleton animation="wave" width={200} />
                  </TableCell>
                  <TableCell>
                    <Skeleton animation="wave" width={200} />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Skeleton animation="wave" width={200} />
                  </TableCell>
                  <TableCell>
                    <Skeleton animation="wave" width={200} />
                  </TableCell>
                  <TableCell>
                    <Skeleton animation="wave" width={200} />
                  </TableCell>
                  <TableCell>
                    <Skeleton animation="wave" width={200} />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Skeleton animation="wave" width={200} />
                  </TableCell>
                  <TableCell>
                    <Skeleton animation="wave" width={200} />
                  </TableCell>
                  <TableCell>
                    <Skeleton animation="wave" width={200} />
                  </TableCell>
                  <TableCell>
                    <Skeleton animation="wave" width={200} />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Skeleton animation="wave" width={200} />
                  </TableCell>
                  <TableCell>
                    <Skeleton animation="wave" width={200} />
                  </TableCell>
                  <TableCell>
                    <Skeleton animation="wave" width={200} />
                  </TableCell>
                  <TableCell>
                    <Skeleton animation="wave" width={200} />
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
          </Table>
        </TableContainer>

        <Stack spacing={2}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handleChangePage}
            variant="outlined"
            color="primary"
          />
        </Stack>
      </div>
    </Layout>
  );
};

export default Users;
