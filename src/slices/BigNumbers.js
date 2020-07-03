import React, { useLayoutEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { breakpoints, respond } from "../styles/responsive";
import gridSizing from "../styles/gridSizing";
import { useResizer } from "../components/Platform/Resizer";
import { useFontObserver } from "../components/Platform/FontObserver";

const Container = styled.div`
    ${({ theme }) => breakpoints(theme.position.content, "gridColumn")};
    background-color: ${({ theme }) =>
        theme.mobileBackgroundColor
            ? theme.mobileBackgroundColor
            : theme.backgroundColor};
    @media screen and (min-width: 800px) {
        background-color: ${({ theme }) => theme.backgroundColor};
    }
    ${gridSizing(2, ["paddingLeft", "paddingRight"])};
    ${gridSizing(1, ["paddingTop", "paddingBottom"])};
`;
const Title = styled.h3`
    font-family: Plaak, sans-serif;
    font-weight: bold;
    ${respond(35, 55)};
    text-transform: uppercase;
    text-align: center;
    margin-bottom: 30px;
    letter-spacing: 0.03em;
`;
const Label = styled.h4`
    font-family: FoundryGridnik, sans-serif;
    ${respond(20, 30)};
    font-weight: 500;
    text-transform: uppercase;
    text-align: center;
    color: ${({ theme }) => theme.textColor};
`;
const SVG = styled.svg`
    width: 100%;
`;
const NumberContainer = styled.div`
    margin-bottom: 25px;
    ${gridSizing(2, ["paddingLeft", "paddingRight"])};
    &:last-child {
        margin-bottom: 0;
    }
`;

const SubText = styled.div`
    text-align: center;
    font-family: FoundryGridnik, sans-serif;
    letter-spacing: 0.1em;
    margin-top: 82px;
    ${respond(10, 14)};
    color: ${({ theme }) => theme.textColor};
`;

const SizedText = ({ children, style, heightMultiplier = 1 }) => {
    const [textSize, setTextSize] = useState({
        width: 0,
        height: 0,
        x: 0,
        y: 0,
    });
    const sizeRef = useRef();
    const { area } = useResizer();
    const fontLoaded = useFontObserver();
    useLayoutEffect(() => {
        let size = sizeRef.current.getBBox();
        setTextSize(size);
    }, [sizeRef, setTextSize, area, fontLoaded]);

    return (
        <SVG
            viewBox={`${textSize.x} ${textSize.y + 0.15 * textSize.height} ${
                textSize.width
            } ${textSize.height * 0.78}`}
        >
            <text css={style} ref={sizeRef}>
                {children}
            </text>
        </SVG>
    );
};
const BigNumbers = ({ data: { primary, items = [] } }) => {
    return (
        <Container>
            {primary.title1 && primary.title1.text ? (
                <Title>{primary.title1.text}</Title>
            ) : null}
            {items.map((item, i) => {
                return (
                    <NumberContainer key={i}>
                        <SizedText
                            heightMultiplier={0.85}
                            style={{
                                fontFamily: "Plaak, sans-serif",
                                fontWeight: "bold",
                                fill: "#A243FF",
                            }}
                        >
                            {item.number}
                        </SizedText>
                        <Label>{item.label}</Label>
                    </NumberContainer>
                );
            })}
            <SubText>{primary.source}</SubText>
        </Container>
    );
};

export default BigNumbers;
