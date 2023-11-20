import DOMPurify from "dompurify";
import HTMLReactParser from "html-react-parser";
import { Tweet } from "react-twitter-widgets";

const TEMPORARY_ATTRIBUTE = 'data-temp-href-target';

DOMPurify.addHook('beforeSanitizeAttributes', function (node) {
    // Link
    if(node.tagName === 'A' && 'target' in node && node.getAttribute('target') === '_blank') {
        node.setAttribute(TEMPORARY_ATTRIBUTE, '_blank');
    }

    // Youtube
    if(node.tagName === 'IFRAME') {
        const src = node.getAttribute("src") || "";
        if(!(src.startsWith("https://www.youtube.com/embed/") || src.startsWith("https://www.youtube-nocookie.com/embed/")) && !!node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
})

DOMPurify.addHook('afterSanitizeAttributes', function (node) {
    if(node.tagName === 'A' && node.hasAttribute(TEMPORARY_ATTRIBUTE)) {
        node.removeAttribute(TEMPORARY_ATTRIBUTE);
        node.setAttribute('target', '_blank');
        node.setAttribute('rel', 'noopener noreferrer');
    }
});

const options = {
    replace(node) {
        // Twitter
        if(node.tagName === 'div' && node.attribs && !!node.attribs['data-lexical-tweet-id']) {
            return <Tweet tweetId={node.attribs['data-lexical-tweet-id']} options={{ theme: "dark" }}/>;
        }
    }
}

function renderHtml (html) {
    return HTMLReactParser(DOMPurify.sanitize(html, { ADD_TAGS: ["iframe"], ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling'] }), options);
}

export default renderHtml;