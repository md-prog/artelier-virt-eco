import React, { useLayoutEffect, useRef, useState } from "react";
import Text from "../../slices/Text";
import Quote from "../../slices/Quote";
import Image from "../../slices/Image";
import styled from "@emotion/styled";
import SidebarProvider from "../Platform/SidebarContext";
import { ThemeProvider } from "emotion-theming";
import DefinitionsContainer from "../Definitions/DefinitionsContainer";
import { useResizer } from "../Platform/Resizer";
import { useFontObserver } from "../Platform/FontObserver";
import { useSection } from "../Platform/SectionContext";
import { breakpoints, respond } from "../../styles/responsive";
import BigNumbers from "../../slices/BigNumbers";
import BigStats from "../../slices/BigStats";

const baseTheme = {
    textColor: "black",
    backgroundColor: "rgba(255,255,255,1)",
    mobileBackgroundColor: "rgba(255,255,255,0.95)",
    bodyFontSize: { min: 16, max: 22 },
    smallQuoteFontSize: { min: 20, max: 30 },
    largeQuoteFontSize: "100px",
    type: "WhiteCaseStudy",
    bodyFont: "IBM Plex Serif",
    style: "light",
    highlight: "#FF8266",
};
const positions = {
    left: {
        content: {
            default: `3 / span 44`,
            800: "1 / span 30",
            1100: `1 / span 26`,
            1480: `1 / span 22`,
        },
        header: {
            default: `3 / span 44`,
            800: "1 / span 30",
            1100: `1 / span 26`,
            1480: `1 / span 22`,
        },
        smallQuote: {
            default: `1 /span 49`,
            800: "3 / span 26",
            1100: `3 / span 22`,
            1480: `3 / span 18`,
        },
        bigQuote: `4 / span 20`,
        image: {
            default: `7 / span 36`,
            800: "3 / span 26",
            1100: "3 / span 22",
            1480: "3 / span 18",
        },
        definition: { default: "25/49", 1480: `24 / 49` },
        definitionDirection: "right",
    },

    center: {
        content: {
            default: `3 / span 44`,
            800: "10 / span 30",
            1100: `12 / span 26`,
            1480: `14 / span 22`,
        },
        header: {
            default: `3 / span 44`,
            800: "10 / span 30",
            1100: `12 / span 26`,
            1480: `14 / span 22`,
        },
        smallQuote: {
            default: `1 /span 49`,
            800: "12 / span 26",
            1100: `14 / span 22`,
            1480: `16 / span 18`,
        },
        largeQuote: `2 / span 46`,
        image: {
            default: `7 / span 36`,
            800: "10 / span 30",
            1100: `12 / span 26`,
            1480: `14 / span 22`,
        },
        definition: { default: "35/49", 1480: `34 / 49` },
        definitionDirection: "right",
    },
    right: {
        content: {
            default: `3 / span 44`,
            800: "19 / span 30",
            1100: `22 / span 26 `,
            1480: `27 / span 22`,
        },
        header: {
            default: `3 / span 44`,
            800: "19 / span 30",
            1100: `22 / span 26 `,
            1480: `27 / span 22`,
        },
        smallQuote: {
            default: `1 /span 49`,
            800: "17 / span 26",
            1100: `24 / span 22 `,
            1480: `29 / span 18`,
        },
        largeQuote: `26 / span 20`,
        image: {
            default: `7 / span 36`,
            800: "21 / span 26",
            1100: `24 / span 22`,
            1480: `29 / span 18`,
        },
        definition: { default: "1 / 24", 1480: `1 / 26` },
        definitionDirection: "left",
    },
};
const Wrapper = styled.div`
    padding-top: 100vh;
`;
const Container = styled.div`
    color: black;
    width: 100%;
    margin: 0 auto;
    max-width: 1800px;
    display: grid;
    grid-template-columns: repeat(48, 1fr);
    position: relative;
    padding-top: 100px;
    ${respond(50, 172, "px", "paddingBottom")};
    font-family: "IBM Plex Serif", serif;
`;
const MiddleLine = styled.div`
    width: 1px;
    background-color: black;
    ${({ side, theme }) => breakpoints(theme.position.content, "gridColumn")};
    justify-self: center;
    height: 256px;
    margin: 32px auto 32px auto;
`;
const Header = styled.h3`
    ${respond(68, 100)};
    text-align: center;
    text-transform: uppercase;
    font-family: "Plaak";
    width: 100%;
`;
const SubHeader = styled.h4`
    font-size: 20px;
    text-align: center;
    font-weight: 500;
    padding-bottom: 16px;
    width: 100%;
`;
const HeaderContainer = styled.div`
    ${({ theme }) => breakpoints(theme.position.header, "gridColumn")};
    background-color: ${({ theme }) =>
        theme.mobileBackgroundColor
            ? theme.mobileBackgroundColor
            : theme.backgroundColor};
    @media screen and (min-width: 800px) {
        background-color: ${({ theme }) => theme.backgroundColor};
    }
    padding-top: 32px;
`;

const ParentHeader = styled.div`
    font-size: 16px;
    text-transform: uppercase;
    font-family: FoundryGridnik, sans-serif;
    font-weight: 400;
    text-align: center;
    opacity: 0.5;
`;

const WhiteCaseStudy = ({
    content,
    position = "center",
    title = true,
    parentTitle,
}) => {
    const theme = {
        ...baseTheme,
        position: positions[position],
        side: position,
    };
    const [basePosition, setBasePosition] = useState({});
    const fontLoaded = useFontObserver();
    const { area } = useResizer();
    const { subSectionDispatch } = useSection();
    const ref = useRef();
    const previousPosition = useRef(null);
    const wrapperRef = useRef();
    useLayoutEffect(() => {
        const rect = ref.current.getBoundingClientRect();
        const wrapperPosition = wrapperRef.current.getBoundingClientRect();
        setBasePosition({
            top: window.scrollY + rect.top,
            left: window.scrollX + rect.left,
        });
        subSectionDispatch({
            payload: {
                title: title
                    ? `Case study: ${content.data.display_title.text}`
                    : false,
                start: wrapperPosition.top + window.scrollY,
                end: wrapperPosition.bottom + window.scrollY,
                oldPosition: previousPosition.current,
                white: true,
            },
        });
        previousPosition.current = window.scrollY + wrapperPosition.top;
    }, [ref, area, fontLoaded, wrapperRef, subSectionDispatch, content, title]);
    return (
        <Wrapper ref={wrapperRef}>
            <Container ref={ref}>
                <SidebarProvider>
                    <ThemeProvider theme={theme}>
                        <DefinitionsContainer basePosition={basePosition} />
                        <HeaderContainer>
                            <ParentHeader>{parentTitle}</ParentHeader>
                            <MiddleLine />
                            <SubHeader>Case Study</SubHeader>
                            <Header>{content.data.display_title.text}</Header>
                        </HeaderContainer>
                        {content.data.body.map(slice => {
                            switch (slice.__typename) {
                                case "PrismicSectionBodyText":
                                    return <Text key={slice.id} data={slice} />;
                                case "PrismicSectionBodyPullQuote":
                                    return (
                                        <Quote key={slice.id} data={slice} />
                                    );
                                case "PrismicSectionBodyImage":
                                    return (
                                        <Image key={slice.id} data={slice} />
                                    );
                                case "PrismicSectionBodyBigNumbers":
                                    return (
                                        <BigNumbers
                                            key={slice.id}
                                            data={slice}
                                        />
                                    );
                                case "PrismicSectionBodyBigStats":
                                    return (
                                        <BigStats key={slice.id} data={slice} />
                                    );
                                default:
                            }
                            return null;
                        })}
                    </ThemeProvider>
                </SidebarProvider>
            </Container>
        </Wrapper>
    );
};

export default WhiteCaseStudy;
