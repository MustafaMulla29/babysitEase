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
  Skeleton,
  Stack,
  Pagination,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Caregivers = () => {
  const [caregivers, setCaregivers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

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
  return (
    <Layout>
      <div>
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
                  <TableRow
                    key={user._id}
                    className="cursor-pointer hover:bg-slate-100 transition-colors"
                    onClick={() => navigate(`/caregiver/${user?.userId}`)}
                  >
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.createdAt}</TableCell>
                    <TableCell className="flex items-center justify-start">
                      {user.status && user.status === "Pending" ? (
                        <div>
                          <Button
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
                            Block
                          </Button>
                        )
                      )}
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

export default Caregivers;
