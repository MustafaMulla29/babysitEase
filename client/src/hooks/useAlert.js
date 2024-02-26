// useAlert.js
import { useState } from "react";

const useAlert = () => {
    const [isOpen, setIsOpen] = useState(false);

    const openAlert = () => {
        setIsOpen(true);
    };

    const closeAlert = () => {
        setIsOpen(false);
    };


    return { openAlert, closeAlert, isOpen };
};

export default useAlert;
