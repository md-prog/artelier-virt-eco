import { css } from "@emotion/core";
import addFont from "./addFont";
import LightWoff2 from "../../fonts/Plaak Series 3/Plaak - 23-Pradel-Light-205TF/Plaak - 23-Pradel-Light-205TF.woff2";
import LightWoff from "../../fonts/Plaak Series 3/Plaak - 23-Pradel-Light-205TF/Plaak - 23-Pradel-Light-205TF.woff";
import RegularWoff2 from "../../fonts/Plaak Series 3/Plaak - 33-Pradel-Regular-205TF/Plaak - 33-Pradel-Regular-205TF.woff2";
import RegularWoff from "../../fonts/Plaak Series 3/Plaak - 33-Pradel-Regular-205TF/Plaak - 33-Pradel-Regular-205TF.woff";
import BoldWoff2 from "../../fonts/Plaak Series 3/Plaak - 43-Pradel-Bold-205TF/Plaak - 43-Pradel-Bold-205TF.woff2";
import BoldWoff from "../../fonts/Plaak Series 3/Plaak - 43-Pradel-Bold-205TF/Plaak - 43-Pradel-Bold-205TF.woff";
export default css`
    ${addFont("Plaak", LightWoff2, LightWoff, 300)};
    ${addFont("Plaak", RegularWoff2, RegularWoff, 400)};
    ${addFont("Plaak", BoldWoff2, BoldWoff, 700)};
`;
