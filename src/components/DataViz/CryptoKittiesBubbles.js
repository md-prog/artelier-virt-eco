/* eslint-disable */
import React, {
    createRef,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from "react";
import data from "../../data/the-marketplaces/crypto-kitties";
import { timeParse, timeFormat, max } from "d3";
import styled from "@emotion/styled";
import { useInView } from "react-intersection-observer";
import mergeRefs from "../../util/mergeRefs";
import { isBrowser } from "@emotion/core/src/utils";
import { gsap } from "gsap";
import { respond } from "../../styles/responsive";
import useResizeObserver from "use-resize-observer/polyfilled";

const Container = styled.div`
    grid-column: 1 / 49;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-items: center;
    @media screen and (min-width: 800px) {
        grid-column: 2 / 48;
    }
    circle {
        vector-effect: non-scaling-stroke;
    }
    .date-label {
        font-weight: 500;
        font-family: FoundryGridnik, sans-serif;
    }
    .volume-label {
        font-family: FoundryGridnik, sans-serif;
        font-weight: 500;
        text-transform: uppercase;
    }
    .info {
        fill: white;
        font-size: 40px;
        alignment-baseline: middle;
        display: none;
        @media screen and (min-width: 800px) {
            display: block;
        }
    }
    .info-bg {
        display: none;
        @media screen and (min-width: 800px) {
            display: block;
        }
    }
    .info-title {
        font-family: FoundryGridnik, sans-serif;
        font-size: 20px;
        font-weight: 500;
        text-transform: uppercase;
    }
    .info-value {
        font-weight: bold;
        font-size: 93px;
        font-family: "Plaak";
        fill: #a243ff;
    }
    .source-title,
    .source-value {
        font-family: FoundryGridnik, sans-serif;
        font-size: 20px;
    }
    .source-title {
        text-transform: uppercase;
    }
    .source-value {
    }
`;

const MobileInfoBox = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 22px 15px;
    width: 100%;
    max-width: 475px;
    margin: 0 auto 0 auto;
    background-color: rgba(0, 0, 0, 0.5);
    @media screen and (min-width: 800px) {
        display: none;
    }
`;
const MobileInfoLabel = styled.div`
    font-size: 12px;
    font-family: FoundryGridnik, sans-serif;
    text-transform: uppercase;
    font-weight: 500;
`;
const MobileInfoValue = styled.div`
    ${respond(25, 35, "px", "fontSize", 320, 400)};
    font-family: Plaak, sans-serif;
    font-weight: bold;
    color: #a243ff;
`;
const MobileInfoStat = styled.div`
    padding: 0 10px;
    width: ${({ relativeWidth }) => relativeWidth};
    flex-grow: 0;
    flex-shrink: 0;
`;
const MobileSpacer = styled.div`
    width: 1px;
    background-color: white;
`;
const MobileSource = styled.div`
    background-color: rgba(0, 0, 0, 0.5);
    padding: 0 15px;
    font-family: FoundryGridnik, sans-serif;
    text-transform: uppercase;
    font-size: 12px;
    text-align: center;
    margin-bottom: 100px;
    @media screen and (min-width: 800px) {
        display: none;
    }
`;

const Title = styled.h3`
    ${respond(35, 55)};
    font-family: Plaak, sans-serif;
    text-align: center;
    color: white;
    font-weight: bold;
    text-transform: uppercase;
    margin-top: 100px;
    margin-bottom: 50px;
    span {
        background-color: rgba(0, 0, 0, 0.9);
        box-decoration-break: clone;
        -webkit-box-decoration-break: clone;
        padding: 0 0.2em;
    }
`;

const VOLUME_MULTIPLIER = 1000000;
const BASE_SIZE = 50;
const TRANSITION_DURATION = 0.08;
const LABEL_PADDING_HORIZONTAL = 10;
const LABEL_PADDING_VERTICAL = 5;

const parseDate = timeParse("%Y-%m-%d");
const formatDate = timeFormat("%Y-%m-%d");
const formattedData = data.map(point => {
    return {
        date: parseDate(point.date),
        volume: point.volume,
        dau: point.dau,
        peak: point.peak === "Yes",
        usd: point.usd,
    };
});
const getRadius = volume => Math.sqrt(volume / Math.PI);
const maxVolume = max(formattedData, point => point.volume);
const volumePeaks = {
    maxlist: formattedData.reduce((acc, current, i) => {
        if (current.peak) {
            acc.push(i);
        }
        return acc;
    }, []),
};

const VizSVG = styled.svg`
    width: 100%;
    height: 560px;
    @media screen and (min-width: 800px) {
        max-height: 100vh;
        height: auto;
        width: auto;
        margin: 0 auto;
    }
`;

const Label = ({ children, translate, scale }) => {
    const ref = useRef();
    const [position, setPosition] = useState({
        width: 0,
        height: 0,
        x: 0,
        y: 0,
    });
    useLayoutEffect(() => {
        let box = ref.current.getBBox();
        setPosition(box);
    }, [ref, scale]);
    return (
        <g>
            <rect
                transform={`${translate}`}
                fill={"black"}
                width={position.width + LABEL_PADDING_HORIZONTAL * 2}
                height={position.height + LABEL_PADDING_VERTICAL * 2}
                x={position.x - LABEL_PADDING_HORIZONTAL}
                y={position.y - LABEL_PADDING_VERTICAL}
            />
            <text
                ref={ref}
                x={"50%"}
                y={"50%"}
                textAnchor={"middle"}
                // dominantBaseline={"middle"}
                transform={translate}
                className={"date-label"}
                fill={"white"}
            >
                {children}
            </text>
        </g>
    );
};
const CryptoKittiesBubbles = () => {
    const [inViewRef, inView] = useInView({ threshold: 0.2 });
    const volumeRef = useRef();
    const volumePeaksRefs = useRef(volumePeaks.maxlist.map(() => createRef()));
    const [animationTimeline, setAnimationTimeline] = useState(null);
    const dayRef = useRef();
    const volumeNumRef = useRef();
    const usersRef = useRef();
    const { ref: resizeRef, width, height } = useResizeObserver();
    const mobileDay = useRef();
    const mobileVolume = useRef();
    const mobileUsers = useRef();
    useEffect(() => {
        if (!isBrowser) {
            return;
        }
        const timeline = gsap.timeline({ paused: false });
        formattedData.forEach(day => {
            timeline.to(volumeRef.current, TRANSITION_DURATION, {
                attr: {
                    r: `${getRadius(
                        (day.volume / maxVolume) * VOLUME_MULTIPLIER
                    ) + BASE_SIZE}px`,
                },
            });
            timeline.add(() => {
                let date = formatDate(day.date);
                let eth = `${Math.round(day.volume * 100) / 100} ETH`;
                dayRef.current.textContent = date;
                volumeNumRef.current.textContent = eth;
                usersRef.current.textContent = day.dau;
                mobileDay.current.innerHTML = date;
                mobileVolume.current.innerHTML = eth;
                mobileUsers.current.innerHTML = day.dau;
            });
        });
        volumePeaks.maxlist.forEach((index, i) => {
            let peak = volumePeaksRefs.current[i];
            let delay = (parseInt(index, 10) + 1) * TRANSITION_DURATION;
            timeline.fromTo(
                peak.current,
                TRANSITION_DURATION,
                { opacity: 0 },
                { opacity: 1 },
                delay
            );
        });
        setAnimationTimeline(timeline);
        return () => {
            timeline.kill();
        };
    }, [volumeRef, volumePeaksRefs, setAnimationTimeline]);

    useEffect(() => {
        if (!animationTimeline) {
            return;
        }
        if (inView) {
            animationTimeline.progress(0);
            animationTimeline.play();
        } else {
            animationTimeline.pause();
        }
    }, [animationTimeline, inView, dayRef, volumeNumRef, usersRef]);

    return (
        <Container ref={mergeRefs(inViewRef, resizeRef)}>
            <Title>
                <span>The Cryptokitties bubble over time</span>
            </Title>
            <VizSVG
                width={"1500"}
                height={"1400"}
                viewBox={"0 0 1500 1400"}
                preserveAspectRatio={"xMidYMid slice"}
            >
                <circle
                    r={`${getRadius(
                        (formattedData[0].volume / maxVolume) *
                            VOLUME_MULTIPLIER
                    ) + BASE_SIZE}px`}
                    cx={"50%"}
                    cy={"50%"}
                    fill={"#000000"}
                    stroke={"#A243FF"}
                    strokeWidth={"2px"}
                    ref={volumeRef}
                />
                <text
                    x={"50%"}
                    y={"50%"}
                    textAnchor={"middle"}
                    dominantBaseline={"middle"}
                    fill={"white"}
                    className={"volume-label"}
                    transform={"translate(0 -26)"}
                    css={{
                        fontSize: `${Math.min(
                            20 * Math.max(1500 / width, 1),
                            30
                        )}px`,
                    }}
                >
                    <tspan x={"50%"}>DAILY</tspan>
                    <tspan x={"50%"} dy={"1em"}>
                        TRADE
                    </tspan>
                    <tspan x={"50%"} dy={"1em"}>
                        VOLUME
                    </tspan>
                </text>
                {volumePeaks.maxlist.map((index, i) => {
                    let day = formattedData[parseInt(index)];
                    let radius =
                        getRadius(
                            (day.volume / maxVolume) * VOLUME_MULTIPLIER
                        ) + BASE_SIZE;

                    return (
                        <g
                            opacity={0}
                            ref={volumePeaksRefs.current[i]}
                            key={index}
                        >
                            <circle
                                r={radius}
                                fill={"none"}
                                stroke={"white"}
                                strokeWidth={"2px"}
                                cx={"50%"}
                                cy={"50%"}
                            />
                            <Label
                                translate={`translate(0 -${radius + 15})`}
                                scale={1500 / width}
                            >
                                <tspan
                                    dy={0}
                                    x={"50%"}
                                    css={{
                                        fill: "#A243FF",
                                        fontSize: `${Math.min(
                                            24 * Math.max(1500 / width, 1),
                                            34
                                        )}px`,
                                    }}
                                >
                                    {formatDate(day.date)}
                                </tspan>
                                <tspan
                                    dy={"1.2em"}
                                    x={"50%"}
                                    css={{
                                        fontSize: `${Math.min(
                                            24 * Math.max(1500 / width, 1),
                                            34
                                        )}px`,
                                    }}
                                >
                                    {Math.round(day.volume * 100) / 100} ETH |{" "}
                                    {day.usd} USD
                                </tspan>
                            </Label>
                        </g>
                    );
                })}
                <g transform={"translate(0 -250)"} className={"info-bg"}>
                    <rect
                        y={"50%"}
                        transform={"translate(0 -28)"}
                        width={330}
                        height={123}
                        fill={"black"}
                        opacity={0.9}
                    />
                    <rect
                        y={"50%"}
                        transform={"translate(0 112)"}
                        width={360}
                        height={123}
                        fill={"black"}
                        opacity={0.9}
                    />
                    <rect
                        y={"50%"}
                        transform={"translate(0 252)"}
                        width={150}
                        height={123}
                        fill={"black"}
                        opacity={0.9}
                    />
                    <rect
                        y={"50%"}
                        transform={"translate(0 389)"}
                        width={280}
                        height={73}
                        fill={"black"}
                        opacity={0.9}
                    />
                    <text y={"50%"} className={"info"}>
                        <tspan x={10} className={"info-title"}>
                            Date
                        </tspan>
                        <tspan
                            ref={dayRef}
                            dy={"0.85em"}
                            x={10}
                            className={"info-value"}
                        >
                            2018-12-01
                        </tspan>
                    </text>
                    <text y={"50%"} dy={140} className={"info"}>
                        <tspan x={10} className={"info-title"}>
                            Trade volume
                        </tspan>
                        <tspan
                            ref={volumeNumRef}
                            x={10}
                            dy={"0.85em"}
                            className={"info-value"}
                        >
                            1018.24
                        </tspan>
                    </text>
                    <text y={"50%"} dy={280} className={"info"}>
                        <tspan x={10} className={"info-title"}>
                            Users
                        </tspan>
                        <tspan
                            ref={usersRef}
                            x={10}
                            dy={"0.85em"}
                            className={"info-value"}
                        >
                            348
                        </tspan>
                    </text>
                    <text y={"50%"} dy={420} className={"info"}>
                        <tspan x={10} className={"source-title"}>
                            Source
                        </tspan>
                        <tspan x={10} dy={"1.2em"} className={"source-value"}>
                            Data from nonfungible.com
                        </tspan>
                    </text>
                </g>
            </VizSVG>
            <MobileInfoBox>
                <MobileInfoStat relativeWidth={"36.4%"}>
                    <MobileInfoLabel>Date</MobileInfoLabel>
                    <MobileInfoValue ref={mobileDay}>
                        2018-12-03
                    </MobileInfoValue>
                </MobileInfoStat>
                <MobileSpacer />
                <MobileInfoStat relativeWidth={"37.5%"}>
                    <MobileInfoLabel>Trade Volume</MobileInfoLabel>
                    <MobileInfoValue ref={mobileVolume}>
                        1000.43 ETH
                    </MobileInfoValue>
                </MobileInfoStat>
                <MobileSpacer />
                <MobileInfoStat relativeWidth={"15.15%"}>
                    <MobileInfoLabel>Users</MobileInfoLabel>
                    <MobileInfoValue ref={mobileUsers}>143</MobileInfoValue>
                </MobileInfoStat>
            </MobileInfoBox>
            <MobileSource>Source: Data from nonfungible.com</MobileSource>
        </Container>
    );
};

export default CryptoKittiesBubbles;
