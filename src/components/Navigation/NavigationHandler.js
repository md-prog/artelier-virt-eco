import React, { useState } from "react";
import NavBar from "./NavBar";
import Menu from "./Menu";

const NavigationHandler = () => {
    const [state, setState] = useState("closed");
    return (
        <>
            <NavBar state={state} setState={setState} />
            <Menu state={state} setState={setState} />
        </>
    );
};

export default NavigationHandler;
