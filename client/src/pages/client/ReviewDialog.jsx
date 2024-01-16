// ReviewDialog.jsx

import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Rating,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import { toast } from "react-toastify";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { useParams } from "react-router-dom";
import { hideLoading, showLoading } from "../../redux/features/alertSlice";

const ReviewDialog = ({ open, onClose }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [feedback, setFeedback] = useState("");

  const params = useParams();
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleRatingChange = (event, newValue) => {
    setRating(newValue);
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const currentDate = new Date();

      dispatch(showLoading());
      const date = moment(currentDate).format("YYYY-MM-DD");
      const reviewData = {
        clientId: user?._id,
        caregiverId: params.userId,
        date,
        rating,
        comment,
        feedback,
      };
      const res = await axios.post(
        "http://localhost:8070/api/v1/user/addReview",
        reviewData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        toast.success(res.data.message, {
          position: toast.POSITION.TOP_CENTER,
        });
        handleClose();
        window.location.reload();
      }
    } catch (error) {
      dispatch(hideLoading());
      if (error.response && error.response.status === 403) {
        toast.info(error.response.data.message, {
          position: toast.POSITION.TOP_CENTER,
        });
      } else {
        console.log(error);
        toast.error("Something went wrong", {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    } finally {
      dispatch(hideLoading());
      handleClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Write a Review</DialogTitle>
      <DialogContent>
        {/* Rating Component */}
        <Rating
          name="rating"
          value={rating}
          precision={1}
          onChange={handleRatingChange}
          size="large"
        />

        {/* Comment Select */}
        <FormControl fullWidth variant="filled" style={{ marginTop: "16px" }}>
          <InputLabel id="comment-label">Comment</InputLabel>
          <Select
            labelId="comment-label"
            label="Select Option"
            value={comment}
            onChange={handleCommentChange}
            required
          >
            <MenuItem value="excellent">Excellent</MenuItem>
            <MenuItem value="satisfactory">Satisfactory</MenuItem>
            <MenuItem value="good">Good</MenuItem>
            <MenuItem value="poor">Poor</MenuItem>
            <MenuItem value="unsatisfactory">Unsatisfactory</MenuItem>
          </Select>
        </FormControl>

        {/* Feedback Textarea */}
        <TextField
          required
          multiline
          rows={5}
          variant="filled"
          label="Feedback"
          fullWidth
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          style={{ marginTop: "16px" }}
        />
      </DialogContent>

      {/* Dialog Actions */}
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReviewDialog;
