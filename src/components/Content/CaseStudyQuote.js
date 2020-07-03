import React, { useLayoutEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { useResizer } from "../Platform/Resizer";
import { useFontObserver } from "../Platform/FontObserver";
import { useTheme } from "emotion-theming";
import { breakpoints, respond } from "../../styles/responsive";
const borderWidth = 12;
const Container = styled.div`
    position: relative;
    ${({ theme }) => breakpoints(theme.position.smallQuote, "gridColumn")};
    padding: 56px;
    background-color: white;
    border: 1px solid black;
    border-bottom: 0;
    box-sizing: border-box;
    margin: 56px 0;
    &:after {
        content: " ";
        position: absolute;
        bottom: -${borderWidth}px;
        left: -1px;
        height: ${borderWidth}px;
        right: -1px;
        border: 1px solid black;
        background-color: white;
    }
    @media screen and (min-width: 800px) {
        padding: 56px;
        background: none;
        border: none;
        &:after {
            display: none;
        }
    }
    blockquote {
        position: relative;
        z-index: 2;
        ${({ theme }) =>
            respond(
                theme.smallQuoteFontSize.min,
                theme.smallQuoteFontSize.max
            )};
        line-height: 1.5;
        font-family: "IBM Plex Serif", serif;
        p {
            display: inline;
        }
    }
`;
const Background = styled.div`
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: none;
    @media screen and (min-width: 800px) {
        display: block;
    }
`;
const CaseStudyQuote = ({ data }) => {
    const ref = useRef();
    const theme = useTheme();
    const { area } = useResizer();
    const [rect, setRect] = useState({ width: 100, height: 100 });
    const fontResize = useFontObserver();
    useLayoutEffect(() => {
        let _rect = ref.current.getBoundingClientRect();
        setRect({
            width: Math.round(_rect.width),
            height: Math.round(_rect.height),
        });
    }, [ref, area, fontResize]);
    const { width, height } = rect;
    return (
        <Container ref={ref}>
            <blockquote
                dangerouslySetInnerHTML={{ __html: data.content.html }}
            />
            <Background>
                <svg
                    shapeRendering="crispEdges"
                    css={{ overflow: "visible" }}
                    width={width}
                    height={height}
                    viewBox={`0 0 ${width} ${height}`}
                    // preserveAspectRatio={`none`}
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {theme.side === "right" ? (
                        <path
                            stroke={"black"}
                            strokeWidth="1px"
                            fill={"white"}
                            d={`M ${borderWidth} 0 l ${width -
                                borderWidth} 0 l 0 ${height -
                                borderWidth} l -${width -
                                borderWidth} 0 L ${borderWidth} 0 
                        M ${borderWidth} ${height -
                                borderWidth} l -${borderWidth} ${borderWidth} l ${width -
                                borderWidth} 0 l ${borderWidth} -${borderWidth} 
                        M ${borderWidth} 0 l -${borderWidth} ${borderWidth} l 0 ${height -
                                borderWidth} l ${borderWidth} -${borderWidth}`}
                        />
                    ) : (
                        <path
                            stroke={"black"}
                            strokeWidth="1px"
                            fill={"white"}
                            d={`M 0 0 l ${width - borderWidth} 0 l 0 ${height -
                                borderWidth} l -${width - borderWidth} 0 L 0 0 
                        M 0 ${height -
                            borderWidth} l ${borderWidth} ${borderWidth} L ${width} ${height} l -${borderWidth} -${borderWidth} 
                        M ${width -
                            borderWidth} 0 l ${borderWidth} ${borderWidth} L ${width} ${height} l -${borderWidth} -${borderWidth}`}
                        />
                    )}

                    {/*/>*/}
                </svg>
            </Background>
        </Container>
    );
};

export default CaseStudyQuote;
