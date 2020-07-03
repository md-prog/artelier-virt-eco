import { css } from "@emotion/core";
import addFont from "./addFont";
import MediumWoff2 from "../../fonts/Foundry Gridnik/FoundryGridnik-Medium.woff2";
import MediumWoff from "../../fonts/Foundry Gridnik/FoundryGridnik-Medium.woff";
import RegularWoff2 from "../../fonts/Foundry Gridnik/FoundryGridnik-Regular.woff2";
import RegularWoff from "../../fonts/Foundry Gridnik/FoundryGridnik-Regular.woff";
import { isBrowser } from "@emotion/core/src/utils";
if (process.env.NODE_ENV === "production" && isBrowser) {
    fetch("//hello.myfonts.net/count/3b1dd3").then(
        () => {},
        () => {}
    );
}
export default css`
    ${addFont("FoundryGridnik", MediumWoff2, MediumWoff, 500)};
    ${addFont("FoundryGridnik", RegularWoff2, RegularWoff, 400)};
`;
