import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import Text from "../../slices/Text";
import SidebarProvider from "../Platform/SidebarContext";
import styled from "@emotion/styled";
import { ThemeProvider } from "emotion-theming";
import DefinitionsContainer from "../Definitions/DefinitionsContainer";
import { useFontObserver } from "../Platform/FontObserver";
import { useResizer } from "../Platform/Resizer";
import { useSection } from "../Platform/SectionContext";
import { breakpoints, respond } from "../../styles/responsive";
import CitizenProfileImage from "../Content/CitizenProfileImage";
import CitizenProfileQuote from "../Content/CitizenProfileQuote";
import gridSizing from "../../styles/gridSizing";
import Modal from "react-modal";
const baseTheme = {
    textColor: "white",
    backgroundColor: "rgba(15,15,15,0.95)",
    mobileBackgroundColor: "rgba(15,15,15,0.9)",
    bodyFontSize: { max: 22, min: 14 },
    smallQuoteFontSize: { max: 22, min: 14 },
    largeQuoteFontSize: { min: 30, max: 100 },
    type: "CitizenProfile",
    style: "dark",
};
const positions = {
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
            1480: `15 / span 20`,
        },
        smallQuote: {
            default: `3 / span 44`,
            800: "10 / span 30",
            1100: `12 / span 26`,
            1480: `14 / span 22`,
        },
        largeQuote: `2 / span 46`,
        image: {
            default: `1 / 49`,
            800: "10 / span 30",
            1100: "12 / span 26",
            1480: "15 / span 20",
        },
        separator: {
            default: `3 / span 44`,
            800: "10 / span 30",
            1100: `12 / span 26`,
            1480: `17 / span 16`,
        },
        definition: `38 / 49`,
        definitionDirection: "right",
    },
};
const Wrapper = styled.div`
    width: 100%;
`;
const Container = styled.div`
    width: 100%;
    margin: 0 auto;
    max-width: 1800px;
    position: relative;
    overflow-x: hidden;
    font-family: FoundryGridnik, sans-serif;
    font-weight: 500;
    grid-template-columns: repeat(48, 1fr);
    display: grid;
`;
const ReadMoreContainer = styled.div`
    overflow: hidden;
    display: grid;
    grid-template-columns: repeat(48, 1fr);
    ${gridSizing(2, ["paddingTop", "paddingBottom"])};
    max-width: 1800px;
    width: 100%;
`;
const ReadMoreInner = styled.div`
    ${({ theme }) => breakpoints(theme.position.content, "gridColumn")};
    border: 3px solid
        ${({ theme }) => (theme.highlight ? theme.highlight : "white")};
    position: relative;
    pointer-events: auto;
`;
const ReadMoreButton = styled.button`
    appearance: none;
    background: none;
    color: white;
    border: 2px solid ${({ theme }) => theme.highlight};
    text-transform: uppercase;
    font-size: 22px;
    ${respond(18, 20)};
    padding: 12px 20px;
    font-family: "IBM Plex Sans", sans-serif;
    font-weight: 500;
    letter-spacing: 0.04em;
    cursor: pointer;
    transition: color 0.3s;
    &:hover {
        color: ${({ theme }) => theme.highlight};
    }
`;
const ReadMoreButtonContainer = styled.div`
    ${({ theme }) => breakpoints(theme.position.header, "gridColumn")};
    display: flex;
    flex-direction: column;
    align-items: center;
    ${gridSizing(2, ["paddingLeft", "paddingRight", "paddingBottom"])};
    ${gridSizing(1, ["paddingTop"])};
    background-color: ${({ theme }) =>
        theme.mobileBackgroundColor
            ? theme.mobileBackgroundColor
            : theme.backgroundColor};
    @media screen and (min-width: 800px) {
        background-color: ${({ theme }) => theme.backgroundColor};
    }
`;

const IntroText = styled.div`
    text-align: center;
    font-family: "IBM Plex Sans", sans-serif;
    ${respond(16, 22)};
    font-weight: 400;
    line-height: 1.4;
    letter-spacing: 0.04em;
    margin-bottom: 75px;
    color: white;
`;

const Header = styled.h2`
    ${respond(80, 170)};
    ${({ theme }) => breakpoints(theme.position.header, "gridColumn")};
    line-height: 0.7;
    letter-spacing: 0.02em;
    ${gridSizing(2, ["paddingTop"])};
    color: ${({ theme }) => (theme.highlight ? theme.highlight : "white")};
    text-transform: uppercase;
    font-family: "Pixelar", sans-serif;
    font-weight: 400;
    text-align: ${({ theme }) => (theme.side === "center" ? "center" : "left")};
    background-color: ${({ theme }) =>
        theme.mobileBackgroundColor
            ? theme.mobileBackgroundColor
            : theme.backgroundColor};
    @media screen and (min-width: 800px) {
        background-color: ${({ theme }) => theme.backgroundColor};
    }
`;

const Separator = styled.div`
    ${({ theme }) => breakpoints(theme.position.separator, "gridColumn")};
    margin-top: 150px;
    margin-bottom: 150px;
`;
const CloseButton = styled.button`
    position: absolute;
    ${gridSizing(0.5, ["top", "right"])};
    appearance: none;
    background: none;
    border: 0;
    ${respond(35, 45, "px", "height")};
    ${respond(35, 45, "px", "width")};
    padding: 0;
    cursor: pointer;
    svg {
        height: 100%;
        width: 100%;
    }
`;

const ModalCloseContainer = styled.div`
    width: 100%;
    background-color: ${({ theme }) =>
        theme.mobileBackgroundColor
            ? theme.mobileBackgroundColor
            : theme.backgroundColor};
    @media screen and (min-width: 800px) {
        background-color: ${({ theme }) => theme.backgroundColor};
    }
    display: flex;
    justify-content: center;
    ${gridSizing(2, ["paddingBottom"])};

    @media screen and (min-width: 800px) {
        display: none;
    }
`;

const CitizenProfile = ({ content, title = true, position = "center" }) => {
    const theme = {
        ...baseTheme,
        position: positions[position],
        side: position,
        highlight: content.data.highlight,
    };
    const { subSectionDispatch } = useSection();
    const fontLoaded = useFontObserver();
    const { area } = useResizer();
    const [basePosition, setBasePosition] = useState({});
    const ref = useRef();
    const wrapperRef = useRef();
    const previousPosition = useRef(null);
    const [showReadMore, setShowReadMore] = useState(false);
    useLayoutEffect(() => {
        const rect = ref.current.getBoundingClientRect();
        const wrapperRect = wrapperRef.current.getBoundingClientRect();
        setBasePosition({
            top: window.scrollY + rect.top,
            left: window.scrollX + rect.left,
        });
        subSectionDispatch({
            payload: {
                title: `Citizen Profile: ${content.data.citizen}`,
                start: wrapperRect.top + window.scrollY,
                end: wrapperRect.bottom + window.scrollY,
                oldPosition: previousPosition.current,
            },
        });
        previousPosition.current = wrapperRect.top + window.scrollY;
    }, [
        ref,
        wrapperRef,
        fontLoaded,
        area,
        title,
        content,
        previousPosition,
        subSectionDispatch,
    ]);

    const hideModal = useCallback(() => {
        setShowReadMore(false);
    }, [setShowReadMore]);

    return (
        <Wrapper ref={wrapperRef}>
            <Container ref={ref}>
                <SidebarProvider>
                    <ThemeProvider theme={theme}>
                        <DefinitionsContainer basePosition={basePosition} />
                        <Header>{content.data.citizen}</Header>
                        <CitizenProfileImage
                            irl={content.data.irl_image}
                            avatar={content.data.avatar_image}
                        />
                        <ReadMoreButtonContainer>
                            <IntroText
                                dangerouslySetInnerHTML={{
                                    __html: content.data.introduction
                                        ? content.data.introduction.html
                                        : null,
                                }}
                            />
                            <ReadMoreButton
                                onClick={() => {
                                    setShowReadMore(prev => !prev);
                                }}
                                data-track={"citizen-profile-read-more"}
                            >
                                Read full bio +
                            </ReadMoreButton>
                        </ReadMoreButtonContainer>
                        <Modal
                            isOpen={showReadMore}
                            onRequestClose={hideModal}
                            style={{
                                overlay: {
                                    zIndex: 30,
                                    backgroundColor: "rgba(0,0,0,0.5)",
                                    overflowY: "auto",
                                    display: "flex",
                                },
                                content: {
                                    position: "static",
                                    margin: "auto",
                                    border: 0,
                                    background: null,
                                    overflow: "visible",
                                    padding: 0,
                                    top: null,
                                    left: null,
                                    right: null,
                                    bottom: null,
                                    pointerEvents: "none",
                                },
                            }}
                        >
                            <ReadMoreContainer>
                                <ReadMoreInner>
                                    <CloseButton onClick={hideModal}>
                                        <svg
                                            width="64"
                                            height="65"
                                            viewBox="0 0 64 65"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M18.1834 50.6331L13.6377 46.0874L45.4575 14.2676L50.0032 18.8133L18.1834 50.6331Z"
                                                fill="white"
                                            />
                                            <path
                                                d="M13.6369 18.8128L18.1826 14.2671L50.0024 46.0869L45.4567 50.6326L13.6369 18.8128Z"
                                                fill="white"
                                            />
                                        </svg>
                                    </CloseButton>
                                    <Text
                                        data={{
                                            primary: {
                                                text: content.data.content,
                                            },
                                        }}
                                    />
                                    <CitizenProfileQuote
                                        data={{
                                            primary: {
                                                content:
                                                    content.data
                                                        .citizen_content,
                                            },
                                        }}
                                    />
                                    <ModalCloseContainer>
                                        <ReadMoreButton
                                            onClick={() => {
                                                setShowReadMore(false);
                                            }}
                                            css={{
                                                paddingLeft: "40px",
                                                paddingRight: "40px",
                                            }}
                                        >
                                            Close
                                        </ReadMoreButton>
                                    </ModalCloseContainer>
                                </ReadMoreInner>
                            </ReadMoreContainer>
                        </Modal>

                        <Separator>
                            <svg
                                css={{ width: "100%" }}
                                width="684"
                                height="9"
                                viewBox="0 0 684 9"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <rect
                                    width="7.69708"
                                    height="7.69708"
                                    transform="matrix(1 0 0 -1 112.865 8.01758)"
                                    fill="white"
                                />
                                <rect
                                    width="7.69708"
                                    height="7.69708"
                                    transform="matrix(1 0 0 -1 292.463 8.01758)"
                                    fill="white"
                                />
                                <rect
                                    width="7.69708"
                                    height="7.69708"
                                    transform="matrix(1 0 0 -1 23.0652 7.69727)"
                                    fill="white"
                                />
                                <rect
                                    width="7.69708"
                                    height="7.69708"
                                    transform="matrix(1 0 0 -1 202.664 8.01758)"
                                    fill="white"
                                />
                                <rect
                                    width="7.69708"
                                    height="7.69708"
                                    transform="matrix(1 0 0 -1 67.9648 8.01758)"
                                    fill="white"
                                />
                                <rect
                                    width="7.69708"
                                    height="7.69708"
                                    transform="matrix(1 0 0 -1 247.563 8.01758)"
                                    fill="white"
                                />
                                <rect
                                    width="7.69708"
                                    height="7.69708"
                                    transform="matrix(1 0 0 -1 157.764 8.01758)"
                                    fill="white"
                                />
                                <rect
                                    width="7.69708"
                                    height="7.69708"
                                    transform="matrix(1 0 0 -1 337.363 8.01758)"
                                    fill="white"
                                />
                                <rect
                                    width="7.69708"
                                    height="7.69708"
                                    transform="matrix(-1 8.74228e-08 8.74228e-08 1 143.011 0.320312)"
                                    fill="white"
                                />
                                <rect
                                    width="7.69708"
                                    height="7.69708"
                                    transform="matrix(-1 8.74228e-08 8.74228e-08 1 322.61 0.320312)"
                                    fill="white"
                                />
                                <rect
                                    width="7.69708"
                                    height="7.69708"
                                    transform="matrix(-1 8.74228e-08 8.74228e-08 1 53.2122 0)"
                                    fill="white"
                                />
                                <rect
                                    width="7.69708"
                                    height="7.69708"
                                    transform="matrix(-1 8.74228e-08 8.74228e-08 1 232.811 0.320312)"
                                    fill="white"
                                />
                                <rect
                                    width="7.69708"
                                    height="7.69708"
                                    transform="matrix(-1 8.74228e-08 8.74228e-08 1 98.1121 0.320312)"
                                    fill="white"
                                />
                                <rect
                                    width="7.69708"
                                    height="7.69708"
                                    transform="matrix(-1 8.74228e-08 8.74228e-08 1 277.71 0.320312)"
                                    fill="white"
                                />
                                <rect
                                    width="7.69708"
                                    height="7.69708"
                                    transform="matrix(-1 8.74228e-08 8.74228e-08 1 8.31226 0)"
                                    fill="white"
                                />
                                <rect
                                    width="7.69708"
                                    height="7.69708"
                                    transform="matrix(-1 8.74228e-08 8.74228e-08 1 187.911 0.320312)"
                                    fill="white"
                                />
                                <rect
                                    x="504.161"
                                    y="7.69727"
                                    width="7.69708"
                                    height="7.69708"
                                    transform="rotate(-180 504.161 7.69727)"
                                    fill="white"
                                />
                                <rect
                                    x="683.76"
                                    y="7.69727"
                                    width="7.69708"
                                    height="7.69708"
                                    transform="rotate(-180 683.76 7.69727)"
                                    fill="white"
                                />
                                <rect
                                    x="414.362"
                                    y="8.01758"
                                    width="7.69708"
                                    height="7.69708"
                                    transform="rotate(-180 414.362 8.01758)"
                                    fill="white"
                                />
                                <rect
                                    x="593.96"
                                    y="7.69727"
                                    width="7.69708"
                                    height="7.69708"
                                    transform="rotate(-180 593.96 7.69727)"
                                    fill="white"
                                />
                                <rect
                                    x="459.262"
                                    y="7.69727"
                                    width="7.69708"
                                    height="7.69708"
                                    transform="rotate(-180 459.262 7.69727)"
                                    fill="white"
                                />
                                <rect
                                    x="638.86"
                                    y="7.69727"
                                    width="7.69708"
                                    height="7.69708"
                                    transform="rotate(-180 638.86 7.69727)"
                                    fill="white"
                                />
                                <rect
                                    x="369.462"
                                    y="8.01758"
                                    width="7.69708"
                                    height="7.69708"
                                    transform="rotate(-180 369.462 8.01758)"
                                    fill="white"
                                />
                                <rect
                                    x="549.061"
                                    y="7.69727"
                                    width="7.69708"
                                    height="7.69708"
                                    transform="rotate(-180 549.061 7.69727)"
                                    fill="white"
                                />
                                <rect
                                    x="474.014"
                                    width="7.69708"
                                    height="7.69708"
                                    fill="white"
                                />
                                <rect
                                    x="653.613"
                                    width="7.69708"
                                    height="7.69708"
                                    fill="white"
                                />
                                <rect
                                    x="384.215"
                                    y="0.320312"
                                    width="7.69708"
                                    height="7.69708"
                                    fill="white"
                                />
                                <rect
                                    x="563.814"
                                    width="7.69708"
                                    height="7.69708"
                                    fill="white"
                                />
                                <rect
                                    x="429.115"
                                    width="7.69708"
                                    height="7.69708"
                                    fill="white"
                                />
                                <rect
                                    x="608.713"
                                    width="7.69708"
                                    height="7.69708"
                                    fill="white"
                                />
                                <rect
                                    x="518.914"
                                    width="7.69708"
                                    height="7.69708"
                                    fill="white"
                                />
                            </svg>
                        </Separator>
                    </ThemeProvider>
                </SidebarProvider>
            </Container>
        </Wrapper>
    );
};

export default CitizenProfile;
