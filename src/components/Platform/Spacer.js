import React from "react";
import styled from "@emotion/styled";

const Container = styled.div`
    grid-template-columns: repeat(48, 1fr);
    grid-column: 1/49;
    width: 100%;
    display: grid;
    margin-bottom: ${({ height }) => (height ? `${height}px` : 0)};
    position: relative;
`;
const Spacer = ({ data, children }) => {
    const height = data ? data.primary.height : 0;
    return <Container height={height}>{children}</Container>;
};

export default Spacer;
