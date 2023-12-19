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
  Button,
} from "@mui/material";

const Caregivers = () => {
  const [caregivers, setCaregivers] = useState([]);

  const handleViewDetails = (userId) => {
    // Add logic to handle the view details action (e.g., navigate to a user details page)
    console.log(`View details for user with ID: ${userId}`);
  };

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
      toast.error("Something went wrong", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

  useEffect(() => {
    const getCaregivers = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8070/api/v1/admin/getAllCaregivers",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (res.data.success) {
          setCaregivers(res.data.data);
        }
      } catch (error) {
        console.log(error);
        toast.success("Something went wrong", {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    };
    getCaregivers();
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
              {caregivers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.createdAt}</TableCell>
                  <TableCell className="flex items-center justify-start">
                    <Button
                      variant="outlined"
                      onClick={() => handleViewDetails(user.id)}
                      className=" text-black  rounded"
                    >
                      View Details
                    </Button>
                    {user.status && user.status === "Pending" ? (
                      <div>
                        <Button
                          variant="contained"
                          className="bg-[#1976d2] hover:bg-[#1565c0] ml-3"
                          onClick={() => handleAccountStatus(user, "Approved")}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="contained"
                          className="bg-[#f34c39] hover:bg-[#dd5f5f] ml-3"
                        >
                          Reject
                        </Button>
                      </div>
                    ) : (
                      //TODO: HAVE TO CREATE REJECT BUTTON AND SHOW
                      user.status &&
                      user.status === "Approved" && (
                        <Button
                          variant="contained"
                          className="bg-[#f34c39] hover:bg-[#dd5f5f] ml-3"
                        >
                          Reject
                        </Button>
                      )
                    )}
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

export default Caregivers;
