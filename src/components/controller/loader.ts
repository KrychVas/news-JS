import type { Callback, ErrorCallback, ILoaderOptions, IRequestParameters, QueryParams } from '../../types/api';
import { Endpoint, HttpMethod } from '../../types/api';

/**
 * Thin typed wrapper around `fetch` that knows how to build News API urls and
 * how to turn every failure into a human readable message.
 */
class Loader {
    private static readonly UNAUTHORIZED_MESSAGE = 'The server rejected the request: check your API key.';
    private static readonly NOT_FOUND_MESSAGE = 'The requested resource was not found on the News API server.';

    private readonly baseUrl: string;
    private readonly defaultQuery: Readonly<QueryParams>;

    public constructor({ baseUrl, apiKey }: Readonly<ILoaderOptions>) {
        this.baseUrl = baseUrl;
        this.defaultQuery = { apiKey };
    }

    /**
     * Runs a `GET` request and hands the parsed payload to `callback`.
     * Generic `TResponse` keeps the controller fully typed.
     */
    public getResp<TResponse>(
        { endpoint, query = {} }: IRequestParameters,
        callback: Callback<TResponse>,
        onError?: ErrorCallback
    ): void {
        void this.request<TResponse>(endpoint, query)
            .then((payload: TResponse) => {
                callback(payload);
            })
            .catch((error: unknown) => {
                const message = Loader.describeError(error);
                console.error(message);

                if (onError) {
                    onError(message);
                }
            });
    }

    private async request<TResponse>(endpoint: Endpoint, query: Partial<QueryParams>): Promise<TResponse> {
        const response: Response = await fetch(this.buildUrl(endpoint, query), { method: HttpMethod.Get });

        Loader.assertSuccessful(response);

        const payload: unknown = await response.json();

        return payload as TResponse;
    }

    private buildUrl(endpoint: Endpoint, query: Partial<QueryParams>): string {
        const search: URLSearchParams = new URLSearchParams();
        const mergedQuery: Partial<QueryParams> = { ...this.defaultQuery, ...query };

        Object.entries(mergedQuery).forEach(([key, value]) => {
            if (value !== undefined && value !== '') {
                search.set(key, value);
            }
        });

        const queryString = search.toString();

        return queryString === '' ? `${this.baseUrl}${endpoint}` : `${this.baseUrl}${endpoint}?${queryString}`;
    }

    private static assertSuccessful(response: Response): void {
        if (response.ok) {
            return;
        }

        if (response.status === 401) {
            throw new Error(Loader.UNAUTHORIZED_MESSAGE);
        }

        if (response.status === 404) {
            throw new Error(Loader.NOT_FOUND_MESSAGE);
        }

        throw new Error(`Request failed with status ${response.status} ${response.statusText}`.trim());
    }

    private static describeError(error: unknown): string {
        if (error instanceof Error) {
            return error.message;
        }

        return String(error);
    }
}

export default Loader;
