import React, { useContext, createContext, useReducer, useCallback } from "react";
import { insertSorted } from "../../util/array";
import filter from "lodash/filter";
import findIndex from "lodash/findIndex";

const SidebarContext = createContext();

export const { Provider, Consumer } = SidebarContext;

export function useSidebar() {
    const context = useContext(SidebarContext);

    if (!context) {
        throw new Error(`useSidebar must be used within an SidebarProvider`);
    }

    return context;
}

const sidebarReducer = (state, { type, payload: { id, position, title, content, atTop, visible = false } }) => {
    switch (type) {
        case "add":
            let withOut = filter(state, item => item.id !== id);
            return insertSorted(withOut, { id, position, title, content, atTop, visible }, a => a.position.top);
        case "visible":
            let itemKey = findIndex(state, x => x.id === id);
            let tmpArray = [...state];
            tmpArray[itemKey] = { ...state[itemKey], visible: visible };
            return tmpArray;
        default:
            return state;
    }
};

const SidebarProvider = props => {
    const [sidebarItems, sidebarDispatch] = useReducer(sidebarReducer, []);

    const addSidebarItem = useCallback((id, type, position, atTop, title, content) => {
        sidebarDispatch({ type: "add", payload: { id, position, title, content, atTop } });
    }, []);
    const setVisible = useCallback((id, visible) => {
        sidebarDispatch({ type: "visible", payload: { id, visible } });
    }, []);

    return <Provider value={{ sidebarItems, addSidebarItem, setVisible }} {...props} />;
};

export default SidebarProvider;
