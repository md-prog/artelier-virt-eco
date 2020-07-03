import { css } from "@emotion/core";

export default function addFont(
    name,
    woff2,
    woff,
    weight = 400,
    style = "normal"
) {
    return css`
        @font-face {
            font-family: "${name}";
            src: url("${woff2}") format("woff2"),
                url("${woff}") format("woff");
            font-weight: ${weight};
            font-style: ${style};
        }
    `;
}
