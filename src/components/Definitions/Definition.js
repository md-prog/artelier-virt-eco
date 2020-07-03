import React, { useLayoutEffect, useRef } from "react";
import styled from "@emotion/styled";
import { useSidebar } from "../Platform/SidebarContext";
import uuid from "../../util/uuid";
import { useFontObserver } from "../Platform/FontObserver";
import { useResizer } from "../Platform/Resizer";

const Container = styled.span`
    color: ${({ theme }) => theme.highlight};
    cursor: pointer;
    @media screen and (min-width: 800px) {
        white-space: nowrap;
    }
`;

const Definition = ({ word, definition }) => {
    const ref = useRef();
    const id = useRef(uuid());
    const { addSidebarItem, setVisible } = useSidebar();
    const fontLoaded = useFontObserver();
    const { area } = useResizer();
    useLayoutEffect(() => {
        let rect = ref.current.getBoundingClientRect();
        let parentRect = ref.current.parentElement.getBoundingClientRect();
        let atTop = rect.top - parentRect.top <= rect.height;
        let top = window.scrollY + rect.top;
        let position = {
            top: top,
            left: window.scrollX + rect.left,
            width: rect.width,
            height: rect.height,
        };
        addSidebarItem(
            id.current,
            "definition",
            position,
            atTop,
            word,
            definition
        );
    }, [addSidebarItem, id, word, definition, fontLoaded, area]);
    return (
        <Container
            ref={ref}
            onMouseOver={() => {
                if (area.width > 1024) {
                    setVisible(id.current, true);
                }
            }}
            onFocus={() => {
                if (area.width > 1024) {
                    setVisible(id.current, true);
                }
            }}
            onMouseOut={() => {
                if (area.width > 1024) {
                    setVisible(id.current, false);
                }
            }}
            onBlur={() => {
                if (area.width > 1024) {
                    setVisible(id.current, false);
                }
            }}
            onClick={() => {
                if (area.width <= 1024) {
                    setVisible(id.current, true);
                }
            }}
        >
            {word}
        </Container>
    );
};

export default Definition;
