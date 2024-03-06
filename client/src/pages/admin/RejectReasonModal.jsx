import { useState } from "react";
import { Modal, Fade, TextField, Button, Typography } from "@mui/material";
import { MdOutlineClose } from "react-icons/md";
import { PropTypes } from "prop-types";

const RejectReasonModal = ({ open, handleClose, handleReject }) => {
  const [rejectionReason, setRejectionReason] = useState("");

  const handleRejectClick = () => {
    // Call the function to handle rejection and pass the reason
    handleReject(rejectionReason);
    // Reset the rejection reason
    setRejectionReason("");
  };

  return (
    <Modal open={open} onClose={handleClose} closeAfterTransition>
      <Fade in={open}>
        <div className="bg-white p-5 rounded-md w-96 mx-auto mt-20">
          <div className="flex justify-end">
            <MdOutlineClose
              className="text-xl cursor-pointer"
              onClick={handleClose}
            />
          </div>
          <Typography variant="h5" className="mb-4">
            Provide Reason for Rejection
          </Typography>
          <TextField
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            placeholder="Enter reason here..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            className="mb-4"
          />
          <div className="flex justify-end">
            <Button
              variant="contained"
              color="error"
              className="w-full bg-[#d32f2f] hover:bg-[#c62828]"
              onClick={handleRejectClick}
            >
              Reject
            </Button>
          </div>
        </div>
      </Fade>
    </Modal>
  );
};

RejectReasonModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleReject: PropTypes.func.isRequired,
};

export default RejectReasonModal;
