import React from "react";
import styled from "@emotion/styled";

import SectionContainer from "../Platform/SectionContainer";

import { breakpoints, respond } from "../../styles/responsive";
import { graphql, useStaticQuery } from "gatsby";
import gridSizing from "../../styles/gridSizing";
const Container = styled.div`
    position: relative;
    width: 100%;
    background-color: black;
    color: white;
    ${respond(47, 128, "px", "paddingTop")};
    ${respond(47, 128, "px", "paddingBottom")};
`;
const Inner = styled.div`
    width: 100%;
    max-width: 1800px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(48, 1fr);
`;
const Content = styled.div`
    margin: 0 auto;
    position: relative;
    ${breakpoints(
        {
            default: `3 / span 44`,
            800: "12 / span 26",
            1100: `14 / span 22`,
            1480: `16 / span 18`,
        },
        "gridColumn"
    )};
    ${respond(16, 22)};

    p {
        margin-bottom: 32px;
        line-height: 1.5;
    }

    h2 {
        font-family: Plaak, sans-serif;
        font-weight: bold;
        text-transform: uppercase;
        ${respond(58, 80)};
        margin-top: 88px;
        margin-bottom: 16px;
    }
    h3 {
        font-family: FoundryGridnik, sans-serif;
        font-weight: 500;
        ${respond(20, 28)};
        margin-bottom: 16px;
        margin-top: 40px;
        text-transform: uppercase;
    }
    ul {
        li {
            margin-bottom: 32px;
        }
    }
    strong {
        font-weight: 500;
    }
    a {
        ${respond(13, 18)};
        color: white;
        text-transform: uppercase;
        letter-spacing: 0.175em;
        font-family: FoundryGridnik, sans-serif;
        font-weight: 500;
        &:visited {
            color: white;
        }
    }
`;

const Credits = ({ ...props }) => {
    const data = useStaticQuery(graphql`
        {
            prismicCredits {
                data {
                    content {
                        html
                    }
                    title {
                        text
                    }
                }
            }
        }
    `);
    return (
        <SectionContainer index={6} title={"Credits"}>
            <Container>
                <Inner>
                    <Content
                        dangerouslySetInnerHTML={{
                            __html: data.prismicCredits.data.content.html,
                        }}
                    />
                </Inner>
            </Container>
        </SectionContainer>
    );
};

export default Credits;
