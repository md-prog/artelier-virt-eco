import React, { createContext, useContext, useState } from "react";

const ResizerContext = createContext();

export const { Provider, Consumer } = ResizerContext;

export function useResizer() {
    const context = useContext(ResizerContext);

    return context;
}

export const Resizer = props => {
    const [area, setArea] = useState(1);

    return <Provider value={{ area, setArea }} {...props} />;
};

export default Resizer;
