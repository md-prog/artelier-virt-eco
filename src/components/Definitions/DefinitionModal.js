import React, { useLayoutEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import gsap from "gsap";
import DrawSVGPlugin from "../../util/DrawSVGPlugin";
import { useResizer } from "../Platform/Resizer";
import { useTheme } from "emotion-theming";
import { useFontObserver } from "../Platform/FontObserver";
import { breakpoints } from "../../styles/responsive";

gsap.registerPlugin(DrawSVGPlugin);
const Container = styled.div`
    position: absolute;
    z-index: 15;
    top: ${({ top, mobile, mobileOffsetY }) =>
        `${mobile ? mobileOffsetY : top}px`};
    ${({ theme }) => breakpoints(theme.position.definition, "gridColumn")};
    justify-self: ${({ theme }) =>
        theme.position.definitionDirection === "left" ? "end" : "start"};
    width: 240px;
    padding: 24px;
    font-size: 12px;
    line-height: 1.4;
    border: 1px solid ${({ theme }) => theme.highlight};
    visibility: hidden;
    transform: translateY(-70px)
        ${({ theme }) =>
            theme.type === "WhiteCaseStudy"
                ? theme.position.definitionDirection === "left"
                    ? `translateX(-20px)`
                    : `translateX(20px)`
                : ""};
    background-color: ${({ theme }) =>
        theme.style === "dark" ? "black" : "white"};

    ${({ mobile, mobileOffsetX }) => {
        if (mobile) {
            return css`
                position: fixed;
                left: ${`${mobileOffsetX}px`};
                transform: translate3d(-50%, -50%, 0);
            `;
        }
    }};
`;
const Header = styled.h3`
    text-decoration: underline;
    margin-bottom: 10px;
    font-size: 18px;
    font-family: FoundryGridnik;
`;
const LineContainer = styled.div`
    height: 24px;
    //border-top: 1px solid #8c17ff;
    position: absolute;
    left: ${({ left }) => `${left}px`};
    top: ${({ top }) => `${top}px`};
    z-index: 4;
    width: ${({ width = 300 }) => `${width}px`};
    pointer-events: none;
    display: ${({ mobile }) => (mobile ? "none" : "block")};
`;
const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: ${({ mobile }) => (mobile ? "block" : "none")};
    z-index: 14;
`;
const Content = styled.div``;

const DefinitionModal = ({
    word,
    content,
    position,
    atTop,
    basePosition,
    visible = false,
    setVisible,
    id,
}) => {
    const [modalPosition, setModalPosition] = useState({ left: 0, right: 0 });
    const fontResized = useFontObserver();
    const [mobile, setMobile] = useState(false);
    const {
        position: { definitionDirection },
        highlight,
    } = useTheme();
    const ref = useRef();
    const { area } = useResizer();
    const path1Ref = useRef();
    const path2Ref = useRef();
    const path3Ref = useRef();
    const path4Ref = useRef();
    const timeline = useRef();
    const mobileTimeline = useRef();
    useLayoutEffect(() => {
        const rect = ref.current.getBoundingClientRect();
        setModalPosition({
            left: rect.left + window.scrollX,
            right: rect.right + window.scrollX,
        });
        if (area.width <= 1024) {
            setMobile(true);
        } else {
            setMobile(false);
        }
    }, [ref, area, fontResized]);

    useLayoutEffect(() => {
        let _timeline = {};
        let masterTimeline = {};
        if (!timeline.current) {
            _timeline = gsap.timeline({
                paused: true,
                defaults: { ease: "linear" },
            });
            _timeline.from(path1Ref.current, 1, { drawSVG: 0 }, 0);
            _timeline.from(path2Ref.current, 1, { drawSVG: 0 }, 0);
            if (atTop) {
                _timeline.from(path3Ref.current, 2, { drawSVG: 0 });
            } else {
                _timeline.from(path4Ref.current, 2, { drawSVG: 0 });
            }
            _timeline.fromTo(
                ref.current,
                2,
                { opacity: 0, visibility: "hidden" },
                { opacity: 1, visibility: "visible" }
            );
            masterTimeline = gsap.timeline({ paused: true });
            masterTimeline.to(_timeline, 0.5, { progress: 1, ease: "linear" });
            timeline.current = masterTimeline;
        }
        if (!mobileTimeline.current) {
            mobileTimeline.current = gsap.timeline({ paused: true });
            mobileTimeline.current.fromTo(
                ref.current,
                0.2,
                { opacity: 0, visibility: "hidden" },
                { opacity: 1, visibility: "visible" }
            );
        }

        return () => {
            if (timeline.current) {
                timeline.current.pause();
            }
            if (mobileTimeline.current) {
                mobileTimeline.current.pause();
            }
        };
    }, [path1Ref, path2Ref, path3Ref, path4Ref, ref, atTop]);

    useLayoutEffect(() => {
        if (timeline.current && area.width > 1024) {
            if (visible) {
                timeline.current.play();
            } else {
                timeline.current.reverse();
            }
        }
        if (mobileTimeline.current && area.width <= 1024) {
            if (visible) {
                mobileTimeline.current.play();
            } else {
                mobileTimeline.current.reverse();
            }
        }
    }, [timeline, visible, area, mobileTimeline]);
    const width =
        definitionDirection === "right"
            ? Math.round(Math.abs(modalPosition.left - position.left + 2))
            : Math.abs(
                  modalPosition.right - position.left - position.width - 2
              );
    const svgLeft =
        definitionDirection === "right"
            ? position.left - basePosition.left - 2
            : modalPosition.right - basePosition.left;
    return (
        <>
            {visible && (
                <Overlay
                    mobile={mobile}
                    onClick={() => {
                        setVisible(id, false);
                    }}
                />
            )}
            <Container
                ref={ref}
                top={position.top - basePosition.top}
                mobileOffsetY={window.innerHeight / 2}
                mobileOffsetX={window.innerWidth / 2}
                mobile={mobile}
            >
                <Header>{word}</Header>
                <Content>{content}</Content>
            </Container>
            <LineContainer
                width={width}
                top={position.top - basePosition.top - 15}
                left={svgLeft}
                mobile={mobile}
            >
                {definitionDirection === "right" ? (
                    <svg
                        css={{ overflow: "visible" }}
                        width={Math.abs(width)}
                        height={24}
                        viewBox={`0 0 ${width} 20`}
                        // preserveAspectRatio={`none`}
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            ref={path1Ref}
                            fill={"none"}
                            stroke={highlight}
                            strokeWidth={"2px"}
                            d={`M 0 24 l 0 -12 l ${Math.round(position.width) /
                                2 +
                                2} 0`}
                        />
                        <path
                            ref={path2Ref}
                            fill={"none"}
                            stroke={highlight}
                            strokeWidth={"2px"}
                            d={`M ${Math.round(position.width) +
                                4} 24 l 0 -12 l -${Math.round(position.width) /
                                2 +
                                3} 0`}
                        />
                        {atTop ? (
                            <path
                                ref={path3Ref}
                                fill={"none"}
                                stroke={highlight}
                                strokeWidth={"2px"}
                                d={`M ${Math.round(position.width) /
                                    2} 12 l 0 -12 L ${width} 0`}
                            />
                        ) : (
                            <path
                                ref={path4Ref}
                                fill={"none"}
                                stroke={highlight}
                                strokeWidth={"2px"}
                                d={`M ${Math.round(
                                    position.width
                                )} 12 L ${width} 12`}
                            />
                        )}
                    </svg>
                ) : (
                    <svg
                        css={{ overflow: "visible" }}
                        width={Math.abs(width)}
                        height={24}
                        viewBox={`0 0 ${width} 20`}
                        // preserveAspectRatio={`none`}
                        xmlns="http://www.w3.org/2000/svg"
                        shapeRendering="crispEdges"
                    >
                        <path
                            ref={path1Ref}
                            fill={"none"}
                            stroke={highlight}
                            strokeWidth={"2px"}
                            d={`M ${width -
                                Math.round(position.width) -
                                4} 24 l 0 -12 l ${Math.round(position.width) /
                                2 +
                                2} 0`}
                        />
                        <path
                            ref={path2Ref}
                            fill={"none"}
                            stroke={highlight}
                            strokeWidth={"2px"}
                            d={`M ${width} 24 l 0 -12 l -${Math.round(
                                position.width
                            ) /
                                2 +
                                3} 0`}
                        />
                        {atTop ? (
                            <path
                                ref={path3Ref}
                                fill={"none"}
                                stroke={highlight}
                                strokeWidth={"2px"}
                                d={`M ${width -
                                    (Math.round(position.width) + 4) /
                                        2} 12 l 0 -12 L 0 0`}
                            />
                        ) : (
                            <path
                                ref={path4Ref}
                                fill={"none"}
                                stroke={highlight}
                                strokeWidth={"2px"}
                                d={`M ${width -
                                    Math.round(position.width) -
                                    4} 12 L 0 12`}
                            />
                        )}
                    </svg>
                )}
            </LineContainer>
        </>
    );
};

export default DefinitionModal;
