import React from "react";
import { Card, CardContent, Typography, Avatar, Skeleton } from "@mui/material";
import {
  FaUser,
  FaBirthdayCake,
  FaAllergies,
  FaHospitalUser,
} from "react-icons/fa";

const DependentCard = ({ dependent, loading }) => {
  return (
    <>
      {loading ? (
        <Skeleton animation="wave" width={300} height={500} />
      ) : (
        <Card
          className={`max-w-md px-4 py-2 my-4 ${
            !loading && "bg-gradient-to-r from-purple-400 to-pink-500"
          } text-white shadow-lg rounded-md`}
        >
          <CardContent className="text-center">
            <Avatar className="mx-auto bg-white p-2 mb-4">
              <FaUser size={24} color="#8B5CF6" />
            </Avatar>
            <Typography variant="h6" gutterBottom>
              {dependent?.name}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              {dependent?.type} | {dependent?.gender} | {dependent?.age} years
              old
            </Typography>

            {dependent?.allergies && dependent.allergies.length > 0 && (
              <div className="mt-4">
                <Typography variant="h6" gutterBottom>
                  <FaAllergies className="inline mr-2" />
                  Allergies
                </Typography>
                <ul className="list-disc list-inside">
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
                  <Typography variant="h6" gutterBottom>
                    <FaHospitalUser className="inline mr-2" />
                    Medical Conditions
                  </Typography>
                  <ul className="list-disc list-inside">
                    {dependent.medicalConditions.map((medical, index) => (
                      <li key={index} className="mb-1">
                        {medical}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default DependentCard;
