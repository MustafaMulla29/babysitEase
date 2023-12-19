import React from "react";
import HashLoader from "react-spinners/HashLoader";

const Spinner = () => {
  return (
    <div className="flex items-center justify-center h-[100vh] w-[100%] bg-slate-300 relative z-[9999999]">
      <HashLoader loading={true} color="#343998" />
    </div>
  );
};

export default Spinner;
