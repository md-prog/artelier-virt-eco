import React from "react";
import styled from "@emotion/styled";
const Path = styled.path`
    fill: #ffffff;
`;
const SVG = styled.svg`
    width: 97px;
    margin: 0 24px;
    height: auto;
`;
const Logo = ({ style = {} }) => {
    return (
        <SVG
            css={style}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 24"
        >
            <title>LOGO</title>
            <Path d="M24.77,8.43l-4,12H17.37L22.93,4.38h3.68l5.56,16.09H28.82Z" />
            <Path d="M7.13,4.38H4V20.47h9.72V17.6H7.13Z" />
            <Path d="M30.55,7.26H35.2V20.47h3.19V7.26H43V4.38H30.55Z" />
            <Path d="M48.1,13.72h5.68V10.91H48.1V7.23h6.25V4.38H45V20.47h9.6V17.62H48.1Z" />
            <Path d="M59.65,4.38H56.53V20.47h9.72V17.6h-6.6Z" />
            <Path d="M71.32,4.38H68.2V20.47h3.12Z" />
            <Path d="M76.39,13.72h5.68V10.91H76.39V7.23h6.25V4.38H73.27V20.47h9.6V17.62H76.39Z" />
            <Path d="M13.72,10.8V4.38h3V7.8l-1,3Z" />
            <Path d="M87.7,11.35V7.21h2.48a2.55,2.55,0,0,1,1.74.54,1.9,1.9,0,0,1,.61,1.51,2,2,0,0,1-.61,1.52,2.47,2.47,0,0,1-1.74.57Zm3.06,2.41a5.45,5.45,0,0,0,3.55-1.27,4.28,4.28,0,0,0,1.25-3.28,4.64,4.64,0,0,0-1.38-3.52,5.54,5.54,0,0,0-4-1.31H84.67V20.47h3V14.75l5.15,5.72h4Z" />
        </SVG>
    );
};

export default Logo;
