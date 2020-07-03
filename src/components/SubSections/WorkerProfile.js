import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Text from "../../slices/Text";
import styled from "@emotion/styled";
import SidebarProvider from "../Platform/SidebarContext";
import { ThemeProvider } from "emotion-theming";
import DefinitionsContainer from "../Definitions/DefinitionsContainer";
import { useResizer } from "../Platform/Resizer";
import { useFontObserver } from "../Platform/FontObserver";
import { useSection } from "../Platform/SectionContext";
import { breakpoints, respond } from "../../styles/responsive";
import WorkerProfileQuote from "../Content/Workers/WorkerProfileQuote";
import ProfileImage from "../../slices/ProfileImage";
import { isBrowser } from "@emotion/core/src/utils";
import gridSizing from "../../styles/gridSizing";

const baseTheme = {
    textColor: "white",
    bodyFontSize: { min: 16, max: 22 },
    smallQuoteFontSize: { min: 26, max: 35 },
    largeQuoteFontSize: "100px",
    type: "WhiteCaseStudy",
    bodyFont: "FoundryGridnik",
    style: "light",
    highlight: "#FF8266",
};
const positions = {
    center: {
        content: {
            default: `3 / span 44`,
            800: "10 / span 32",
            1100: `12 / span 28`,
            1480: `14 / span 22`,
        },
        header: {
            default: `3 / span 44`,
            800: "13 / span 26",
            1100: `15 / span 22`,
            1480: `16 / span 18`,
        },
        subHeader: {
            default: `3 / span 44`,
            800: "15 / span 22",
            1100: `17 / span 18`,
            1480: `18 / span 14`,
        },
        smallQuote: {
            default: `7 / span 36`,
            800: "12 / span 28",
            1100: `14 / span 24`,
            1480: `14 / span 22`,
        },
        largeQuote: `2 / span 46`,
        image: {
            default: `4 / span 42`,
            800: "12 / span 26",
            1100: `14 / span 22`,
            1480: `14 / span 22`,
        },
        definition: { default: "35/49", 1480: `34 / 49` },
        definitionDirection: "right",
    },
};
const Wrapper = styled.div`
    width: 100%;
    background-color: white;
    padding: 0 0 8vh 0;

    &:last-child {
        padding-bottom: 24vh;
    }
`;
const Container = styled.div`
    color: black;
    width: 100%;
    margin: 0 auto;
    max-width: 1800px;
    display: grid;
    grid-template-columns: repeat(48, 1fr);
    position: relative;

    font-family: "FoundryGridnik", sans-serif;
`;

const Header = styled.h3`
    ${respond(80, 180)};
    line-height: 0.75;
    margin-top: 60px;
    margin-bottom: 60px;
    text-align: center;
    text-transform: uppercase;
    font-family: "Pixelar", sans-serif;
    color: ${({ theme }) => theme.highlightColor};
    ${({ theme }) => breakpoints(theme.position.header, "gridColumn")};
    @media screen and (min-width: 800px) {
        margin-top: 260px;
    }
`;
const SubHeader = styled.h4`
    ${respond(20, 25)};
    text-align: center;
    font-family: "FoundryGridnik", sans-serif;
    text-transform: uppercase;
    margin-bottom: 40px;
    line-height: 1.3;
    font-weight: 500;
    color: ${({ theme }) => theme.highlightColor};
    ${({ theme }) => breakpoints(theme.position.subHeader, "gridColumn")};
    @media screen and (min-width: 800px) {
        margin-bottom: 120px;
    }
`;

const ImageContainer = styled.div`
    position: absolute;
    height: 900px;
    left: ${({ position = "left'" }) => (position === "left" ? 0 : null)};
    right: ${({ position = "left'" }) => (position === "left" ? null : 0)};
    top: 0;
    ${gridSizing(14, ["width"])};
    pointer-events: none;
    display: none;
    @media screen and (min-width: 800px) {
        display: block;
    }
`;

const Sword = styled.img`
    ${({ imageWidth }) => gridSizing(imageWidth, ["width"])};
    position: absolute;
    transform-origin: 50% 50%;
`;

const WorkerProfile = ({
    content,
    position = "center",
    title = true,
    setColor,
    color,
    image,
    imageWidth = 3,
    imagePositionsLeft = [],
    imagePositionsRight = [],
    parentTitle,
}) => {
    const theme = {
        ...baseTheme,
        position: positions[position],
        side: position,
        highlightColor: color,
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
            bottom: window.scrollY + rect.bottom,
            left: window.scrollX + rect.left,
        });
        subSectionDispatch({
            payload: {
                title: title
                    ? `Profile: ${content.data.display_title.text}`
                    : false,
                start: wrapperPosition.top + window.scrollY,
                end: wrapperPosition.bottom + window.scrollY,
                oldPosition: previousPosition.current,
                white: true,
            },
        });
        previousPosition.current = window.scrollY + wrapperPosition.top;
    }, [ref, area, fontLoaded, wrapperRef, content, subSectionDispatch, title]);

    useEffect(() => {
        const onScroll = () => {
            if (
                window.scrollY > basePosition.top &&
                window.scrollY < basePosition.bottom
            ) {
                setColor(color);
            }
        };

        onScroll();
        if (isBrowser) {
            window.addEventListener("scroll", onScroll);
        }
        return () => {
            window.removeEventListener("scroll", onScroll);
        };
    }, [basePosition, setColor, color]);
    return (
        <Wrapper ref={wrapperRef}>
            <Container ref={ref}>
                <SidebarProvider>
                    <ThemeProvider theme={theme}>
                        <ImageContainer position="left">
                            {imagePositionsLeft.map((css, i) => {
                                return (
                                    <Sword
                                        key={i}
                                        src={image}
                                        css={css}
                                        imageWidth={imageWidth}
                                    />
                                );
                            })}
                        </ImageContainer>

                        <DefinitionsContainer basePosition={basePosition} />
                        <Header>{content.data.display_title.text}</Header>
                        <SubHeader>{content.data.sub_title.text}</SubHeader>
                        <ImageContainer position="right">
                            {imagePositionsRight.map((css, i) => {
                                return (
                                    <Sword
                                        key={i}
                                        src={image}
                                        css={css}
                                        imageWidth={imageWidth}
                                    />
                                );
                            })}
                        </ImageContainer>
                        {content.data.body.map(slice => {
                            switch (slice.__typename) {
                                case "PrismicSectionBodyText":
                                    return <Text key={slice.id} data={slice} />;
                                case "PrismicSectionBodyPullQuote":
                                    return (
                                        <WorkerProfileQuote
                                            key={slice.id}
                                            data={slice}
                                        />
                                    );
                                case "PrismicSectionBodyImage":
                                    return (
                                        <ProfileImage
                                            key={slice.id}
                                            data={slice}
                                        />
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

export default WorkerProfile;
