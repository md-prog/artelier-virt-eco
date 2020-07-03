import React from "react";
import RichText from "../components/Content/RichText";
import styled from "@emotion/styled";
import { breakpoints, respond } from "../styles/responsive";
import { linkColor } from "../config/colors";
import gridSizing from "../styles/gridSizing";
const Container = styled.div`
    ${({ theme }) => breakpoints(theme.position.content, "gridColumn")};
    ${gridSizing(2, ["padding"])};
    background-color: ${({ theme }) =>
        theme.mobileBackgroundColor
            ? theme.mobileBackgroundColor
            : theme.backgroundColor};
    @media screen and (min-width: 800px) {
        background-color: ${({ theme }) => theme.backgroundColor};
    }

    p {
        ${({ theme }) =>
            respond(theme.bodyFontSize.min, theme.bodyFontSize.max)};
        margin-bottom: 32px;
        line-height: 1.5;
        .lead {
            font-weight: 500;
            ${respond(16, 26)};
            display: inline-block;
            margin-bottom: 32px;
            line-height: 1.5;
        }
        &:last-of-type {
            margin-bottom: 0;
        }
    }
    h2 {
        ${respond(28, 45)};
        font-family: Plaak, sans-serif;
        text-transform: uppercase;
        margin-bottom: 64px;
        margin-top: 64px;
        &:first-child {
            margin-top: 0;
        }
    }
    h3,
    h4,
    h5,
    h6 {
        ${respond(20, 28)};
        font-family: FoundryGridnik, sans-serif;
        margin-bottom: 15px;
        margin-top: 15px;
        &:first-of-type {
            margin-top: 0;
        }
    }
    ol,
    ul {
        ${({ theme }) =>
            respond(theme.bodyFontSize.min, theme.bodyFontSize.max)};
        list-style: decimal inside;
        li {
            margin-bottom: 10px;
        }
        margin-bottom: 24px;
    }
    a {
        color: ${linkColor};
        text-decoration: none;
        &:visited {
            color: ${linkColor};
        }
    }
    strong {
        font-weight: 500;
    }
    em {
        font-style: italic;
    }
    .super {
        font-size: 75%;
        color: ${({ theme }) => theme.highlight};
        a {
            color: ${({ theme }) => theme.highlight};
            &:visited {
                color: ${({ theme }) => theme.highlight};
            }
        }
        vertical-align: super;
    }
`;
const Text = ({ data: { primary } }) => {
    return (
        <Container>
            <RichText html={primary.text.html} />
        </Container>
    );
};
export default Text;
