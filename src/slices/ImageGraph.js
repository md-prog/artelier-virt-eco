import React from "react";
import styled from "@emotion/styled";
import { breakpoints, respond } from "../styles/responsive";
import gridSizing from "../styles/gridSizing";
const Container = styled.div`
    ${({ theme }) => breakpoints(theme.position.imageGraph, "gridColumn")};
    ${gridSizing(1, ["paddingLeft", "paddingRight"])};
    ${gridSizing(2, ["paddingTop", "paddingBottom"])};
    background-color: ${({ theme }) =>
        theme.mobileBackgroundColor
            ? theme.mobileBackgroundColor
            : theme.backgroundColor};
    @media screen and (min-width: 800px) {
        background-color: ${({ theme }) => theme.backgroundColor};
    }
`;

const Picture = styled.picture`
    img {
        width: 100%;
    }
`;
const Title = styled.h3`
    ${respond(35, 55)};
    line-height: 0.9;
    font-family: Plaak, sans-serif;
    font-weight: bold;
    text-align: center;
    margin-bottom: 17px;
`;
const SubTitle = styled.h4`
    font-family: FoundryGridnik, sans-serif;
    ${respond(15, 17)};
    text-align: center;
    text-transform: uppercase;
    font-weight: 500;
    margin-bottom: 5px;
    line-height: 1.36;
    letter-spacing: 0.1em;
`;
const Date = styled.div`
    font-family: FoundryGridnik, sans-serif;
    ${respond(15, 17)};
    text-align: center;
    color: ${({ highlight }) => highlight};
    text-transform: uppercase;
    font-weight: 500;
    margin-bottom: 52px;
    line-height: 1.36;
    letter-spacing: 0.1em;
`;

const SubText = styled.div`
    text-align: center;
    font-family: FoundryGridnik, sans-serif;
    letter-spacing: 0.1em;
    margin-top: 32px;
    ${respond(10, 14)};
    @media screen and (min-width: 800px) {
        text-align: right;
    }
`;
const ImageGraph = ({ data: { primary } }) => {
    return (
        <Container>
            <Title>{primary.graph_title}</Title>
            <SubTitle>{primary.graph_subtitle}</SubTitle>
            <Date highlight={"#A243FF"}>{primary.graph_date_range}</Date>
            <Picture>
                <source
                    srcSet={primary.graph.url}
                    media={"(min-width: 800px)"}
                />
                <img src={primary.graph.thumbnails.Mobile.url} alt="" />
            </Picture>
            <SubText>{primary.source}</SubText>
        </Container>
    );
};

export default ImageGraph;
