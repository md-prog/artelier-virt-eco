import { AUCTION_EVENT_TYPES, NULL_ACCOUNT } from "./constants";
import BigNumber from "bignumber.js";

export const normalizePriceDisplay = (num, decimals) => {
    let ret;
    if (decimals === null) {
        decimals = +num >= 1000 ? 2 : +num >= 10 ? 3 : 4;
    }
    let str = (+num).toFixed(decimals);
    if (parseFloat(str) !== 0) {
        // This means that the number escapes the precision level
        // as a non-zero value, which is ideal.
        if (String(parseFloat(str)).length < str.length) {
            // Trailing zeroes exist after the precision is applied,
            // so we strip them out and return the result
            ret = String(parseFloat(str));
        } else if (parseFloat(str) == parseInt(str)) {
            // The number is basically N.00000
            // so we strip out the entire float and return it
            ret = String(parseInt(str));
        } else {
            ret = str;
        }
    } else {
        str = (+num).toFixed(20);
        // 20 is the maximum precision allowed by toFixed
        // so we ignore precision and try to pull out the first
        // non-zero float

        // Return 0 if 20 decimal precision is not enough
        if (parseFloat(str) === 0) {
            ret = "0";
        } else {
            // 20 precision was enough but we may still have
            // trailing 0s. We want go through the string
            // to find the first non-zero decimal
            // and return the number up until that position
            // Ex. Turn 0.000000XYZ00 into 0.0000000X
            let cutoff = 0;
            let inDecimal = false;
            for (let i = 0, len = str.length; i < len; i++) {
                if (inDecimal && str[i] !== "0") {
                    cutoff = i + 1;
                    break;
                } else if (str[i] === ".") {
                    inDecimal = true;
                }
            }
            ret = str.substring(0, cutoff);
        }
    }

    // Final processing
    return parseFloat(ret).toLocaleString(undefined, {
        minimumSignificantDigits: 1,
    });
};

export function getEventPriority(event) {
    switch (event.eventType) {
        case AUCTION_EVENT_TYPES.SUCCESSFUL:
            return 1;
        case AUCTION_EVENT_TYPES.CREATED:
            return 2;
        case AUCTION_EVENT_TYPES.BID_ENTERED:
        case AUCTION_EVENT_TYPES.OFFER_ENTERED:
            return 2;
        case AUCTION_EVENT_TYPES.BID_WITHDRAWN:
            return 3;
        case AUCTION_EVENT_TYPES.CANCELLED:
            return 3;
        case AUCTION_EVENT_TYPES.TRANSFER:
            return 4;
        case AUCTION_EVENT_TYPES.APPROVE:
            return 5;
        default:
            console.warn(`Unhandled event type: ${event.eventType}`);
            return 6;
    }
}
export function bn(value, decimals) {
    try {
        // toString() is used because numbers with more than 15 significant digits are not accepted
        return new BigNumber(value.toString()).div(
            new BigNumber(10).exponentiatedBy(decimals || 0)
        );
    } catch (_) {
        return new BigNumber(NaN);
    }
}

export function getPriceLabel(event) {
    let unitQuantity =
        event.asset && event.asset.decimals != null
            ? bn(event.quantity, event.asset.decimals)
            : event.quantity;
    const normalize = field =>
        field === null
            ? undefined
            : bn(field, event.payment_token.decimals).dividedBy(unitQuantity);
    const currencySymbol = event.payment_token.symbol || ""; // || "Ξ"
    const prices = [];
    const totalPrice = normalize(event.total_price);
    const bidAmount = normalize(event.bid_amount);
    const startingPrice = normalize(event.starting_price);
    const endingPrice = normalize(event.ending_price);
    if (totalPrice && !totalPrice.isNaN()) {
        prices.push(totalPrice);
    } else if (bidAmount && !bidAmount.isNaN()) {
        prices.push(bidAmount);
    } else if (startingPrice && !startingPrice.isNaN()) {
        prices.push(startingPrice);
        if (+startingPrice !== +endingPrice) {
            prices.push(endingPrice);
        }
    }

    return prices
        .map(price => `${normalizePriceDisplay(price)} ${currencySymbol}`)
        .join(" → ");
}

export function getEventParticular(event, accountAddr) {
    const toAccount =
        event.to_account ||
        event.winner_account ||
        event.approved_account ||
        event.transaction?.toAccount ||
        {};
    const fromAccount =
        event.from_account ||
        event.seller_accout ||
        event.owner_account ||
        event.transaction?.from_account ||
        {};
    const image = event.asset
        ? event.asset.image_url_thumbnail
        : event.asset_bundle
        ? event.asset_bundle.assets.map(a => a.imaeg_url)
        : null;
    switch (event.event_type) {
        case AUCTION_EVENT_TYPES.SUCCESSFUL:
            if (event.winner_account?.address === accountAddr) {
                return {
                    beginning: accountAddr,
                    beginningUrl: `/accounts/${accountAddr}`,
                    fromAccount: event.winnerAccount,
                    label: "bought ",
                    image,
                    preposition: " for ",
                    ending: getPriceLabel(event),
                    winnerAccount: toAccount,
                    winnerAccountAddress:
                        toAccount.address === NULL_ACCOUNT
                            ? null
                            : toAccount.address,
                    winnerAccountName: toAccount.label,
                };
            } else {
                return {
                    beginning: fromAccount.label,
                    beginningUrl: `/accounts/${fromAccount.address}`,
                    fromAccount,
                    label: "sold ",
                    image,
                    preposition: " for ",
                    ending: getPriceLabel(event),
                    winnerAccount: toAccount,
                    winnerAccountAddress:
                        toAccount.address === NULL_ACCOUNT
                            ? null
                            : toAccount.address,
                    winnerAccountName: toAccount.label,
                };
            }
        case AUCTION_EVENT_TYPES.CREATED:
            return {
                beginning: fromAccount.label,
                beginningUrl: `/accounts/${fromAccount.address}`,
                fromAccount,
                label: "auctioned ",
                image,
                preposition: " for ",
                ending: getPriceLabel(event),
            };
        case AUCTION_EVENT_TYPES.APPROVE:
            return {
                beginning: fromAccount.label,
                beginningUrl: `/accounts/${fromAccount.address}`,
                fromAccount,
                label: "approved an auction for ",
                image,
            };
        case AUCTION_EVENT_TYPES.OFFER_ENTERED:
            return {
                beginning: fromAccount.label,
                beginningUrl: `/accounts/${fromAccount.address}`,
                fromAccount,
                label: "made an offer on ",
                image,
                preposition: " with ",
                ending: getPriceLabel(event),
            };
        case AUCTION_EVENT_TYPES.BID_ENTERED:
            return {
                beginning: fromAccount.label,
                beginningUrl: `/accounts/${fromAccount.address}`,
                fromAccount,
                label: "bid on ",
                image,
                preposition: " with ",
                ending: getPriceLabel(event),
            };
        case AUCTION_EVENT_TYPES.BID_WITHDRAWN:
            return {
                beginning: fromAccount.label,
                beginningUrl: `/accounts/${fromAccount.address}`,
                fromAccount,
                label: "withdrew a bid on ",
                image,
            };
        case AUCTION_EVENT_TYPES.CANCELLED:
            return {
                beginning: fromAccount.label,
                beginningUrl: `/accounts/${fromAccount.address}`,
                fromAccount,
                label: "cancelled an auction of ",
                image,
            };
        case AUCTION_EVENT_TYPES.TRANSFER:
            if (event.from_account?.address === NULL_ACCOUNT) {
                return {
                    label: "Birth of ",
                    image,
                };
            }
            if (event.to_account?.address === NULL_ACCOUNT) {
                return {
                    label: "Death of ",
                    image,
                };
            }
            return {
                beginning: fromAccount.label,
                beginningUrl: `/accounts/${fromAccount.address}`,
                fromAccount,
                label: "transferred ",
                image,
                preposition: " to ",
                toAccount,
                ending: toAccount.label,
                endingUrl: `/accounts/${toAccount.address}`,
            };
        default:
            console.warn(`Unhandled event type: ${event.event_type}`);
            return {};
    }
}
