/**
 * Netlify Edge Function that keeps the News API key on the server.
 *
 * The browser calls `/api/*` on this site, the function adds `NEWS_API_KEY`
 * from the environment and forwards the request to News API, so the key never
 * reaches the bundle. Set it once with:
 *
 *   netlify env:set NEWS_API_KEY <your key>
 *
 * Routes:
 *   GET /api/sources?...      -> https://newsapi.org/v2/sources?...
 *   GET /api/everything?...   -> https://newsapi.org/v2/everything?...
 *   GET /api/mocks/sources    -> the static mock endpoints of the course proxy,
 *   GET /api/mocks/everything    so the client-side fallback keeps working
 */

const NEWS_API_BASE = 'https://newsapi.org/v2/';
const MOCK_BASE = 'https://rss-news-api.onrender.com/mocks/';
const LIVE_ENDPOINTS = new Set(['sources', 'everything']);
const MOCK_PREFIX = 'mocks/';

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

function readEnv(name) {
    if (typeof Deno !== 'undefined' && Deno.env && Deno.env.get) {
        return Deno.env.get(name) ?? '';
    }

    if (typeof process !== 'undefined' && process.env) {
        return process.env[name] ?? '';
    }

    return '';
}

function jsonResponse(body, status) {
    return new Response(JSON.stringify(body), {
        status,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8' },
    });
}

export default async function handler(request) {
    if (request.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (request.method !== 'GET') {
        return jsonResponse({ status: 'error', message: 'Only GET is allowed' }, 405);
    }

    const url = new URL(request.url);
    const path = url.pathname.replace(/^\/api\/?/, '');
    const isMock = path.startsWith(MOCK_PREFIX);
    const endpoint = isMock ? path.slice(MOCK_PREFIX.length) : path;

    if (!isMock && !LIVE_ENDPOINTS.has(endpoint)) {
        return jsonResponse({ status: 'error', message: 'Unknown endpoint' }, 404);
    }

    const target = new URL(endpoint, isMock ? MOCK_BASE : NEWS_API_BASE);

    url.searchParams.forEach((value, key) => {
        if (key !== 'apiKey') {
            target.searchParams.set(key, value);
        }
    });

    if (!isMock) {
        const apiKey = readEnv('NEWS_API_KEY');

        if (!apiKey) {
            return jsonResponse({ status: 'error', message: 'NEWS_API_KEY is not set' }, 500);
        }

        target.searchParams.set('apiKey', apiKey);
    }

    const upstream = await fetch(target, {
        headers: { 'User-Agent': 'news-portal-edge' },
    });

    return new Response(await upstream.text(), {
        status: upstream.status,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8' },
    });
}

export const config = { path: '/api/*' };
