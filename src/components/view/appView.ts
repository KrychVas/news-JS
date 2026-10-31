import type { IArticlesResponse, ISourcesResponse } from '../../types/api';
import { ApiMode } from '../../types/api';
import { getElement } from '../../utils/dom';
import News from './news/news';
import Sources from './sources/sources';

export class AppView {
    private readonly news: News;
    private readonly sources: Sources;

    public constructor(mode: ApiMode) {
        this.news = new News();
        this.sources = new Sources();
        this.markApiMode(mode);
    }

    public drawSources(response: ISourcesResponse): void {
        this.sources.draw(response.sources);
    }

    public drawNews(response: IArticlesResponse): void {
        this.news.draw(response.articles);
    }

    public setActiveSource(sourceId: string): void {
        this.sources.setActive(sourceId);
    }

    public showSourcesLoading(): void {
        this.sources.showLoading();
    }

    public showNewsLoading(): void {
        this.news.showLoading();
    }

    public showSourcesError(message: string): void {
        this.sources.showError(message);
    }

    public showNewsError(message: string): void {
        this.news.showError(message);
    }

    /** Makes it obvious that the application runs on the static mock responses. */
    private markApiMode(mode: ApiMode): void {
        if (mode !== ApiMode.Mock) {
            return;
        }

        const badge: HTMLElement = getElement<HTMLElement>('.header__badge');
        badge.hidden = false;
        badge.textContent = 'Demo data';
    }
}

export default AppView;
