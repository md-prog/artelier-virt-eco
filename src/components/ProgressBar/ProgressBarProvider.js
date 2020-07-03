import React, {
    useContext,
    createContext,
    useState,
    useReducer,
    useCallback,
} from "react";
import { insertSorted } from "../../util/array";
import filter from "lodash/filter";

const ProgressBarContext = createContext();

export const { Provider, Consumer } = ProgressBarContext;

export function useProgress() {
    const context = useContext(ProgressBarContext);

    if (!context) {
        throw new Error(
            `useProgress must be used within an ProgressBarProvider`
        );
    }

    return context;
}

const ProgressBarProvider = props => {
    const [offset, setOffset] = useState(0);

    return <Provider value={{ offset, setOffset }} {...props} />;
};

export default ProgressBarProvider;
