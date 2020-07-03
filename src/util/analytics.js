import { isBrowser } from "@emotion/core/src/utils";

export function pageView(path, title) {
    if (isBrowser && window.dataLayer) {
        window.dataLayer.push({
            event: "VirtualPageview",
            virtualPageURL: path,
            virtualPageTitle: title,
        });
    }
}

export function track(data) {
    if (isBrowser && window.dataLayer) {
        window.dataLayer.push(data);
    }
}
