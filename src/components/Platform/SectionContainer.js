import React, { useEffect, useLayoutEffect, useRef, forwardRef } from "react";
import { useSection } from "./SectionContext";
import { useArticle } from "./ArticleContext";
import mergeRefs from "../../util/mergeRefs";
import { css } from "@emotion/core";
import { useResizer } from "./Resizer";
import { useFontObserver } from "./FontObserver";

const container = css`
    position: relative;
    z-index: 2;
`;
const SectionContainer = forwardRef(
    ({ children, index, title, ...props }, ref) => {
        let localRef = useRef();
        const { points, setSection, section, subSections } = useSection();
        const { setSection: setArticleSection } = useArticle();
        const { area } = useResizer();
        const fontLoaded = useFontObserver();
        useLayoutEffect(() => {
            let rect = localRef.current.getBoundingClientRect();
            setSection(
                index,
                rect.top + window.scrollY,
                rect.bottom + window.scrollY
            );
        }, [localRef, index, setSection, area, fontLoaded]);
        useEffect(() => {
            if (section) {
                setArticleSection(
                    section.index,
                    section.startPosition,
                    section.endPosition,
                    section.height,
                    points,
                    title,
                    subSections
                );
            }
        }, [points, section, setArticleSection, title, subSections]);

        return (
            <div css={container} ref={mergeRefs(localRef, ref)}>
                <>{children}</>
            </div>
        );
    }
);

export default SectionContainer;
