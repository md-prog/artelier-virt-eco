import React, { useLayoutEffect, useRef } from "react";
import styled from "@emotion/styled";
import { useResizer } from "../Platform/Resizer";
import { useSection } from "../Platform/SectionContext";
import { useFontObserver } from "../Platform/FontObserver";

const Container = styled.div`
    width: 100%;
    height: ${({ height = "200vh" }) => height};
`;

const Title = ({ height }) => {
    const { subSectionDispatch } = useSection();

    const { area } = useResizer();
    const fontLoaded = useFontObserver();
    const ref = useRef();
    const previousPosition = useRef(null);
    useLayoutEffect(() => {
        const rect = ref.current.getBoundingClientRect();
        let oldPosition = previousPosition.current;
        previousPosition.current = rect.top + window.scrollY;
        subSectionDispatch({
            payload: {
                title: null,
                start: rect.top + window.scrollY,
                end: rect.bottom + window.scrollY,
                oldPosition: oldPosition,
                label: "title",
            },
        });
    }, [ref, area, fontLoaded, previousPosition, subSectionDispatch]);

    return <Container ref={ref} height={height} />;
};

export default Title;
