import React, { createContext, useContext, useEffect, useState } from "react";
import FontFaceObserver from "fontfaceobserver";

const FontContext = createContext();

export const { Provider, Consumer } = FontContext;

export function useFontObserver() {
    const context = useContext(FontContext);

    return context;
}

export const FontObserver = ({ children }) => {
    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
        const fonts = [
            {
                family: "IBM Plex Sans",
                data: {
                    weight: 400,
                },
            },
            {
                family: "IBM Plex Sans",
                data: {
                    weight: 500,
                },
            },
            {
                family: "IBM Plex Sans",
                data: {
                    weight: 400,
                    fontStyle: "italic",
                },
            },
            {
                family: "Plaak",
                data: {
                    weight: 300,
                },
            },
            {
                family: "Plaak",
                data: {
                    weight: 400,
                },
            },
            {
                family: "Plaak",
                data: {
                    weight: 700,
                },
            },
            {
                family: "FoundryGridnik",
                data: {
                    weight: 400,
                },
            },
            {
                family: "FoundryGridnik",
                data: {
                    weight: 500,
                },
            },
        ];
        Promise.all(
            fonts.map(font => {
                const observer = new FontFaceObserver(font.family, font.data);
                return observer.load();
            })
        )
            .then(() => {
                setLoaded(true);
            })
            .catch(() => {
                setLoaded(false);
            });
    }, []);

    return <Provider value={loaded}>{children}</Provider>;
};

export default FontObserver;
