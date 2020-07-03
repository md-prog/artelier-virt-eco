import React, { useEffect, useState } from "react";
import { useArticle } from "../Platform/ArticleContext";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import { isBrowser } from "@emotion/core/src/utils";
import { Transition, TransitionGroup } from "react-transition-group";
import { pageView } from "../../util/analytics";

const defaultStyle = {
    transition: `opacity 100ms ease-in-out`,
    gridColumn: `1/1`,
    gridRow: `1/1`,
    opacity: 0,
    display: "block",
};

const transitionStyles = {
    entering: { opacity: 0 },
    entered: { opacity: 1 },
    exiting: { opacity: 0 },
    exited: { opacity: 0 },
};
const baseCss = css`
    padding: 24px;
    border-left: 1px solid white;
    display: none;
    @media screen and (min-width: 1100px) {
        display: grid;
    }
`;
const Title = styled.div`
    ${baseCss};
`;
const Section = styled.div`
    ${baseCss};
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
`;
const SubSection = styled.div`
    ${baseCss};
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
    flex: 1;
`;
const Breadcrumbs = () => {
    const { map } = useArticle();
    const [currentSection, setCurrentSection] = useState("");
    const [currentSubSection, setCurrentSubSection] = useState("");
    useEffect(() => {
        const onScroll = () => {
            const scroll = window.scrollY;
            let sectionName = "";
            let subSectionName = "";
            for (let i = 0; i < map.length; i++) {
                let section = map[i];
                if (
                    scroll >= section.sectionStart &&
                    scroll <= section.sectionEnd
                ) {
                    sectionName = section.title;
                    for (let j = 0; j < section.sections.length; j++) {
                        let subSection = section.sections[j];
                        if (
                            scroll >= subSection.start &&
                            scroll < subSection.end
                        ) {
                            subSectionName = subSection.title;
                            if (subSection.label === "conclusion") {
                                subSectionName = "";
                                sectionName = "Conclusion";
                            }
                            break;
                        }
                    }
                    break;
                }
            }
            setCurrentSection(sectionName);
            setCurrentSubSection(subSectionName);
        };
        if (isBrowser) {
            onScroll();
            window.addEventListener("scroll", onScroll);
        }
        return () => {
            window.removeEventListener("scroll", onScroll);
        };
    }, [map, setCurrentSubSection, setCurrentSection]);
    useEffect(() => {
        pageView(
            `/virtual-economy/${currentSection
                .toLowerCase()
                .replace(" ", "-")}`,
            currentSection
        );
    }, [currentSection]);

    return (
        <>
            <Title>The Virtual Economy</Title>
            <Section>
                <TransitionGroup component={null}>
                    <Transition timeout={100} key={currentSection}>
                        {state => {
                            return (
                                <span
                                    style={{
                                        ...defaultStyle,
                                        ...transitionStyles[state],
                                    }}
                                >
                                    {currentSection}
                                </span>
                            );
                        }}
                    </Transition>
                </TransitionGroup>
            </Section>
            <SubSection>
                <TransitionGroup component={null}>
                    <Transition timeout={100} key={currentSubSection}>
                        {state => {
                            return (
                                <span
                                    style={{
                                        ...defaultStyle,
                                        ...transitionStyles[state],
                                    }}
                                >
                                    {currentSubSection}
                                </span>
                            );
                        }}
                    </Transition>
                </TransitionGroup>
            </SubSection>
        </>
    );
};

export default Breadcrumbs;
