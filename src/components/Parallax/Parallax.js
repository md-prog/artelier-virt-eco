import { createContext, useContext } from "react";

const ParallaxContext = createContext({});

export const { Provider, Consumer } = ParallaxContext;

export function useParallax() {
    return useContext(ParallaxContext);
}
