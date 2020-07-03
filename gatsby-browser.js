/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

// You can delete this file if you're not using it
import { hydrate, render } from "react-dom";
import { loadableReady } from "@loadable/component";
import Layout from "./src/components/PageLayout";
import React from "react";

export const replaceHydrateFunction = () => (element, container, callback) => {
    if (process.env.NODE_ENV === "production") {
        loadableReady(() => {
            hydrate(element, container, callback);
        });
    } else {
        render(element, container, callback);
    }
};

export const wrapPageElement = ({ element, props }) => {
    return <Layout {...props}>{element}</Layout>;
};

const transitionDelay = 300;
export const shouldUpdateScroll = ({
    routerProps: { location },
    getSavedScrollPosition,
}) => {
    if (location.action === "PUSH") {
        window.setTimeout(() => window.scrollTo(0, 0), transitionDelay);
    } else {
        const savedPosition = getSavedScrollPosition(location);
        window.setTimeout(
            () => window.scrollTo(...(savedPosition || [0, 0])),
            transitionDelay
        );
    }
    return false;
};

const scrollTo = id => () => {
    const el = document.querySelector(id);
    if (el) {
        let rect = el.getBoundingClientRect();
        return window.scrollTo(
            0,
            rect.top + window.scrollY + (rect.height - window.innerHeight) / 2
        );
    }
    return false;
};

export const onRouteUpdate = ({ location: { hash } }) => {
    if (hash) {
        window.setTimeout(scrollTo(hash), 10);
    }
};
