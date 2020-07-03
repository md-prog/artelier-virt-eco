import { css } from "@emotion/core";
import addFont from "./addFont";
import RegularWoff2 from "../../fonts/NeueHaasUnica/neuehassunica-regular.woff2";
import RegularWoff from "../../fonts/NeueHaasUnica/neuehassunica-regular.woff";
import BoldWoff2 from "../../fonts/NeueHaasUnica/neuehassunica-bold.woff2";
import BoldWoff from "../../fonts/NeueHaasUnica/neuehassunica-bold.woff";
export default css`
    ${addFont("Neue Haas Unica", RegularWoff2, RegularWoff, 400)};
    ${addFont("Neue Haas Unica", BoldWoff2, BoldWoff, 700)};
`;
