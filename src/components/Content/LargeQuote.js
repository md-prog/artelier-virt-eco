import React from "react";
import styled from "@emotion/styled";
import { breakpoints, respond } from "../../styles/responsive";
const Container = styled.div`
    ${({ size, theme }) =>
        breakpoints(theme.position.largeQuote, "gridColumn")};

    padding-right: 0.2em;
    ${respond(100, 420, "px", "paddingTop")}
    ${respond(100, 420, "px", "paddingBottom")}
    blockquote {
        width: 80%;
        max-width: 1440px;
        margin: 0 auto;
        font-family: FoundryGridnik, sans-serif;
        p {
            display: inline;
            background-color: white;
            box-decoration-break: clone;
            -webkit-box-decoration-break: clone;
            padding: 0 0.2em;
            color: black;
            ${({ size, theme }) =>
                respond(
                    theme.largeQuoteFontSize.min,
                    theme.largeQuoteFontSize.max
                )};
            ${({ theme }) =>
                respond(
                    theme.largeQuoteFontSize.min * 1.22,
                    theme.largeQuoteFontSize.max * 1.22,
                    "px",
                    "lineHeight"
                )};
        }
    }
`;
const LargeQuote = ({ data }) => {
    return (
        <Container>
            <blockquote
                dangerouslySetInnerHTML={{ __html: data.content.html }}
            />
        </Container>
    );
};

export default LargeQuote;
