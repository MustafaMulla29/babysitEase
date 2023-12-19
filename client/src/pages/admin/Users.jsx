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
} from "@mui/material";

const Users = () => {
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch();

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
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Created at</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.createdAt}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      onClick={() => handleViewDetails(user.id)}
                      className=" text-black  rounded"
                    >
                      View Details
                    </Button>
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
          </Table>
        </TableContainer>
      </div>
    </Layout>
  );
};

export default Users;
