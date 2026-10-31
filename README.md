# News Portal (news-JS)

SPA-застосунок для перегляду новин з понад сотні світових джерел через
[News API](https://newsapi.org/). Проєкт мігровано з JavaScript на TypeScript,
додано власний адаптивний дизайн (320px – 1920px).

## Стек

| Шар         | Технології                              |
| ----------- | --------------------------------------- |
| Мова        | TypeScript (`strict`, `noImplicitAny`)   |
| Збірка      | Webpack 5 + `ts-loader`                  |
| Лінтування  | ESLint 8 + `@typescript-eslint` + Prettier |
| Стилі       | CSS (без фреймворків), mobile-first     |
| Запити      | `fetch` з типізованою обгорткою `Loader` |

## Швидкий старт

```bash
npm install
cp .env.example .env   # Windows: copy .env.example .env
npm start              # http://localhost:8080
```

## Скрипти

| Скрипт               | Що робить                                              |
| -------------------- | ------------------------------------------------------ |
| `npm start`          | dev-сервер webpack з гарячим перезавантаженням         |
| `npm run build`      | production-збірка в `dist/` (для gh-pages)             |
| `npm run typecheck`  | `tsc --noEmit`, перевірка типів без генерації файлів   |
| `npm run lint`       | ESLint для `*.ts` (правило `no-explicit-any` увімкнено) |
| `npm run lint:fix`   | ESLint з автоматичним виправленням                     |
| `npm run prettier`   | перевірка форматування                                 |

## Змінні середовища

| Змінна          | Призначення                                                                    |
| --------------- | ------------------------------------------------------------------------------ |
| `API_URL`       | Базова адреса API. За замовчуванням CORS-проксі `https://rss-news-api.onrender.com/` |
| `API_KEY`       | Особистий ключ News API. Порожній, якщо використовується проксі                 |
| `API_USE_MOCKS` | `true` — статичні `/mocks/*` ендпоінти (не витрачає ліміт ключа), `false` — живі дані |

`dotenv-webpack` читає `.env`, а відсутні змінні добирає з закоміченого
`.env.defaults`, тому збірка не падає без локального `.env`.

### Мок-ендпоінти

Проксі має додаткові ендпоінти зі статичними даними:

- `GET /mocks/sources` — фіксований список джерел;
- `GET /mocks/everything` — фіксований список статей.

Для розробки достатньо `API_USE_MOCKS=true` у `.env`; для деплою — `false`.
Коли застосунок працює на моках, у хедері показується бейдж **Демо-дані**.

## Що є в TypeScript

- `enum` — `Endpoint`, `HttpMethod`, `ResponseStatus`, `ApiMode` (`src/types/api.ts`);
- інтерфейси API — `ISource`, `IArticle`, `ISourcesResponse`, `IArticlesResponse`;
- універсальні типи — `Callback<TData>`, `ErrorCallback`, `Maybe<TValue>`;
- union-тип `NewsApiResponse` = `ISourcesResponse | IArticlesResponse`;
- generics — `Loader.getResp<TResponse>()` і `Loader.request<TResponse>()`;
- utility-типи — `Partial<QueryParams>`, `Pick<IArticle, 'url' | 'title'>`, `Readonly<ILoaderOptions>`;
- класи з `private`/`public` модифікаторами — `Loader`, `AppLoader`, `AppController`, `AppView`, `News`, `Sources`, `App`;
- жодного `any`: відповідь `fetch` типізується як `unknown` і звужується до `TResponse`.

## Структура

```
src/
├── components/
│   ├── app/app.ts                   # точка входу UI
│   ├── controller/
│   │   ├── loader.ts                # типізована обгортка fetch
│   │   ├── appLoader.ts             # базовий url + режим live/mock
│   │   └── controller.ts            # запити sources / everything
│   └── view/
│       ├── appView.ts               # фасад подання
│       ├── news/news.ts|css         # картки новин
│       └── sources/sources.ts|css   # чипси джерел
├── types/                           # інтерфейси API, типи env і css
├── utils/dom.ts|format.ts           # DOM-хелпери та форматування дати
├── index.ts
├── index.html
└── global.css
```

## Дизайн

Власне оформлення на основі темної теми: градієнтний фон, скляний хедер,
чипси джерел зі скролом на вузьких екранах, сітка карток 1 → 2 → 3 колонки
(320px, 700px, 1200px), skeleton-заглушки під час завантаження та стан
помилки з кнопкою повтору.

## Деплой

```bash
npm run build
npx gh-pages -d dist
```

## Автор

[Aleh Serhiyenia](https://github.com/KrychVas) · [RS School](https://rs.school/courses/javascript)
