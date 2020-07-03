import styled from "@emotion/styled";
import { css } from "@emotion/core";

export const Corner = styled.div`
    position: absolute;
    left: ${({ left }) => (left ? 0 : null)};
    right: ${({ left }) => (!left ? 0 : null)};
    top: ${({ top }) => (top ? 0 : null)};
    bottom: ${({ top }) => (!top ? 0 : null)};
    width: 6px;
    height: 6px;
    z-index: 3;
    background-color: ${({ theme }) => theme.color};
    transition: background-color 0.3s;
    &:before,
    &:after {
        content: " ";
        position: absolute;
        width: 6px;
        height: 6px;
        z-index: 3;
        background-color: ${({ theme }) => theme.color};
        transition: background-color 0.3s;
    }
    &:before {
        top: ${({ top }) => (top ? "-3px" : null)};
        bottom: ${({ top }) => (!top ? "-3px" : null)};
        left: ${({ left }) => (left ? "3px" : null)};
        right: ${({ left }) => (!left ? "3px" : null)};
    }
    &:after {
        top: ${({ top }) => (top ? "3px" : null)};
        bottom: ${({ top }) => (!top ? "3px" : null)};
        left: ${({ left }) => (left ? "-3px" : null)};
        right: ${({ left }) => (!left ? "-3px" : null)};
    }
`;
export const Border = styled.div`
    position: absolute;
    ${({ position }) => {
        switch (position) {
            case "top":
                return css`
                    top: -6px;
                    left: 6px;
                    width: calc(100% - 12px);
                    height: 6px;
                `;
            case "left":
                return css`
                    top: 6px;
                    left: -6px;
                    height: calc(100% - 12px);
                    width: 6px;
                `;
            case "right":
                return css`
                    top: 6px;
                    right: -6px;
                    height: calc(100% - 12px);
                    width: 6px;
                `;
            case "bottom":
            default:
                return css`
                    bottom: -6px;
                    left: 6px;
                    width: calc(100% - 12px);
                    height: 6px;
                `;
        }
    }};
    transition: background-color 0.3s;
    background-color: ${({ theme }) => theme.color};
`;
