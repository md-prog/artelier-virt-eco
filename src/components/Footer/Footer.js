import React, { useState } from "react";
import styled from "@emotion/styled";
import { respond } from "../../styles/responsive";
import Form from "./Form";
import Logo from "../Navigation/Logo";

const Container = styled.div`
    width: 100%;
    background-color: #1b1b1b;

    z-index: 2;
    position: relative;
    color: white;
    ${respond(47, 128, "px", "paddingTop")};
    ${respond(47, 128, "px", "paddingBottom")};
    ${respond(60, 187, "px", "paddingLeft", 1200)};
    ${respond(60, 187, "px", "paddingRight", 1200)};

    font-family: FoundryGridnik, sans-serif;
`;
const FooterContent = styled.div`
    width: 100%;
    max-width: 1800px;
    display: flex;

    flex-direction: column-reverse;
    margin: 0 auto;
    align-items: center;

    @media screen and (min-width: 1024px) {
        flex-direction: row;
        align-items: flex-end;
    }
`;
const FooterContentContainer = styled.div`
    flex: ${({ flex = null }) => flex};
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    @media screen and (min-width: 450px) {
        flex-direction: row;
    }
    @media screen and (min-width: 1024px) {
        align-items: flex-end;
        justify-content: ${({ justify = null }) => justify};
    }
`;
const Copyright = styled.div`
    font-size: 14px;
    font-family: "IBM Plex Sans", sans-serif;
    opacity: 0.6;
    margin-bottom: 2px;
    margin-top: 8px;
    @media screen and (min-width: 450px) {
        margin-top: 0;
    }
`;
const FooterLinks = styled.div`
    display: flex;
    flex-direction: column;
    text-align: center;
    @media screen and (min-width: 768px) {
        flex-direction: row;
        flex-flow: row wrap;
        text-align: right;
        margin-bottom: 0;
        margin-top: 0;
    }
    @media screen and (min-width: 1400px) {
    }
`;
const FooterLink = styled.a`
    text-transform: uppercase;
    text-decoration: underline;
    color: white;
    display: block;
    letter-spacing: 0.09em;
    font-weight: 500;
    ${respond(14, 16)};
    margin-bottom: 34px;
    ${respond(31, 66, "px", "marginLeft", 1024)};
    margin-left: 0;
    @media screen and (min-width: 768px) {
        margin-left: 31px;
    }
    &:first-of-type {
        margin-left: 0;
    }
    @media screen and (min-width: 1024px) {
        margin-bottom: 0;
    }

    &:visited {
        color: white;
    }
`;
const Footer = () => {
    return (
        <Container>
            <Form />
            <FooterContent>
                <FooterContentContainer>
                    <a href={"/"} css={{ display: "block", lineHeight: 0 }}>
                        <Logo
                            style={{
                                width: "auto",
                                height: "27px",
                                margin: 0,
                                "@media screen and (min-width: 450px)": {
                                    margin: "0 24px 0 0",
                                },
                            }}
                        />
                    </a>
                    <Copyright>
                        Copyright L’Atelier {new Date().getFullYear()}.{" "}
                    </Copyright>
                </FooterContentContainer>

                <FooterContentContainer justify={"flex-end"} flex={"1"}>
                    <FooterLinks>
                        <FooterLink
                            href={"/legal-information"}
                            target={"_blank"}
                        >
                            Legal Information
                        </FooterLink>
                        <FooterLink href={"/cookie-policy"} target={"_blank"}>
                            Cookie Policy
                        </FooterLink>
                        <FooterLink
                            href={"/data-protection-notice"}
                            target={"_blank"}
                        >
                            Data Protection Notice
                        </FooterLink>
                    </FooterLinks>
                </FooterContentContainer>
            </FooterContent>
        </Container>
    );
};

export default Footer;
