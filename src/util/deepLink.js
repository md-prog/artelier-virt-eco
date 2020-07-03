export default function deepLink(map, slug) {
    for (let i = 0; i < map.length; i++) {
        let section = map[i];
        if (section.title.toLowerCase() === slug.replace("-", " ")) {
            for (let j = 0; j < section.sections.length; j++) {
                if (section.sections[j].label === "title") {
                    window.scrollTo(0, section.sections[j].start);
                    return;
                }
            }
            window.scrollTo(0, section.sectionStart);
            break;
        }
    }
}

export function deepLinkByID(id) {
    let element = document.querySelector(`#${id}`);
    if (element) {
        element.scrollIntoView();
    }
}
