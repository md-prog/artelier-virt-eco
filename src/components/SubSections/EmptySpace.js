import React, { useLayoutEffect, useRef } from "react";
import styled from "@emotion/styled";
import { useFontObserver } from "../Platform/FontObserver";
import { useResizer } from "../Platform/Resizer";
import { useSection } from "../Platform/SectionContext";

const Container = styled.div`
    width: 100%;
    margin: 0 auto;
    max-width: 1800px;
    overflow-x: hidden;
`;

const EmptySpace = ({ style = {}, label = false }) => {
    const { subSectionDispatch } = useSection();
    const fontLoaded = useFontObserver();
    const { area } = useResizer();
    const ref = useRef();
    const previousPosition = useRef(null);
    useLayoutEffect(() => {
        const rect = ref.current.getBoundingClientRect();
        subSectionDispatch({
            payload: {
                title: null,
                start: rect.top + window.scrollY,
                end: rect.bottom + window.scrollY,
                oldPosition: previousPosition.current,
                label: label,
            },
        });
        previousPosition.current = rect.top + window.scrollY;
    }, [ref, fontLoaded, area, previousPosition, subSectionDispatch, label]);

    return <Container ref={ref} css={style} />;
};

export default EmptySpace;
