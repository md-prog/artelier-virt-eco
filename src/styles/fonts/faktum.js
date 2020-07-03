import { css } from "@emotion/core";
import addFont from "./addFont";
import RegularWoff2 from "../../fonts/Faktum/faktum-regular.woff2";
import RegularWoff from "../../fonts/Faktum/faktum-regular.woff";
import SemiBoldWoff2 from "../../fonts/Faktum/faktum-semibold.woff2";
import SemiBoldWoff from "../../fonts/Faktum/faktum-semibold.woff";
export default css`
    ${addFont("Faktum", RegularWoff2, RegularWoff, 400)};
    ${addFont("Faktum", SemiBoldWoff2, SemiBoldWoff, 600)};
`;
