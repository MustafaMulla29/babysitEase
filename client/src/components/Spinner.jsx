import HashLoader from "react-spinners/HashLoader";

const Spinner = () => {
  return (
    <div className="flex items-center justify-center h-[100vh] w-[100%] bg-slate-300 relative z-[9999999]">
      <HashLoader loading={true} color="#343998" />
      {/* <video
        src="./../../img/Untitled design (1).mp4"
        autoPlay
        width={300}
        height={300}
        loop
        muted
      ></video> */}
    </div>
  );
};

export default Spinner;
