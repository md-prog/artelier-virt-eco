import React, {
    useContext,
    createContext,
    useState,
    useReducer,
    useCallback,
} from "react";
import { insertSorted } from "../../util/array";
import filter from "lodash/filter";

const SectionContext = createContext();

export const { Provider, Consumer } = SectionContext;

export function useSection() {
    const context = useContext(SectionContext);

    if (!context) {
        throw new Error(`useSection must be used within an SectionProvider`);
    }

    return context;
}

const pointReducer = (
    state,
    { type, payload: { label, position, oldPosition } }
) => {
    let arr =
        oldPosition !== null
            ? filter(
                  state,
                  item => item.label !== label && item.position !== position
              )
            : state;
    return insertSorted(arr, { label, position }, a => a.position);
};

const subSectionReducer = (
    state,
    {
        type,
        payload: {
            title,
            start,
            end,
            oldPosition = null,
            white = false,
            label = "",
        },
    }
) => {
    let arr =
        oldPosition !== null
            ? filter(state, item => item.start !== oldPosition)
            : state;

    let sorted = insertSorted(
        arr,
        { title, start, end, white, label },
        a => a.start
    );
    return sorted;
};

const SectionProvider = props => {
    const [section, setSection] = useState(null);
    const [points, pointsDispatch] = useReducer(pointReducer, []);
    const [subSections, subSectionDispatch] = useReducer(subSectionReducer, []);

    const addPoint = useCallback((label, position, oldPosition = null) => {
        pointsDispatch({ payload: { label, position, oldPosition } });
    }, []);

    const setSectionData = useCallback((index, startPosition, endPosition) => {
        setSection({ index, startPosition, endPosition });
    }, []);

    return (
        <Provider
            value={{
                section,
                points,
                addPoint,
                setSection: setSectionData,
                subSections,
                subSectionDispatch,
            }}
            {...props}
        />
    );
};

export default SectionProvider;
