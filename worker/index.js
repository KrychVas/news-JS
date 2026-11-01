/**
 * Cloudflare Worker that keeps the News API key on the server.
 *
 * The browser calls this worker instead of newsapi.org, so `NEWS_API_KEY`
 * never reaches the bundle. Store it once with:
 *
 *   wrangler secret put NEWS_API_KEY
 *
 * Routes:
 *   GET /sources?...      -> https://newsapi.org/v2/sources?...
 *   GET /everything?...   -> https://newsapi.org/v2/everything?...
 *   GET /mocks/sources    -> the static mock endpoints of the course proxy,
 *   GET /mocks/everything    so the client-side fallback keeps working
 */

const NEWS_API_UPSTREAM = 'https://newsapi.org/v2/';
const MOCK_UPSTREAM = 'https://rss-news-api.onrender.com/mocks/';
const LIVE_ENDPOINTS = new Set(['sources', 'everything']);

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

function jsonResponse(body, status) {
    return new Response(JSON.stringify(body), {
        status,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8' },
    });
}

export default {
    async fetch(request, env) {
        if (request.method === 'OPTIONS') {
            return new Response(null, { status: 204, headers: CORS_HEADERS });
        }

        if (request.method !== 'GET') {
            return jsonResponse({ status: 'error', message: 'Only GET is allowed' }, 405);
        }

        const url = new URL(request.url);
        const endpoint = url.pathname.replace(/^\/+/, '');
        const isMock = endpoint.startsWith('mocks/');
        const isLive = LIVE_ENDPOINTS.has(endpoint);

        if (!isMock && !isLive) {
            return jsonResponse({ status: 'error', message: 'Unknown endpoint' }, 404);
        }

        const target = new URL(endpoint, isMock ? MOCK_UPSTREAM : NEWS_API_UPSTREAM);

        url.searchParams.forEach((value, key) => {
            if (key !== 'apiKey') {
                target.searchParams.set(key, value);
            }
        });

        if (!isMock) {
            if (!env.NEWS_API_KEY) {
                return jsonResponse({ status: 'error', message: 'Worker has no NEWS_API_KEY' }, 500);
            }

            target.searchParams.set('apiKey', env.NEWS_API_KEY);
        }

        const upstream = await fetch(target, {
            headers: { 'User-Agent': 'news-portal-worker' },
        });

        return new Response(await upstream.text(), {
            status: upstream.status,
            headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8' },
        });
    },
};
