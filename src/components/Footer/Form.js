import React, { useState } from "react";
import styled from "@emotion/styled";
import { respond } from "../../styles/responsive";
import fetchJsonp from "../../util/fetchJsonp";
import { track } from "../../util/analytics";
import Spinner from "./Spinner";
import TickSvg from "../../images/tick.svg";
const SINGLE_COLUMN = "768px";
const Wrapper = styled.div`
    width: 100%;
    max-width: 1800px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    ${respond(37, 40, "px", "paddingBottom")};

    @media screen and (min-width: 1080px) {
        align-items: flex-start;
        flex-direction: row;
    }
`;
const Title = styled.h2`
    font-family: Plaak, sans-serif;
    line-height: 0.92;
    letter-spacing: 0.02em;
    font-weight: 700;
    text-transform: uppercase;
    ${respond(52, 80)};
    margin-bottom: 40px;
    text-align: center;
    flex: 1;

    @media screen and (min-width: ${SINGLE_COLUMN}) {
        text-align: left;
        width: 606px;
    }
    @media screen and (min-width: 1080px) {
        margin-bottom: 0;
        width: auto;
        text-align: left;
    }
`;
const HtmlForm = styled.form`
    width: 100%;
    position: relative;

    @media screen and (min-width: ${SINGLE_COLUMN}) {
        width: 606px;
    }
    @media screen and (min-width: 1080px) {
        margin-left: 137px;
        width: 638px;
    }
`;
const SuccessMessage = styled.div`
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    position: absolute;

    display: ${({ show }) => (show ? "flex" : "none")};
    align-items: center;
    justify-content: center;
    letter-spacing: 0.065em;
    ${respond(22, 50, "px", "paddingLeft")};
    ${respond(22, 50, "px", "paddingRight")};
`;
const SuccessMessageText = styled.div`
    text-align: center;
    text-transform: uppercase;
    font-family: FoundryGridnik, sans-serif;
    font-weight: 500;
    ${respond(18, 20)};
    line-height: 1.18;
`;
const Input = styled.input`
    ${respond(16, 20)};
    font-family: FoundryGridnik, sans-serif;
    font-weight: 500;
    appearance: none;
    background: white;
    border: 0;
    padding: 15px 30px;
    width: 100%;
    box-sizing: border-box;
    @media screen and (min-width: 1400px) {
        padding: 15px 30px 15px;
    }

    &::placeholder {
        text-transform: uppercase;
        color: #b3b3b3;
    }
`;
const Submit = styled.button`
    color: white;
    border: 1px solid white;
    padding: 0;

    text-transform: uppercase;
    font-family: FoundryGridnik, sans-serif;
    font-weight: 500;
    letter-spacing: 0.065em;
    background: black;
    ${respond(56, 62, "px", "height")};
    ${respond(16, 18)};
    align-self: flex-end;
    cursor: pointer;
    grid-area: submit;
    position: relative;
    justify-self: flex-start;
    width: 100%;
    @media screen and (min-width: ${SINGLE_COLUMN}) {
        width: 263px;
        margin-top: 5px;
    }
    @media screen and (min-width: 1400px) {
        justify-self: flex-end;
    }
`;
const Label = styled.label`
    font-size: 14px;
    color: white;
    text-transform: uppercase;
    margin-bottom: 10px;
    font-family: "IBM Plex Sans", sans-serif;
    position: relative;
`;

const RadioGroupLabel = styled.div`
    font-size: 14px;
    color: white;
    text-transform: uppercase;
    margin-bottom: 17px;
    font-family: "IBM Plex Sans", sans-serif;
    @media screen and (min-width: ${SINGLE_COLUMN}) {
        margin-bottom: 8px;
    }
`;
const Terms = styled.div`
    visibility: ${({ show }) => (show ? "visible" : "hidden")};
    margin-top: 24px;
    font-size: 14px;
    line-height: 1.25;
    a {
        color: white;
        &:visited {
            color: white;
        }
    }
    text-align: center;
    @media screen and (min-width: ${SINGLE_COLUMN}) {
        text-align: left;
    }
`;
const InputContainer = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: stretch;
`;
const EmailContainer = styled(InputContainer)`
    grid-area: email;
`;
const LanguageContainer = styled(InputContainer)`
    grid-area: language;
`;
const FormContent = styled.div`
    display: grid;
    visibility: ${({ show }) => (show ? "visible" : "hidden")};
    grid-column-gap: 24px;
    grid-row-gap: 24px;
    grid-template-rows: auto;
    grid-template-columns: auto;
    grid-template-areas: "email" "language" "submit";
    @media screen and (min-width: ${SINGLE_COLUMN}) {
        grid-template-columns: auto auto;
        grid-template-rows: auto auto;
        grid-template-areas: "email email" "language submit";
    }
`;
const RadioContainer = styled.label`
    cursor: pointer;
    display: block;
    margin-bottom: 15px;
    &:last-of-type {
        margin-bottom: 0;
    }
    @media screen and (min-width: ${SINGLE_COLUMN}) {
        margin-bottom: 0;
    }
`;
const RadioGroup = styled.div`
    display: flex;
    position: relative;
    align-items: flex-start;
    flex-direction: column;
    @media screen and (min-width: ${SINGLE_COLUMN}) {
        flex-direction: row;
    }
`;
const RadioLabel = styled.div`
    color: white;
    font-size: 18px;
    font-family: FoundryGridnik, sans-serif;
    font-weight: 500;
    letter-spacing: 0.065em;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    margin-right: 35px;

    &::before {
        content: "";
        background: none;
        border: 1px solid white;
        padding: 14px;
        display: inline-block;
        transition: background-color 0.2s ease;
    }

    &::after {
        content: "";
        display: inline-block;
        position: absolute;
        width: 28px;
        height: 28px;
        top: 1px;
        left: 1px;
        opacity: 0;
        transition: opacity 0.2s ease;
        background-image: url(${TickSvg});
        background-position: center center;
        background-repeat: no-repeat;
    }
`;
const HiddenRadio = styled.input`
    opacity: 0;
    position: absolute;
    &:checked + ${RadioLabel} {
        &::before {
            background: white;
        }
        &::after {
            opacity: 1;
        }
    }
`;

const LanguageLabel = styled.span`
    display: inline-block;
    margin-left: 16px;
`;

const ErrorMessage = styled.div`
    text-align: center;
    ${respond(16, 20)};
`;

const Form = () => {
    const [submitted, setSubmitted] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [invalid, setInvalid] = useState(false);
    const [loading, setLoading] = useState(false);
    const [hasContent, setHasContent] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [languageNotSelected, setLanguageNotSelected] = useState(false);
    const submitForm = e => {
        e.preventDefault();
        if (submitted) {
            return;
        }
        const numLanguagesSelected = e.currentTarget.querySelectorAll(
            "input[type=checkbox]:checked"
        ).length;
        if (numLanguagesSelected === 0) {
            setLanguageNotSelected(true);
            return;
        }
        setSubmitted(true);
        setLoading(true);
        let data = new FormData(e.currentTarget);
        let action = e.currentTarget.getAttribute("action");
        let params = new URLSearchParams([...data]);
        fetchJsonp(`${action}?${params.toString()}`, {
            jsonpCallback: "c",
        })
            .then(response => response.json())
            .then(
                response => {
                    const { msg, result } = response;
                    if (
                        result === "success" ||
                        msg.includes("is already subscribed")
                    ) {
                        setSuccess(true);
                    } else if (
                        msg.includes("Please enter a different email address")
                    ) {
                        setInvalid(true);
                        setSubmitted(false);
                    } else {
                        setError(true);
                    }
                    setLoading(false);
                    track({ event: "SubscribeFormSubmitted" });
                },
                error => {
                    setError(true);
                }
            );
    };
    return (
        <Wrapper>
            <Title>Sign up for the latest news & insights</Title>
            <HtmlForm
                action="https://gladeye.us4.list-manage.com/subscribe/post-json"
                method="POST"
                onSubmit={submitForm}
            >
                <input
                    type="hidden"
                    name="u"
                    value="f7204e697ebd16299ab45914d"
                />
                <input type="hidden" name="id" value="2d90c08c90" />
                <input type="hidden" name="TYPE" value="VE" />
                <SuccessMessage show={submitted && (success || error)}>
                    <SuccessMessageText>
                        {success
                            ? "Please check your email to confirm your subscription."
                            : "There was an issue submitting your details. Please try again."}
                    </SuccessMessageText>
                </SuccessMessage>
                <FormContent show={!success && !error}>
                    <EmailContainer>
                        {languageNotSelected ? (
                            <ErrorMessage>
                                Please select a language
                            </ErrorMessage>
                        ) : null}
                        <Label htmlFor={"email"}>Email</Label>
                        <Input
                            id={"email"}
                            type={"email"}
                            required={true}
                            name={"MERGE0"}
                            placeholder={"Enter your email"}
                            onFocus={e => {
                                setIsFocused(true);
                            }}
                            onBlur={e => {
                                setIsFocused(false);
                            }}
                            onChange={e => {
                                setHasContent(!!e.currentTarget.value);
                            }}
                        />
                    </EmailContainer>
                    <LanguageContainer>
                        <RadioGroupLabel>Select Language(s)</RadioGroupLabel>
                        <RadioGroup>
                            <RadioContainer htmlFor={"language-fr"}>
                                <HiddenRadio
                                    type={"checkbox"}
                                    name={"group[71354][1]"}
                                    value={"1"}
                                    id={"language-fr"}
                                    onChange={() => {
                                        setLanguageNotSelected(false);
                                    }}
                                />
                                <RadioLabel>
                                    <LanguageLabel>FRENCH</LanguageLabel>
                                </RadioLabel>
                            </RadioContainer>
                            <RadioContainer htmlFor={"language-en"}>
                                <HiddenRadio
                                    type={"checkbox"}
                                    name={"group[71354][2]"}
                                    value={"1"}
                                    id={"language-en"}
                                    onChange={() => {
                                        setLanguageNotSelected(false);
                                    }}
                                />
                                <RadioLabel>
                                    <LanguageLabel>ENGLISH</LanguageLabel>
                                </RadioLabel>
                            </RadioContainer>
                        </RadioGroup>
                    </LanguageContainer>
                    <Submit>
                        <Spinner visible={loading} />
                        <span
                            css={{
                                visibility:
                                    !loading && !error && !success
                                        ? "visible"
                                        : "hidden",
                            }}
                        >
                            Submit
                        </span>
                    </Submit>
                </FormContent>

                <Terms show={!submitted}>
                    Your e-mail address is used to send you newsletters and
                    marketing information on L’Atelier. You can unsubscribe at
                    any time by using the unsubscribe link in our emails. More
                    information about the management of your personal data and
                    your rights can be found in our{" "}
                    <a href={"/data-protection-notice"} target={"_blank"}>
                        Data Protection Notice
                    </a>
                    .
                </Terms>
            </HtmlForm>
        </Wrapper>
    );
};

export default Form;
