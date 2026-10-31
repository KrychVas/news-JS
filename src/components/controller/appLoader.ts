import { ApiMode } from '../../types/api';
import Loader from './loader';

/**
 * Concrete loader for the News API. It resolves the base url once, at
 * construction time, and switches between the live proxy and the mock
 * endpoints of the same server through the `API_USE_MOCKS` flag.
 */
class AppLoader extends Loader {
    private static readonly LIVE_FALLBACK_URL = 'https://rss-news-api.onrender.com/';
    private static readonly API_URL: string = process.env.API_URL ?? AppLoader.LIVE_FALLBACK_URL;
    private static readonly API_KEY: string = process.env.API_KEY ?? '';
    private static readonly API_MODE: ApiMode = process.env.API_USE_MOCKS === 'true' ? ApiMode.Mock : ApiMode.Live;

    public constructor() {
        super({ baseUrl: AppLoader.resolveBaseUrl(), apiKey: AppLoader.API_KEY });
    }

    public static get mode(): ApiMode {
        return AppLoader.API_MODE;
    }

    private static resolveBaseUrl(): string {
        const normalisedUrl: string = AppLoader.API_URL.endsWith('/') ? AppLoader.API_URL : `${AppLoader.API_URL}/`;

        return AppLoader.API_MODE === ApiMode.Mock ? `${normalisedUrl}mocks/` : normalisedUrl;
    }
}

export default AppLoader;
