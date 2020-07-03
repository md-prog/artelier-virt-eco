import { css } from "@emotion/core";
import addFont from "./addFont";
import Woff2 from "../../fonts/Pixelar/4d8bd4f0-ce40-4f34-a0b8-49bc51024ea8.woff2";
import Woff from "../../fonts/Pixelar/9c200a14-d264-405c-86bf-d27b840e86be.woff";
export default css`
    ${addFont("Pixelar", Woff2, Woff, 400)};
`;
