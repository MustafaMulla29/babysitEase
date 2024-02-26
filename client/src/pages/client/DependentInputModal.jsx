// UserInputModal.js

import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  FormControlLabel,
  RadioGroup,
  FormLabel,
  FormControl,
  Radio,
  MenuItem,
  Select,
  InputLabel,
  Chip,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { hideLoading, showLoading } from "../../redux/features/alertSlice";
import { PropTypes } from "prop-types";
import { openAlert } from "../../redux/features/messageSlice";

const DependentInputModal = ({ open, onClose, dependent }) => {
  const [dependentData, setDependentData] = useState({
    type: dependent?.type ? dependent.type : "",
    gender: dependent?.gender ? dependent.gender : "",
    name: dependent?.name ? dependent.name : "",
    age: dependent?.age ? dependent.age : "",
    allergies: dependent?.allergies ? dependent.allergies : [],
    medicalConditions: dependent?.medicalConditions
      ? dependent.medicalConditions
      : [],
  });
  const [allergyInput, setAllergyInput] = useState("");
  const [medicalInput, setMedicalInput] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleKeyEnter = (e) => {
    if (e.target.name === "allergies" && e.key === "Enter") {
      e.preventDefault(); // Prevent the default behavior of the Enter key in a text area or input

      // const updatedAllergies = [allergyInput];
      setDependentData((prevData) => ({
        ...prevData,
        allergies: [...prevData.allergies, allergyInput],
      }));
      setAllergyInput("");
    }
    if (e.target.name === "medicalConditions" && e.key === "Enter") {
      e.preventDefault();
      setDependentData((prevData) => ({
        ...prevData,
        medicalConditions: [...prevData.medicalConditions, medicalInput],
      }));
      setMedicalInput("");
    }
  };

  const handleDelete = (index, item) => {
    if (item === "allergy") {
      setDependentData((prevData) => ({
        ...prevData,
        allergies: prevData.allergies.filter((_, i) => i !== index),
      }));
    }
    if (item === "medical") {
      setDependentData((prevData) => ({
        ...prevData,
        medicalConditions: prevData.medicalConditions.filter(
          (_, i) => i !== index
        ),
      }));
    }
  };

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   if (name === "allergies") {
  //     setAllergyInput(value);
  //   } else if (name === "medicalConditions") {
  //     setMedicalInput(value);
  //   } else {
  //     setDependentData((prevData) => ({
  //       ...prevData,
  //       [name]: value,
  //     }));
  //   }

  //   // if (value.length === 0) {
  //   //   toast.warning("Please fill the empty fields", {
  //   //     position: toast.POSITION.TOP_CENTER,
  //   //   });
  //   // }
  // };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Define regular expressions for validation
    const nameRegex = /^[a-zA-Z\s]+$/; // Allows only letters and spaces
    const ageRegex = /^\d+$/; // Allows only digits
    const allergyMedicalRegex = /^[a-zA-Z\s,]+$/; // Allows only letters, spaces, and commas

    // Validation function using regex
    const isValidInput = (regex, input) => regex.test(input);

    // Validate based on the field name
    switch (name) {
      case "name":
        if (value.length === 0) {
          setValidationErrors((prevErrors) => ({
            ...prevErrors,
            [name]: "",
          }));
        } else if (!isValidInput(nameRegex, value)) {
          setValidationErrors((prevErrors) => ({
            ...prevErrors,
            [name]: "Name can only contain letters and spaces.",
          }));
          return;
        } else {
          setValidationErrors((prevErrors) => ({
            ...prevErrors,
            [name]: "",
          }));
        }
        break;

      case "age":
        if (value.length === 0) {
          setValidationErrors((prevErrors) => ({
            ...prevErrors,
            [name]: "",
          }));
        } else if (!isValidInput(ageRegex, value)) {
          setValidationErrors((prevErrors) => ({
            ...prevErrors,
            [name]: "Please enter a valid age.",
          }));
          return;
        } else {
          setValidationErrors((prevErrors) => ({
            ...prevErrors,
            [name]: "",
          }));
        }
        break;

      case "allergies":
      case "medicalConditions":
        if (value.length === 0) {
          setValidationErrors((prevErrors) => ({
            ...prevErrors,
            [name]: "",
          }));
        } else if (!isValidInput(allergyMedicalRegex, value)) {
          setValidationErrors((prevErrors) => ({
            ...prevErrors,
            [name]: "Please enter valid data.",
          }));
          return;
        } else {
          setValidationErrors((prevErrors) => ({
            ...prevErrors,
            [name]: "",
          }));
        }
        break;

      default:
        // No validation for other fields
        break;
    }

    // Update state based on input changes
    if (name === "allergies") {
      setAllergyInput(value);
    } else if (name === "medicalConditions") {
      setMedicalInput(value);
    } else {
      setDependentData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !dependentData.type ||
      !dependentData.gender ||
      !dependentData.name ||
      !dependentData.age
    ) {
      return;
    }

    // Additional validation for specific fields
    if (dependentData.age < 0 || dependentData.age > 100) {
      return;
    }

    try {
      dispatch(showLoading());
      const data = {
        type: dependentData.type,
        gender: dependentData.gender,
        name: dependentData.name,
        age: dependentData.age,
        allergies: dependentData.allergies,
        medicalConditions: dependentData.medicalConditions,
        _id: user?._id,
        edit: dependent ? true : false,
        dependentId: dependent?._id ? dependent._id : "",
      };

      const res = await axios.post(
        "http://localhost:8070/api/v1/user/addDependent",
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data.success) {
        dispatch(
          openAlert({
            severity: "success",
            content: res.data.message,
          })
        );
        onClose();
      }
    } catch (error) {
      console.log(error);
      // toast.error("Something went wrong");
      dispatch(
        openAlert({
          severity: "error",
          content: "Something went wrong!",
        })
      );
    } finally {
      dispatch(hideLoading());
    }
  };

  return (
    <Dialog open={open} onClose={onClose} className="">
      <DialogTitle>Dependent Input</DialogTitle>
      <DialogContent className="">
        <form action="" className="mt-4 space-y-5" onSubmit={handleSubmit}>
          <FormControl variant="filled" fullWidth>
            <InputLabel id="dependent">Dependent type</InputLabel>
            <Select
              labelId="dependent"
              id="dependent"
              label="Dependent type"
              name="type"
              className=""
              value={dependentData.type}
              onChange={handleInputChange}
              required
            >
              <MenuItem value="Parent" className="">
                Parent
              </MenuItem>
              <MenuItem value="Child" className="">
                Child
              </MenuItem>
            </Select>
          </FormControl>

          <div>
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">
                Gender
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
              >
                <FormControlLabel
                  name="gender"
                  // id="gender"
                  className=""
                  value="male"
                  checked={dependentData.gender === "male"}
                  onChange={handleInputChange}
                  required
                  control={<Radio />}
                  label="Male"
                />
                <FormControlLabel
                  name="gender"
                  // id="gender"
                  value="female"
                  className=""
                  checked={dependentData.gender === "female"}
                  onChange={handleInputChange}
                  required
                  control={<Radio />}
                  label="Female"
                />
              </RadioGroup>
            </FormControl>
          </div>

          <TextField
            name="name"
            label="Name"
            value={dependentData.name}
            onChange={handleInputChange}
            fullWidth
            required
            helperText={validationErrors.name || " "}
            error={Boolean(validationErrors.name)}
            variant="filled"
          />

          <TextField
            name="age"
            label="Age"
            value={dependentData.age}
            onChange={handleInputChange}
            type="number"
            required
            helperText={validationErrors.age || " "}
            error={Boolean(validationErrors.age)}
            fullWidth
            variant="filled"
          />

          <TextField
            label="Allergies"
            name="allergies"
            value={allergyInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyEnter}
            variant="filled"
            helperText={validationErrors.allergies || " "}
            error={Boolean(validationErrors.allergies)}
            fullWidth
            className="mb-2"
          />
          <div className="flex items-center justify-start flex-row gap-3">
            {dependentData.allergies &&
              dependentData.allergies.map((allergy, index) => {
                return (
                  <Chip
                    key={index}
                    label={allergy}
                    onDelete={() => handleDelete(index, "allergy")}
                  />
                );
              })}
          </div>
          <TextField
            label="Medical conditions"
            name="medicalConditions"
            value={medicalInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyEnter}
            helperText={validationErrors.medicalConditions || " "}
            error={Boolean(validationErrors.medicalConditions)}
            variant="filled"
            fullWidth
            className="mb-2"
          />
          <div className="flex items-center justify-start flex-row gap-3">
            {dependentData.medicalConditions &&
              dependentData.medicalConditions.map((medical, index) => {
                return (
                  <Chip
                    key={index}
                    label={medical}
                    onDelete={() => handleDelete(index, "medical")}
                  />
                );
              })}
          </div>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className="py-2 px-4 w-full bg-[#1976d2] hover:bg-[#1565c0]"
          >
            Save
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

DependentInputModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  dependent: PropTypes.shape({
    type: PropTypes.string,
    gender: PropTypes.string,
    name: PropTypes.string,
    age: PropTypes.number,
    allergies: PropTypes.arrayOf(PropTypes.string),
    medicalConditions: PropTypes.arrayOf(PropTypes.string),
    _id: PropTypes.string,
  }),
};

export default DependentInputModal;
