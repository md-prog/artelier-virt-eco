import React, { Fragment } from "react";
import styled from "@emotion/styled";
import { breakpoints, respond } from "../styles/responsive";
import gridSizing from "../styles/gridSizing";

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
    color: ${({ theme }) => (theme.textColor ? theme.textColor : "white")};
`;
const Title = styled.h3`
    font-family: Plaak, sans-serif;
    font-weight: bold;
    ${respond(35, 55)};
    text-transform: uppercase;
    text-align: left;
    margin-bottom: 30px;
    letter-spacing: 0.03em;
`;
const StatsContainer = styled.div`
    grid-template-columns: auto 1fr;
    ${respond(10, 20, "px", "gridColumnGap")}
    ${respond(15, 30, "px", "gridRowGap")}
    display: grid;
    font-family: Plaak, sans-serif;
    font-weight: bold;
    ${respond(40, 100)};
`;
const StatLabel = styled.div`
    grid-column: 1;
`;
const StatValue = styled.div`
    grid-column: 2;
    color: #a243ff;
`;

const SubText = styled.div`
    font-family: FoundryGridnik, sans-serif;
    ${respond(16, 20)};
    font-weight: 500;
    margin-top: 30px;
    letter-spacing: 0.03em;
`;

const BigStats = ({ data: { primary, items = [] } }) => {
    return (
        <Container>
            <Title>{primary.title1 ? primary.title1.text : null}</Title>
            <StatsContainer>
                {items.map((stat, i) => {
                    return (
                        <Fragment key={i}>
                            <StatLabel>{stat.label}</StatLabel>
                            <StatValue>{stat.value}</StatValue>
                        </Fragment>
                    );
                })}
            </StatsContainer>

            {primary.sub_text ? <SubText>{primary.sub_text}</SubText> : null}
        </Container>
    );
};

export default BigStats;
