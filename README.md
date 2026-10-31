# News Portal (news-JS)

A single page application that shows news from more than a hundred sources
around the world through [News API](https://newsapi.org/). The project was
migrated from JavaScript to TypeScript and comes with a custom adaptive design
that works from 320px up to 1920px.

## Stack

| Layer      | Tools                                     |
| ---------- | ----------------------------------------- |
| Language   | TypeScript (`strict`, `noImplicitAny`)    |
| Bundler    | Webpack 5 + `ts-loader`                   |
| Linting    | ESLint 8 + `@typescript-eslint` + Prettier |
| Styling    | Plain CSS, mobile first                   |
| Networking | `fetch` behind a typed `Loader` class     |

## Quick start

```bash
npm install
cp .env.example .env   # Windows: copy .env.example .env
npm start              # http://localhost:8080
```

## Scripts

| Script              | Description                                         |
| ------------------- | --------------------------------------------------- |
| `npm start`         | Webpack dev server with hot reload                  |
| `npm run build`     | Production build into `dist/` (used for gh-pages)    |
| `npm run typecheck` | `tsc --noEmit`, type checking without emitting files |
| `npm run lint`      | ESLint for `*.ts`, `no-explicit-any` is an error     |
| `npm run lint:fix`  | ESLint with automatic fixes                          |
| `npm run prettier`  | Formatting check                                     |

## Environment variables

| Variable        | Purpose                                                                        |
| --------------- | ------------------------------------------------------------------------------ |
| `API_URL`       | API base url, defaults to the CORS proxy `https://rss-news-api.onrender.com/`   |
| `API_KEY`       | Personal News API key, required only for the live endpoints                     |
| `API_USE_MOCKS` | `true` — static `/mocks/*` endpoints, `false` — live proxied News API           |

`dotenv-webpack` reads `.env` and takes missing values from the committed
`.env.defaults`, so a build never fails without a local `.env`.

### Mock endpoints

The proxy exposes two extra endpoints with static data:

- `GET /mocks/sources` — a fixed list of sources;
- `GET /mocks/everything` — a fixed list of articles.

`API_USE_MOCKS=true` is the default: it needs no API key and never consumes the
request limit. The **Demo data** badge in the header tells you which mode is
active.

> **Why the deployed demo runs on mocks.** The live proxy endpoints (`/sources`,
> `/everything`) answer `401 Unauthorized` without a personal key, while the
> mocks answer `200` with `Access-Control-Allow-Origin: *`. To see real news,
> put your key into `API_KEY` and set `API_USE_MOCKS=false`.

## TypeScript highlights

- `enum` — `Endpoint`, `HttpMethod`, `ResponseStatus`, `ApiMode` (`src/types/api.ts`);
- API interfaces — `ISource`, `IArticle`, `ISourcesResponse`, `IArticlesResponse`;
- reusable function types — `Callback<TData>`, `ErrorCallback`, `Maybe<TValue>`;
- union type `NewsApiResponse = ISourcesResponse | IArticlesResponse`;
- generics — `Loader.getResp<TResponse>()` and `Loader.request<TResponse>()`;
- utility types — `Partial<QueryParams>`, `Pick<IArticle, 'url' | 'title'>`, `Readonly<ILoaderOptions>`;
- classes with `private`/`public` modifiers — `Loader`, `AppLoader`, `AppController`, `AppView`, `News`, `Sources`, `App`;
- no `any` anywhere: the `fetch` payload is typed as `unknown` and narrowed to `TResponse`.

## Project structure

```
src/
├── components/
│   ├── app/app.ts                   # UI bootstrap
│   ├── controller/
│   │   ├── loader.ts                # typed fetch wrapper
│   │   ├── appLoader.ts             # base url + live/mock mode
│   │   └── controller.ts            # sources / everything requests
│   └── view/
│       ├── appView.ts               # view facade
│       ├── news/news.ts|css         # news cards
│       └── sources/sources.ts|css   # source chips
├── types/                           # API contracts, env and css declarations
├── utils/dom.ts|format.ts           # DOM helpers and date formatting
├── index.ts
├── index.html
└── global.css
```

## Design

A custom dark theme: gradient background, glassy sticky header, horizontally
scrollable source chips on narrow screens, a card grid that goes from one to two
to three columns (320px, 700px, 1200px), skeleton placeholders while loading and
an error state with a retry button.

## Deployment

Live page: <https://krychvas.github.io/news-JS/>

```bash
npm run build
npx gh-pages -d dist -m "deploy: publish production build to gh-pages"
```

The build inlines the `API_USE_MOCKS` value from your `.env`, so check the API
mode before deploying.

## Author

[Aleh Serhiyenia](https://github.com/KrychVas) · [RS School](https://rs.school/courses/javascript)
