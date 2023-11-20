import {
    AutoLinkPlugin as LexicalAutoLinkPlugin,
    createLinkMatcherWithRegExp,
} from '@lexical/react/LexicalAutoLinkPlugin';


const URL_REGEX = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
  
export const MATCHERS = [
    createLinkMatcherWithRegExp(URL_REGEX, (text) => {
        return text.startsWith('http') ? text : `https://${text}`;
    }),
]
  
export function AutoLinkPlugin() {

    return <LexicalAutoLinkPlugin matchers={MATCHERS} />
}