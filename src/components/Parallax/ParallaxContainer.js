import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useResizer } from "../Platform/Resizer";
import { isBrowser } from "@emotion/core/src/utils";
import { relativeProgress } from "../Universe/webgl/math";
import { Provider } from "./Parallax";

const ParallaxContainer = ({ children }) => {
    const ref = useRef();
    const { area } = useResizer();
    const progress = useRef({});
    const [position, setPosition] = useState();
    useLayoutEffect(() => {
        const rect = ref.current.getBoundingClientRect();
        setPosition({
            top: rect.top + window.scrollY,
            bottom: rect.bottom + window.scrollY,
            height: rect.height,
        });
    }, [ref, setPosition, area]);

    useEffect(() => {
        if (!position) {
            return;
        }
        const onScroll = () => {
            const scrollY = window.scrollY;
            const relativeScroll = scrollY + window.innerHeight - position.top;
            const end = position.height + window.innerHeight;
            progress.current = relativeProgress(relativeScroll, 0, end);
        };
        if (isBrowser) {
            onScroll();
            window.addEventListener("scroll", onScroll);
        }
        return () => {
            if (isBrowser) {
                window.removeEventListener("scroll", onScroll);
            }
        };
    }, [position, area]);
    return (
        <div ref={ref}>
            <Provider value={progress}>{children}</Provider>
        </div>
    );
};

export default ParallaxContainer;
