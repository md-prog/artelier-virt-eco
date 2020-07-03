import React, { useLayoutEffect, useRef } from "react";
import styled from "@emotion/styled";
import gsap from "gsap";
import { useProgress } from "./ProgressBarProvider";

const Bar = styled.div`
    position: fixed;
    height: 8px;
    width: 0;
    bottom: 0;
    left: 0;
    z-index: 10;
    background-color: #00ffc2;
    transition: transform 0.3s;
    transform: ${({ offset = 0 }) => `translate3d(0,${offset}px,0)`};
`;
const ProgressBar = () => {
    const ref = useRef();
    const { offset } = useProgress();
    useLayoutEffect(() => {
        const baseTween = gsap.fromTo(
            ref.current,
            1,
            { width: "0%" },
            { width: "100%", paused: true }
        );
        const callback = () => {
            let base = document.body.scrollHeight - window.innerHeight;
            gsap.to(baseTween, { progress: window.scrollY / base });
        };
        callback();
        window.addEventListener("scroll", callback);
        return () => {
            window.removeEventListener("scroll", callback);
        };
    }, [ref]);
    return <Bar ref={ref} offset={offset} />;
};

export default ProgressBar;
