import React from "react";
import { Card, CardContent, Typography, Avatar, Skeleton } from "@mui/material";
import { FaUser, FaAllergies, FaHospitalUser } from "react-icons/fa";

const DependentCard = ({ dependent, loading }) => {
  return (
    <Card className="max-w-md mx-auto my-4 shadow-lg rounded-md">
      <CardContent className="text-center">
        {loading ? (
          <Skeleton
            variant="circular"
            width={80}
            height={80}
            className="mx-auto my-4"
          />
        ) : (
          <Avatar className="mx-auto bg-blue-500 p-2 mb-4">
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
              className="text-blue-500"
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
      </CardContent>
    </Card>
  );
};

export default DependentCard;
