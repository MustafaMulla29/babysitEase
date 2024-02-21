import { Card, CardContent, Typography, Avatar, Skeleton } from "@mui/material";
import { FaUser, FaAllergies, FaHospitalUser } from "react-icons/fa";
import { PropTypes } from "prop-types";
import { useState } from "react";
import DependentInputModal from "./DependentInputModal";
import DeleteDependent from "./DeleteDependent";
import { FaRegEdit } from "react-icons/fa";

const DependentCard = ({ dependent, loading }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Card className="max-w-md relative my-4 shadow-lg rounded-md">
      <CardContent className="text-center mt-6">
        {loading ? (
          <Skeleton
            variant="circular"
            width={80}
            height={80}
            className="mx-auto my-4"
          />
        ) : (
          <Avatar className="m-auto bg-blue-500 p-2 mb-4">
            <FaUser size={24} color="#fff" />
          </Avatar>
        )}
        <Typography variant="h6" gutterBottom>
          {dependent?.name}
        </Typography>
        <Typography variant="subtitle1" gutterBottom className="text-gray-500">
          {dependent?.type} | {dependent?.gender} | {dependent?.age} years old
        </Typography>

        {dependent?.allergies && dependent.allergies.length > 0 && (
          <div className="mt-4">
            <Typography
              variant="subtitle1"
              gutterBottom
              className="text-blue-500 text-left"
            >
              <FaAllergies className="inline mr-2" />
              Allergies
            </Typography>
            <ul className="list-disc list-inside text-left pl-4">
              {dependent.allergies.map((allergy, index) => (
                <li key={index} className="mb-1">
                  {allergy}
                </li>
              ))}
            </ul>
          </div>
        )}

        {dependent?.medicalConditions &&
          dependent.medicalConditions.length > 0 && (
            <div className="mt-4">
              <Typography
                variant="subtitle1"
                gutterBottom
                className="text-red-500"
              >
                <FaHospitalUser className="inline mr-2" />
                Medical Conditions
              </Typography>
              <ul className="list-disc list-inside text-left pl-4">
                {dependent.medicalConditions.map((medical, index) => (
                  <li key={index} className="mb-1">
                    {medical}
                  </li>
                ))}
              </ul>
            </div>
          )}
        <div
          className="absolute top-2 right-12 p-2 rounded-full hover:bg-slate-100 transition-all cursor-pointer"
          onClick={handleOpenModal}
        >
          <FaRegEdit className="text-lg " />
        </div>
        <DeleteDependent dependentId={dependent?._id} />
        <DependentInputModal
          open={isModalOpen}
          onClose={handleCloseModal}
          dependent={dependent}
        />
      </CardContent>
    </Card>
  );
};

DependentCard.propTypes = {
  dependent: PropTypes.shape({
    name: PropTypes.string,
    type: PropTypes.string,
    gender: PropTypes.string,
    age: PropTypes.number,
    allergies: PropTypes.arrayOf(PropTypes.string),
    medicalConditions: PropTypes.arrayOf(PropTypes.string),
    _id: PropTypes.string,
  }),
  loading: PropTypes.bool.isRequired,
};

export default DependentCard;
