import React, { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { isBrowser } from "@emotion/core/src/utils";
import Breadcrumbs from "./Breadcrumbs";
import NavLogo from "./NavLogo";
const Container = styled.div`
    width: 100%;
    border-bottom: 1px solid white;
    background-color: black;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    display: flex;
    text-transform: uppercase;
    font-family: FoundryGridnik, sans-serif;
    font-weight: 500;
    letter-spacing: 0.1em;
    font-size: 17px;
    align-items: stretch;
    transition: transform 0.3s ease-in-out;
    transform: ${({ visible }) =>
        visible ? `translate3d(0, 0, 0)` : `translate3d(0, -100%, 0)`};
    height: 52px;
    @media screen and (min-width: 1100px) {
        height: auto;
    }
`;

const LogoContainer = styled.div`
    display: flex;
    align-items: center;
    flex: 1;
    justify-content: center;
    margin-left: 68px;
    @media screen and (min-width: 1100px) {
        flex: auto 0 1;
        margin-left: 0;
    }
`;

const Burger = styled.button`
    width: 68px;
    border: none;

    position: relative;
    cursor: pointer;
    background-color: black;
    outline: 0;
    @media screen and (min-width: 1100px) {
        border-left: 1px solid white;
    }
`;
const BurgerSquare = styled.div`
    width: 8px;
    height: 8px;
    border: 1px solid white;
    position: absolute;
    top: 50%;
    left: 50%;
    transition: transform 0.3s ease-in-out;
    ${({ position = "middle", state = "closed", hover = false }) => {
        if (state === "closed") {
            switch (position) {
                case "top":
                    return css`
                        transform: translate3d(-200%, ${hover ? 0 : -50}%, 0);
                    `;
                case "middle":
                    return css`
                        transform: translate3d(-50%, -50%, 0);
                    `;
                case "bottom":
                default:
                    return css`
                        transform: translate3d(100%, ${hover ? -100 : -50}%, 0);
                    `;
            }
        } else {
            switch (position) {
                case "top":
                    return css`
                        transform: translate3d(-200%, ${hover ? 50 : 100}%, 0);
                    `;
                case "middle":
                    return css`
                        transform: translate3d(-50%, -50%, 0);
                    `;
                case "bottom":
                default:
                    return css`
                        transform: translate3d(
                            100%,
                            ${hover ? -150 : -200}%,
                            0
                        );
                    `;
            }
        }
    }};
`;

const NavBar = ({ state = "open", setState }) => {
    const [hover, setHover] = useState(false);
    const [visible, setVisible] = useState(true);
    const previousY = useRef(0);

    useEffect(() => {
        const onScroll = () => {
            if (state !== "open") {
                if (window.scrollY < 20) {
                    setVisible(true);
                    return;
                }
                if (window.scrollY < previousY.current) {
                    setVisible(true);
                } else {
                    setVisible(false);
                }
            }

            previousY.current = window.scrollY;
        };
        if (isBrowser) {
            window.addEventListener("scroll", onScroll);
        }
        return () => {
            if (isBrowser) {
                window.removeEventListener("scroll", onScroll);
            }
        };
    }, [previousY, state]);

    return (
        <Container visible={visible}>
            <LogoContainer>
                <NavLogo style={{ width: "160px" }} />
            </LogoContainer>
            <Breadcrumbs />
            <Burger
                onMouseOver={() => {
                    setHover(true);
                }}
                onFocus={() => {
                    setHover(true);
                }}
                onBlur={() => {
                    setHover(false);
                }}
                onMouseOut={() => {
                    setHover(false);
                }}
                onClick={() => {
                    setHover(false);
                    setState(prev => {
                        return prev === "closed" ? "open" : "closed";
                    });
                }}
                data-track={"menu-open-close"}
            >
                <BurgerSquare position={"top"} state={state} hover={hover} />
                <BurgerSquare state={state} hover={hover} />
                <BurgerSquare position={"bottom"} state={state} hover={hover} />
            </Burger>
        </Container>
    );
};

export default NavBar;
