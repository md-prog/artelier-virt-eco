import React, { useLayoutEffect, useRef, useState } from "react";
import Text from "../../slices/Text";
import Quote from "../../slices/Quote";
import Image from "../../slices/Image";
import SidebarProvider from "../Platform/SidebarContext";
import styled from "@emotion/styled";
import { ThemeProvider } from "emotion-theming";
import DefinitionsContainer from "../Definitions/DefinitionsContainer";
import { useFontObserver } from "../Platform/FontObserver";
import { useResizer } from "../Platform/Resizer";
import { useSection } from "../Platform/SectionContext";
import Spacer from "../Platform/Spacer";
import { breakpoints, respond } from "../../styles/responsive";
import gridSizing from "../../styles/gridSizing";
import CustomComponent from "../../slices/CustomComponent";
import ImageGraph from "../../slices/ImageGraph";
import BigNumbers from "../../slices/BigNumbers";
import BigStats from "../../slices/BigStats";
import CardsWithModal from "../../slices/CardsWithModal";
import ImageViz from "../../slices/ImageViz";
const baseTheme = {
    textColor: "white",
    backgroundColor: "rgba(15,15,15,0.95)",
    mobileBackgroundColor: "rgba(15,15,15,0.9)",
    bodyFontSize: { max: 22, min: 16 },
    smallQuoteFontSize: { max: 40, min: 24 },
    largeQuoteFontSize: { min: 22.5, max: 75 },
    type: "SectionIntro",
    style: "dark",
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
            default: "3 / span 44",
            800: "1 / span 30",
            1100: `1 / span 26`,
            1480: `1 / span 22`,
        },
        largeQuote: `2 / span 46`,
        image: {
            default: "7 / span 36",
            800: "3 / span 26",
            1100: "3 / span 22",
            1480: "3 / span 18",
        },
        imageGraph: {
            default: `3 / span 44`,
            800: "1 / span 38",
            1100: `1 / span 34`,
            1480: `1 / span 30`,
        },
        imageViz: {
            default: `6 / span 38`,
            800: "1 / span 30",
            1100: `1 / span 26`,
            1480: `1 / span 22`,
        },
        definition: `32 / 49`,
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
            default: `3 / span 44`,
            800: "10 / span 30",
            1100: `12 / span 26`,
            1480: `14 / span 22`,
        },
        largeQuote: `2 / span 46`,
        image: {
            default: `7 / span 36`,
            800: "12 / span 26",
            1100: "14 / span 22",
            1480: "16 / span 18",
        },
        imageGraph: {
            default: `3 / span 44`,
            800: "6 / span 38",
            1100: `8 / span 34`,
            1480: `10 / span 30`,
        },
        cards: {
            default: `3 / span 44`,
            800: "10 / span 30",
            1100: `10 / span 30`,
            1480: `12 / span 26`,
        },
        imageViz: {
            default: `6 / span 38`,
            800: "9 / span 32",
            1100: `11 / span 28`,
            1480: `13 / span 24`,
        },
        definition: `38 / 49`,
        definitionDirection: "right",
    },
    right: {
        content: {
            default: `3 / span 44`,
            800: "19 / span 30",
            1100: `23 / span 26 `,
            1480: `27 / span 22`,
        },
        header: {
            default: `3 / span 44`,
            800: "19 / span 30",
            1100: `23 / span 26 `,
            1480: `27 / span 22`,
        },
        smallQuote: {
            default: `3 / span 44`,
            800: "19 / span 30",
            1100: "23 / span 26",
            1480: `27 / span 22`,
        },
        largeQuote: `2 / span 46`,
        image: {
            default: `7 / span 36`,
            800: "21 / span 26",
            1100: "25 / span 22",
            1480: "29 / span 18",
        },
        imageGraph: {
            default: `3 / span 44`,
            800: "15 / span 38",
            1100: `19 / span 34 `,
            1480: `23 / span 30`,
        },
        imageViz: {
            default: `6 / span 38`,
            800: "19 / span 30",
            1100: `23 / span 26 `,
            1480: `27 / span 22`,
        },
        definition: `1 / 24`,
        definitionDirection: "left",
    },
};

const Container = styled.div`
    width: 100%;
    margin: 0 auto;
    max-width: 1800px;
    grid-template-columns: repeat(48, 1fr);
    display: grid;
    position: relative;
    padding: 120px 0;
    overflow-x: hidden;
`;
const Header = styled.h2`
    ${respond(55, 120)};
    line-height: 0.94;
    letter-spacing: 0.02em;

    text-transform: uppercase;
    font-family: "Plaak", sans-serif;
    font-weight: bold;
    text-align: ${({ theme }) => (theme.side === "center" ? "center" : "left")};
    span {
        font-size: 22px;
        display: block;
        font-family: "IBM Plex Sans", sans-serif;
        text-transform: none;
        font-weight: 400;
        letter-spacing: 0.04em;
        margin-bottom: 15px;
    }
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
    ${gridSizing(2, ["paddingLeft", "paddingRight"])};
    padding-top: 85px;
`;
const SubHeader = styled.h3`
    font-family: FoundryGridnik, sans-serif;
    font-size: 16px;
    text-align: ${({ theme }) => (theme.side === "center" ? "center" : "left")};
    color: #00ffc2;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    ${respond(42, 85, "px", "paddingBottom")};
`;

const SectionIntro = ({
    content,
    title = true,
    position = "center",
    subTitle,
    style = {},
    themeOverride = {},
    alternateTitle = false,
    id = undefined,
    label = false,
}) => {
    const theme = {
        ...baseTheme,
        ...themeOverride,
        position: positions[position],
        side: position,
    };
    const { subSectionDispatch } = useSection();
    const fontLoaded = useFontObserver();
    const { area } = useResizer();
    const [basePosition, setBasePosition] = useState({});
    const ref = useRef();
    const previousPosition = useRef(null);
    useLayoutEffect(() => {
        const rect = ref.current.getBoundingClientRect();
        setBasePosition({
            top: window.scrollY + rect.top,
            left: window.scrollX + rect.left,
        });
        subSectionDispatch({
            payload: {
                title: title ? content.data.display_title.text : null,
                start: rect.top + window.scrollY,
                end: rect.bottom + window.scrollY,
                oldPosition: previousPosition.current,
                label: label,
            },
        });
        previousPosition.current = rect.top + window.scrollY;
    }, [
        ref,
        fontLoaded,
        area,
        title,
        content,
        previousPosition,
        subSectionDispatch,
    ]);

    let containers = [];
    let items = [];
    content.data.body.forEach((slice, i) => {
        switch (slice.__typename) {
            case "PrismicSectionBodyText":
                items.push(<Text key={slice.id} data={slice} />);
                break;
            case "PrismicSectionBodyPullQuote":
                items.push(<Quote key={slice.id} data={slice} />);
                break;
            case "PrismicSectionBodyImage":
                items.push(<Image key={slice.id} data={slice} />);
                break;
            case "PrismicSectionBodyImageGraph":
                items.push(<ImageGraph key={slice.id} data={slice} />);
                break;
            case "PrismicSectionBodyCustomComponent": {
                items.push(<CustomComponent key={slice.id} data={slice} />);
                break;
            }
            case "PrismicSectionBodyBigNumbers":
                items.push(<BigNumbers key={slice.id} data={slice} />);
                break;
            case "PrismicSectionBodyBigStats":
                items.push(<BigStats key={slice.id} data={slice} />);
                break;
            case "PrismicSectionBodyCardswithmodal":
                items.push(<CardsWithModal key={slice.id} data={slice} />);
                break;
            case "PrismicSectionBodyImageDataVisualization":
                items.push(<ImageViz key={slice.id} data={slice} />);
                break;
            case "PrismicSectionBodyEmptyspace":
                containers.push(
                    <Spacer key={slice.id} data={slice}>
                        {items}
                    </Spacer>
                );
                items = [];
                break;
            default:
        }
        if (i === content.data.body.length - 1) {
            containers.push(
                <Spacer key={`final_spacer`} data={null}>
                    {items}
                </Spacer>
            );
            items = [];
        }
    });

    return (
        <Container ref={ref} css={style} id={id}>
            <SidebarProvider>
                <ThemeProvider theme={theme}>
                    <DefinitionsContainer basePosition={basePosition} />
                    {title && (
                        <HeaderContainer>
                            {alternateTitle ? (
                                <Header>
                                    <span>{content.data.sub_title.text}</span>
                                    {content.data.display_title.text}
                                </Header>
                            ) : (
                                <>
                                    {subTitle || content.data.sub_title.text ? (
                                        <SubHeader>
                                            {subTitle ||
                                                content.data.sub_title.text}
                                        </SubHeader>
                                    ) : null}
                                    <Header>
                                        {content.data.display_title.text}
                                    </Header>
                                </>
                            )}
                        </HeaderContainer>
                    )}
                    {containers}
                </ThemeProvider>
            </SidebarProvider>
        </Container>
    );
};

export default SectionIntro;
