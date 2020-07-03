import { css } from "@emotion/core";
/*
IBM Sans
*/
import RegularWoff from "../../fonts/IBM-Plex/ibm-plex-sans-v7-latin-regular.woff";
import RegularWoff2 from "../../fonts/IBM-Plex/ibm-plex-sans-v7-latin-regular.woff2";
import BoldWoff from "../../fonts/IBM-Plex/ibm-plex-sans-v7-latin-500.woff";
import BoldWoff2 from "../../fonts/IBM-Plex/ibm-plex-sans-v7-latin-500.woff2";
import ItalicWoff from "../../fonts/IBM-Plex/ibm-plex-sans-v7-latin-italic.woff";
import ItalicWoff2 from "../../fonts/IBM-Plex/ibm-plex-sans-v7-latin-italic.woff2";
/*
 * IBM Serif
 * */
import SerifRegularWoff from "../../fonts/IBM-Plex/ibm-plex-serif-v8-latin-regular.woff";
import SerifRegularWoff2 from "../../fonts/IBM-Plex/ibm-plex-serif-v8-latin-regular.woff2";
import SerifBoldWoff from "../../fonts/IBM-Plex/ibm-plex-serif-v8-latin-500.woff";
import SerifBoldWoff2 from "../../fonts/IBM-Plex/ibm-plex-serif-v8-latin-500.woff2";

/*
FoundryGridnik
* */

export default css`
    /* ibm-plex-sans-regular - latin */
    @font-face {
        font-family: "IBM Plex Sans";
        font-style: normal;
        font-weight: 400;
        src: local("IBM Plex Sans"), local("IBMPlexSans"),
            url("${RegularWoff2}") format("woff2"),
                url("${RegularWoff}") format("woff"); 
    }

    /* ibm-plex-sans-italic - latin */
    @font-face {
        font-family: "IBM Plex Sans";
        font-style: italic;
        font-weight: 400;
        src: local("IBM Plex Sans Italic"), local("IBMPlexSans-Italic"),
            url("${ItalicWoff2}") format("woff2"),
            url("${ItalicWoff}") format("woff"); 
    }

    /* ibm-plex-sans-500 - latin */
    @font-face {
        font-family: "IBM Plex Sans";
        font-style: normal;
        font-weight: 500;
        src: local("IBM Plex Sans Medium"), local("IBMPlexSans-Medium"),
            url("${BoldWoff2}") format("woff2"),
            url("${BoldWoff}") format("woff"); 
    }
    
     @font-face {
        font-family: "IBM Plex Serif";
        font-style: normal;
        font-weight: 400;
        src: local("IBM Plex Serif"), local("IBMPlexSerif"),
            url("${SerifRegularWoff2}") format("woff2"),
                url("${SerifRegularWoff}") format("woff"); 
    }
    
    @font-face {
        font-family: "IBM Plex Serif";
        font-style: normal;
        font-weight: 500;
        src: local("IBM Plex Serif Medium"), local("IBMPlexSerif-Medium"),
            url("${SerifBoldWoff2}") format("woff2"),
            url("${SerifBoldWoff}") format("woff"); 
    }
    
`;
