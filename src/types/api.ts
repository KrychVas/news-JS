/**
 * Values of the `endpoint` path segment supported by the News API.
 * Used everywhere instead of loose string literals.
 */
export enum Endpoint {
    Sources = 'sources',
    Everything = 'everything',
}

/**
 * HTTP methods the loader is allowed to use.
 */
export enum HttpMethod {
    Get = 'GET',
}

/**
 * Values of the `status` field returned by the News API.
 */
export enum ResponseStatus {
    Ok = 'ok',
    Error = 'error',
}

/**
 * Which API the application talks to.
 */
export enum ApiMode {
    Live = 'live',
    Mock = 'mock',
}

export type QueryParams = Record<string, string>;

export type Maybe<TValue> = TValue | null;

/** Function type describing any successful response handler. */
export type Callback<TData> = (data: TData) => void;

/** Function type describing an error handler. */
export type ErrorCallback = Callback<string>;

export interface ISource {
    readonly id: string;
    readonly name: string;
    readonly description: string;
    readonly url: string;
    readonly category: string;
    readonly language: string;
    readonly country: string;
}

export interface IArticleSource {
    readonly id: Maybe<string>;
    readonly name: string;
}

export interface IArticle {
    readonly source: IArticleSource;
    readonly author: Maybe<string>;
    readonly title: string;
    readonly description: Maybe<string>;
    readonly url: string;
    readonly urlToImage: Maybe<string>;
    readonly publishedAt: string;
    readonly content: Maybe<string>;
}

export interface ISourcesResponse {
    readonly status: ResponseStatus;
    readonly sources: readonly ISource[];
}

export interface IArticlesResponse {
    readonly status: ResponseStatus;
    readonly totalResults: number;
    readonly articles: readonly IArticle[];
}

/** Union type of every payload the application is able to receive. */
export type NewsApiResponse = ISourcesResponse | IArticlesResponse;

export interface IRequestParameters {
    readonly endpoint: Endpoint;
    readonly query?: Partial<QueryParams>;
}

export interface ILoaderOptions {
    readonly baseUrl: string;
    readonly apiKey: string;
}
