import './news.css';
import type { IArticle } from '../../../types/api';
import { cloneTemplate, getElement } from '../../../utils/dom';
import { formatPublishDate } from '../../../utils/format';

const PLACEHOLDER_CLASS = 'news__photo--empty';

class News {
    private static readonly CARD_TEMPLATE_ID = 'newsItemTemp';
    private static readonly SKELETON_TEMPLATE_ID = 'skeletonTemp';
    private static readonly MAX_ARTICLES = 10;
    private static readonly SKELETON_AMOUNT = 6;

    private readonly container: HTMLElement;

    public constructor(selector: string = '.news') {
        this.container = getElement<HTMLElement>(selector);
    }

    public draw(articles: readonly IArticle[]): void {
        const visibleArticles: readonly IArticle[] = articles.slice(0, News.MAX_ARTICLES);

        if (visibleArticles.length === 0) {
            this.renderEmptyState();
            return;
        }

        const fragment: DocumentFragment = document.createDocumentFragment();

        visibleArticles.forEach((article: IArticle) => {
            fragment.append(this.createCard(article));
        });

        this.container.replaceChildren(fragment);
    }

    public showLoading(): void {
        const fragment: DocumentFragment = document.createDocumentFragment();

        for (let index = 0; index < News.SKELETON_AMOUNT; index += 1) {
            fragment.append(cloneTemplate(News.SKELETON_TEMPLATE_ID));
        }

        this.container.replaceChildren(fragment);
    }

    public showError(message: string): void {
        const wrapper: HTMLDivElement = document.createElement('div');
        wrapper.className = 'news__status news__status--error';

        const title: HTMLParagraphElement = document.createElement('p');
        title.className = 'news__status-title';
        title.textContent = 'Не вдалося завантажити новини';

        const details: HTMLParagraphElement = document.createElement('p');
        details.className = 'news__status-details';
        details.textContent = message;

        const retry: HTMLButtonElement = document.createElement('button');
        retry.className = 'news__retry';
        retry.type = 'button';
        retry.textContent = 'Спробувати ще раз';

        wrapper.append(title, details, retry);
        this.container.replaceChildren(wrapper);
    }

    private createCard(article: IArticle): DocumentFragment {
        const fragment: DocumentFragment = cloneTemplate(News.CARD_TEMPLATE_ID);
        const photo: HTMLElement = getElement<HTMLElement>('.news__photo', fragment);

        if (article.urlToImage === null || article.urlToImage === '') {
            photo.classList.add(PLACEHOLDER_CLASS);
        } else {
            photo.style.backgroundImage = `url("${article.urlToImage}")`;
        }

        getElement<HTMLElement>('.news__meta-author', fragment).textContent = article.author ?? article.source.name;
        getElement<HTMLElement>('.news__description-title', fragment).textContent = article.title;
        getElement<HTMLElement>('.news__description-source', fragment).textContent = article.source.name;
        getElement<HTMLElement>('.news__description-content', fragment).textContent =
            article.description ?? 'Опис для цієї новини недоступний.';

        const date: HTMLTimeElement = getElement<HTMLTimeElement>('.news__meta-date', fragment);
        date.textContent = formatPublishDate(article.publishedAt);
        date.dateTime = article.publishedAt;

        this.fillReadMoreLink(article, fragment);

        return fragment;
    }

    /** Only the fields required by the link are requested — a `Pick<IArticle, ...>`. */
    private fillReadMoreLink(article: Pick<IArticle, 'url' | 'title'>, fragment: DocumentFragment): void {
        const link: HTMLAnchorElement = getElement<HTMLAnchorElement>('.news__read-more', fragment);
        link.href = article.url;
        link.setAttribute('aria-label', `Читати далі: ${article.title}`);
    }

    private renderEmptyState(): void {
        const empty: HTMLParagraphElement = document.createElement('p');
        empty.className = 'news__status';
        empty.textContent = 'Для цього джерела новин поки немає.';

        this.container.replaceChildren(empty);
    }
}

export default News;
