import React, { useEffect, useRef } from "react";
import { useParallax } from "./Parallax";
import { isBrowser } from "@emotion/core/src/utils";
import { af as AF } from "@gladeye/af";

const ParallaxLayer = ({ children, from = 0, to = 0 }) => {
    const ref = useRef();
    const progress = useParallax();
    const previousProgress = useRef(0);
    useEffect(() => {
        const af = AF();
        const update = () => {
            if (progress.current !== previousProgress.current) {
                const value = from + (to - from) * progress.current;
                ref.current.style.transform = `translate3d(0, ${value}px,0)`;
            }
            previousProgress.current = progress.current;
        };
        if (isBrowser) {
            af.addWrite(update);
        }
        return () => {
            if (isBrowser) {
                af.removeWrite(update);
            }
        };
    }, [progress, ref, from, to]);
    return <div ref={ref}>{children}</div>;
};

export default ParallaxLayer;
