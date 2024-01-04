import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

export function purifyHTML(html: string) {
	return DOMPurify.sanitize(html, { ALLOWED_TAGS: ['p', 'a'] });
}

export function purifyPlain(html: string) {
	return DOMPurify.sanitize(html, { ALLOWED_TAGS: [] });
}
