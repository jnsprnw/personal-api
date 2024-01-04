import { marked } from 'marked';

export function to_html(markdown: string) {
	return marked.parse(markdown).replace(/\n$/, '');
}
