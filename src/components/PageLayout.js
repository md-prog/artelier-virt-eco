import React from "react";
import { hot } from "react-hot-loader/root";
import { TransitionGroup, Transition } from "react-transition-group";
import { Global } from "@emotion/core";
import reset from "../styles/reset";
import imbPlex from "../styles/fonts/ibm-plex";
import foundryGridnik from "../styles/fonts/foundry-gridnik";
import plaak from "../styles/fonts/plaak";
import pixelar from "../styles/fonts/pixelar";
import faktum from "../styles/fonts/faktum";
import neueHaasUnica from "../styles/fonts/neue-haas-unica";
import FontObserver from "./Platform/FontObserver";
import Resizer from "./Platform/Resizer";

const timeout = 300;
const getTransitionStyles = {
    entering: {
        position: "absolute",
        opacity: 0,
    },
    entered: {
        transition: `opacity ${timeout}ms ease-in-out`,
        opacity: 1,
    },
    exiting: {
        transition: `all ${timeout}ms ease-in-out`,
        opacity: 0,
    },
};
const Layout = ({ children, location }) => {
    return (
        <div>
            <Global
                styles={[
                    reset,
                    imbPlex,
                    foundryGridnik,
                    pixelar,
                    plaak,
                    faktum,
                    neueHaasUnica,
                    {
                        body: {
                            backgroundColor: "black",
                            color: "white",
                            fontFamily: `"IBM Plex Sans", sans-serif`,
                        },
                    },
                    {
                        "#CybotCookiebotDialog": {
                            "*": {
                                fontFamily: "IBM Plex Sans !important",
                            },
                        },
                    },
                ]}
            />
            <FontObserver>
                <Resizer>
                    <TransitionGroup>
                        <Transition
                            key={location.pathname}
                            timeout={{ enter: timeout, exit: timeout }}
                        >
                            {status => {
                                return (
                                    <div
                                        className={status}
                                        style={{
                                            ...getTransitionStyles[status],
                                        }}
                                    >
                                        {children}
                                    </div>
                                );
                            }}
                        </Transition>
                    </TransitionGroup>
                </Resizer>
            </FontObserver>
        </div>
    );
};
export default process.env.NODE_ENV === "development" ? hot(Layout) : Layout;
