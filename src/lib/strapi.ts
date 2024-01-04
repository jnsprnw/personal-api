import { PUBLIC_STRAPI_URL, PUBLIC_STRAPI_ENDPOINT } from '$env/static/public';

import { stringify } from 'qs';

interface Props {
	endpoint: string;
	query?: Object;
	wrappedByKey?: string;
	wrappedByList?: boolean;
}

/**
 * Fetches data from the Strapi API
 * @param endpoint - The endpoint to fetch from
 * @param query - The query parameters to add to the url
 * @param wrappedByKey - The key to unwrap the response from
 * @param wrappedByList - If the response is a list, unwrap it
 * @returns
 */
async function fetchApi<T>({ endpoint, query, wrappedByKey, wrappedByList }: Props): Promise<T> {
	if (endpoint.startsWith('/')) {
		endpoint = endpoint.slice(1);
	}

	let url = `${PUBLIC_STRAPI_URL}/api/${endpoint}?`;
	if (query) {
		const params = stringify(query, {
			encodeValuesOnly: true // prettify URL
		});
		url += params;
	}
	const res = await fetch(url);
	let data = await res.json();

	if (wrappedByKey) {
		data = data[wrappedByKey];
	}

	if (wrappedByList) {
		data = data[0];
	}

	return data as T;
}

export async function fetchEndpoint(length: number) {
	return await fetchApi({
		endpoint: PUBLIC_STRAPI_ENDPOINT,
		wrappedByKey: 'data',
		wrappedByList: true,
		query: { filters: { Length: { $eq: length } } }
	});
}
