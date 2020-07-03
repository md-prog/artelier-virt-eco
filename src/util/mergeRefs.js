import React from "react";
const { useCallback } = React;

const setRef = (ref, value) => {
    if (typeof ref === "function") {
        ref(value);
    } else if (ref !== null && typeof ref === "object") {
        ref.current = value;
    }
};

const useMergedRef = (...args) =>
    useCallback(element => {
        if (args.length === 2) {
            setRef(args[0], element);
            setRef(args[1], element);
        } else {
            for (let i = 0; i < args.length; i++) setRef(args[i], element);
        }
    }, args);

export default useMergedRef;
