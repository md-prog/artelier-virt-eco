import React, { createRef, useEffect, useLayoutEffect, useRef } from "react";
import styled from "@emotion/styled";
import { css, Global } from "@emotion/core";
import gsap from "gsap";
import deepLink, { deepLinkByID } from "../../util/deepLink";
import { useArticle } from "../Platform/ArticleContext";
import { respond } from "../../styles/responsive";

const Container = styled.div`
    position: fixed;
    z-index: 9;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    display: none;
    flex-direction: column;
    justify-content: center;
    background-color: black;
    opacity: 0;
    padding-top: 65px;
`;
const Nav = styled.nav`
    text-transform: uppercase;
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
`;
const SmallMenuItem = styled.a`
    font-family: FoundryGridnik, sans-serif;
    letter-spacing: 0.25em;
    ${respond(12, 20, "px", "fontSize", 420, 1800, "vmin")};
    margin: 32px 0;
    ${respond(10, 32, "px", "marginTop", 420, 1800, "vmin", false)};
    ${respond(10, 32, "px", "marginBottom", 420, 1800, "vmin", false)};
    cursor: pointer;
    opacity: 0;
`;
const LargeMenuItem = styled.a`
    font-family: "Plaak", sans-serif;
    ${respond(40, 100, "px", "fontSize", 420, 1800, "vmin", false)};
    //letter-spacing: 0.05em;
    ${respond(10, 32, "px", "marginTop", 420, 1800, "vmin", false)};
    ${respond(10, 32, "px", "marginBottom", 420, 1800, "vmin", false)};
    cursor: pointer;
    opacity: 0;
`;
const HomeLink = styled.a`
    font-family: FoundryGridnik, sans-serif;
    ${respond(14, 19, "px", "fontSize", 420, 1800, "vmin", false)};
    opacity: 0.6;
    position: absolute;
    ${respond(15, 38, "px", "bottom", 420, 1800, "vmin", false)};
    ${respond(20, 60, "px", "right", 420, 1800, "vmin", false)};
    text-transform: uppercase;
    cursor: pointer;
`;

const Menu = ({ state, setState }) => {
    const ref = useRef();
    const timeline = useRef();
    const { map } = useArticle();
    const itemsRef = useRef([
        createRef(),
        createRef(),
        createRef(),
        createRef(),
        createRef(),
        createRef(),
        createRef(),
    ]);
    const logoRef = useRef();

    useLayoutEffect(() => {
        if (!timeline.current) {
            let _timeline = gsap.timeline({
                paused: true,
                defaults: { ease: "linear" },
            });
            timeline.current = gsap.timeline({ paused: true });
            _timeline.to(ref.current, 0.01, { display: "none" });
            _timeline.to(ref.current, 0.01, { display: "flex" });
            _timeline.to(ref.current, 0.2, {
                opacity: 1,
            });
            itemsRef.current.forEach(item => {
                _timeline.to(item.current, 0.1, { opacity: 1 }, "-=0.05");
            });
            timeline.current.to(_timeline, _timeline.duration() * 1.2, {
                progress: 1,
                ease: "power1.out",
            });
        }
    }, [ref, timeline, itemsRef, logoRef]);

    useEffect(() => {
        if (timeline.current) {
            if (state === "closed") {
                timeline.current.reverse();
            } else {
                timeline.current.play();
            }
        }
    }, [state]);

    const onClick = slug => {
        return e => {
            e.preventDefault();
            setState("closed");
            deepLink(map, slug);
        };
    };
    const conclusion = id => {
        return e => {
            e.preventDefault();
            setState("closed");
            deepLinkByID(id);
        };
    };
    return (
        <Container state={state} ref={ref}>
            <Nav>
                <SmallMenuItem
                    ref={itemsRef.current[0]}
                    onClick={onClick("introduction")}
                    data-track={"menu-introduction"}
                >
                    Introduction
                </SmallMenuItem>
                <LargeMenuItem
                    ref={itemsRef.current[1]}
                    onClick={onClick("the-marketplaces")}
                    data-track={"menu-the-marketplaces"}
                >
                    The Marketplaces
                </LargeMenuItem>
                <LargeMenuItem
                    ref={itemsRef.current[2]}
                    onClick={onClick("the-population")}
                    data-track={"menu-the-population"}
                >
                    The Population
                </LargeMenuItem>
                <LargeMenuItem
                    ref={itemsRef.current[3]}
                    onClick={onClick("the-workers")}
                    data-track={"menu-the-workers"}
                >
                    The Workers
                </LargeMenuItem>
                <LargeMenuItem
                    ref={itemsRef.current[4]}
                    onClick={onClick("the-underground")}
                    data-track={"menu-the-underground"}
                >
                    The Underground
                </LargeMenuItem>
                <LargeMenuItem
                    ref={itemsRef.current[5]}
                    onClick={onClick("the-pioneers")}
                    data-track={"menu-the-pioneers"}
                >
                    The Pioneers
                </LargeMenuItem>
                <SmallMenuItem
                    ref={itemsRef.current[6]}
                    onClick={conclusion("conclusion")}
                    data-track={"menu-conclusion"}
                >
                    Conclusion
                </SmallMenuItem>
            </Nav>
        </Container>
    );
};

export default Menu;
