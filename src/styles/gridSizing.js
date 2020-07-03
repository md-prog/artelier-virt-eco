import { css } from "@emotion/core";

export default function gridSizing(count, properties = []) {
    return css`
        ${properties.reduce(
            (acc, curr) => ({ ...acc, [curr]: `${(100 / 24) * count}vw` }),
            {}
        )};
        @media screen and (min-width: 800px) {
            ${properties.reduce(
                (acc, curr) => ({ ...acc, [curr]: `${(100 / 48) * count}vw` }),
                {}
            )};
        }
        @media screen and (min-width: 1800px) {
            ${properties.reduce(
                (acc, curr) => ({ ...acc, [curr]: `${(1800 / 48) * count}px` }),
                {}
            )};
        }
    `;
}
