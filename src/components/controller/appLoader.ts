import type { Maybe } from '../../types/api';
import { ApiMode } from '../../types/api';
import Loader from './loader';

/**
 * Concrete loader for the News API. It resolves the base url once, at
 * construction time, and switches between the live proxy and the mock
 * endpoints of the same server through the `API_USE_MOCKS` flag.
 *
 * In live mode it also keeps the mock url as a fallback: when the request quota
 * of the API key is exhausted, the application quietly continues on mock data.
 */
class AppLoader extends Loader {
    private static readonly LIVE_FALLBACK_URL = 'https://rss-news-api.onrender.com/';
    private static readonly MOCK_PATH = 'mocks/';
    private static readonly API_URL: string = process.env.API_URL ?? AppLoader.LIVE_FALLBACK_URL;
    private static readonly API_KEY: string = process.env.API_KEY ?? '';
    private static readonly API_MODE: ApiMode = process.env.API_USE_MOCKS === 'true' ? ApiMode.Mock : ApiMode.Live;

    public constructor(onFallback?: () => void) {
        super({
            baseUrl: AppLoader.resolveBaseUrl(),
            apiKey: AppLoader.API_KEY,
            fallbackBaseUrl: AppLoader.resolveFallbackUrl(),
            onFallback,
        });
    }

    public static get mode(): ApiMode {
        return AppLoader.API_MODE;
    }

    private static resolveBaseUrl(): string {
        const liveUrl: string = AppLoader.normalizeUrl(AppLoader.API_URL);

        return AppLoader.API_MODE === ApiMode.Mock ? `${liveUrl}${AppLoader.MOCK_PATH}` : liveUrl;
    }

    private static resolveFallbackUrl(): Maybe<string> {
        if (AppLoader.API_MODE === ApiMode.Mock) {
            return null;
        }

        return `${AppLoader.normalizeUrl(AppLoader.API_URL)}${AppLoader.MOCK_PATH}`;
    }

    private static normalizeUrl(url: string): string {
        return url.endsWith('/') ? url : `${url}/`;
    }
}

export default AppLoader;
