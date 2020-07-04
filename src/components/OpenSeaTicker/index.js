import React, {
    useCallback,
    useEffect,
    useLayoutEffect,
    useState,
} from "react";
import styled from "@emotion/styled";
import { useArticle } from "../Platform/ArticleContext";
import { isBrowser } from "@emotion/core/src/utils";
import Ticker from "../Ticker";
import uniqBy from "lodash/uniqBy";
import concat from "lodash/concat";
import { bn, getEventParticular, normalizePriceDisplay } from "./helper";
import BigNumber from "bignumber.js";
import { usePageVisibility } from "react-page-visibility";
import { useProgress } from "../ProgressBar/ProgressBarProvider";
const MAX_ADDR_LEN = 6;
const MAX_LABEL_LEN = 15;
const MAX_ASSET_NAME_LEN = 36;
function truncateText(str, maxLength = 5) {
    if (!str || str.length <= maxLength) {
        return str;
    }

    return str.substr(0, maxLength) + "...";
}

function formatAddress(address) {
    return address.substring(2, MAX_ADDR_LEN + 2).toUpperCase();
}

/*
 * Use lodash uniqBy id to make sure it we don't get duplicates
 * */
const Container = styled.div`
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 5;
    transition: transform 0.3s;
    transform: ${({ visible }) =>
        visible ? `translate3d(0,0,0)` : `translate3d(0, 100%, 0)`};
`;
const Inner = styled.div`
    width: 100%;
    height: 50px;
    background-color: white;
    color: black;
`;
const Event = styled.div`
    height: 50px;
    line-height: 50px;
    margin-right: 20px;
`;
const Link = styled.a`
    color: black;
    transition: opacity 0.3s;
    &:visited {
        color: black;
    }
    &:hover {
        opacity: 0.9;
    }
`;

const AddressLink = ({ account, label, address }) => {
    const _label =
        label ||
        (account ? (account.user ? account.user.username : null) : null);
    const _address =
        address || (account && account.address ? account.address : "");

    const displayName = _label
        ? truncateText(_label, MAX_LABEL_LEN)
        : formatAddress(_address);
    return (
        <Link
            href={`https://opensea.io/accounts/${account?.user?.username ||
                _address}`}
            target={"_blank"}
        >
            {displayName}
        </Link>
    );
};

const OpenSeaTicker = () => {
    const { map } = useArticle();
    const [visible, setVisible] = useState(false);
    const [events, setEvents] = useState([]);
    const isVisible = usePageVisibility();
    const { setOffset } = useProgress();
    useEffect(() => {
        const onScroll = () => {
            const scroll = window.scrollY;
            let subSectionName = "";
            for (let i = 0; i < map.length; i++) {
                let section = map[i];
                if (
                    scroll >= section.sectionStart &&
                    scroll <= section.sectionEnd
                ) {
                    for (let j = 0; j < section.sections.length; j++) {
                        let subSection = section.sections[j];
                        if (
                            scroll >= subSection.start &&
                            scroll < subSection.end - window.innerHeight
                        ) {
                            subSectionName = subSection.title;
                            break;
                        }
                    }
                    break;
                }
            }
            if (
                subSectionName &&
                subSectionName.toLowerCase() === "distributed open markets"
            ) {
                setVisible(true);
                setOffset(-50);
            } else {
                setVisible(false);
                setOffset(0);
            }
        };
        if (isBrowser) {
            onScroll();
            window.addEventListener("scroll", onScroll);
        }
        return () => {
            window.removeEventListener("scroll", onScroll);
        };
    }, [map, setVisible, setOffset]);
    const fetchEvents = useCallback(() => {
        fetch("https://api.opensea.io/events/?offset=0", {
            headers: {
                "X-API-KEY": "b22704f150dc4f6c8e6a766e4b7812c1",
            },
        })
            .then(response => response.json())
            .then(response => {
                setEvents(prevState => {
                    return uniqBy(
                        concat(prevState, response.asset_events),
                        "id"
                    );
                });
            });
    }, [setEvents]);
    useEffect(() => {
        let timer;
        if (visible) {
            fetchEvents();
            timer = setInterval(() => {
                fetchEvents();
            }, 15000);
        }

        return () => {
            clearInterval(timer);
        };
    }, [visible, fetchEvents]);

    useEffect(() => {
        if (events.length === 0) {
            fetchEvents();
        }
    }, [fetchEvents, events]);
    useLayoutEffect(() => {
        setOffset(visible && events ? -50 : 0);
    }, [visible, events]);

    return (
        <Container visible={visible && events.length}>
            <Inner>
                {events.length ? (
                    <Ticker
                        speed={10}
                        move={visible && isVisible}
                        height={50}
                        hasNext={index => !!events[index]}
                    >
                        {({ index }) => {
                            if (events[index]) {
                                let event = events[index];
                                const { asset, asset_bundle } = event;
                                let eventParticular = getEventParticular(event);
                                const eventLabel = asset
                                    ? asset.name ||
                                      `${asset.token_name || ""} ${asset &&
                                          asset.token_id &&
                                          asset.token_id.toString()}`
                                    : asset_bundle && asset_bundle.name;
                                const eventLink = asset
                                    ? asset.permalink
                                    : asset_bundle && asset_bundle.permalink;
                                const beginning = !eventParticular.beginningUrl ? (
                                    eventParticular.beginning
                                ) : (
                                    <AddressLink
                                        account={eventParticular.fromAccount}
                                    />
                                );

                                const ending = !eventParticular.endingUrl ? (
                                    eventParticular.ending
                                ) : (
                                    <AddressLink
                                        account={eventParticular.toAccount}
                                    />
                                );

                                const buyerInfo =
                                    eventParticular.winnerAccount &&
                                    !(
                                        eventParticular.winnerAccount ===
                                        eventParticular.fromAccount
                                    ) ? (
                                        <AddressLink
                                            account={
                                                eventParticular.winnerAccount
                                            }
                                        />
                                    ) : null;

                                return (
                                    <Event>
                                        <p className="activity_data--info">
                                            <span
                                                className={`activity_data--label`}
                                            >
                                                {beginning}
                                            </span>{" "}
                                            {eventParticular.label}{" "}
                                            {event &&
                                            event.quantity &&
                                            +event.quantity > 1
                                                ? `${normalizePriceDisplay(
                                                      bn(
                                                          new BigNumber(
                                                              event.quantity
                                                          ),
                                                          event.asset?.decimals
                                                      )
                                                  )} `
                                                : null}
                                            {eventLink ? (
                                                <span>
                                                    <Link
                                                        href={`${eventLink}`}
                                                        target={"_blank"}
                                                    >
                                                        {asset_bundle ? (
                                                            <strong>
                                                                BUNDLE:{" "}
                                                            </strong>
                                                        ) : null}
                                                        <span>
                                                            {eventLabel &&
                                                            eventLabel.length >
                                                                MAX_ASSET_NAME_LEN
                                                                ? eventLabel.substr(
                                                                      0,
                                                                      MAX_ASSET_NAME_LEN
                                                                  ) + "..."
                                                                : eventLabel}
                                                        </span>
                                                    </Link>
                                                </span>
                                            ) : null}
                                            {buyerInfo ? (
                                                <span> to {buyerInfo}</span>
                                            ) : null}
                                            {ending
                                                ? eventParticular.preposition
                                                : null}
                                            <span
                                                className={`activity_data--label`}
                                            >
                                                {ending}
                                            </span>
                                        </p>
                                    </Event>
                                );
                            }
                            return null;
                        }}
                    </Ticker>
                ) : null}
            </Inner>
        </Container>
    );
};

export default OpenSeaTicker;
