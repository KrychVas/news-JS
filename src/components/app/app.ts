import type { IArticlesResponse, ISource, ISourcesResponse } from '../../types/api';
import AppController from '../controller/controller';
import AppView from '../view/appView';
import { getElement } from '../../utils/dom';

class App {
    private static readonly AUTO_PROBE_LIMIT = 4;

    private readonly controller: AppController;
    private readonly view: AppView;
    private activeSourceId: string | null = null;
    private sourceIds: readonly string[] = [];

    public constructor() {
        this.view = new AppView(AppController.mode);
        this.controller = new AppController(() => {
            this.view.markDemoMode();
        });
    }

    public start(): void {
        this.bindEvents();
        this.renderCurrentYear();
        this.loadSources();
    }

    private bindEvents(): void {
        const sourcesContainer: HTMLElement = getElement<HTMLElement>('.sources');
        const newsContainer: HTMLElement = getElement<HTMLElement>('.news');

        sourcesContainer.addEventListener('click', (event: MouseEvent) => {
            this.handleSourceClick(event);
        });

        newsContainer.addEventListener('click', (event: MouseEvent) => {
            if (event.target instanceof Element && event.target.closest('.news__retry') !== null) {
                this.reloadNews();
            }
        });
    }

    private handleSourceClick(event: MouseEvent): void {
        const target: EventTarget | null = event.target;

        if (!(target instanceof Element)) {
            return;
        }

        const chip: HTMLButtonElement | null = target.closest<HTMLButtonElement>('.source__item');

        if (chip === null) {
            return;
        }

        const sourceId: string | undefined = chip.dataset.sourceId;

        if (sourceId === undefined || sourceId === this.activeSourceId) {
            return;
        }

        this.activeSourceId = sourceId;
        this.view.setActiveSource(sourceId);
        this.loadNews(sourceId);
    }

    private loadSources(): void {
        this.view.showSourcesLoading();

        this.controller.getSources(
            (response: ISourcesResponse): void => {
                this.view.drawSources(response);
                this.sourceIds = response.sources.map((source: ISource) => source.id);
                this.autoSelectSource(0);
            },
            (message: string): void => {
                this.view.showSourcesError(message);
                this.view.showNewsError(message);
            }
        );
    }

    /**
     * Some sources legitimately return zero articles (for example `abc-news`
     * on the live API), so the first source with actual news is selected
     * instead of showing an empty page. Gives up after `AUTO_PROBE_LIMIT` tries.
     */
    private autoSelectSource(index: number): void {
        const sourceId: string | undefined = this.sourceIds[index];

        if (sourceId === undefined || index >= App.AUTO_PROBE_LIMIT) {
            return;
        }

        this.activeSourceId = sourceId;
        this.view.setActiveSource(sourceId);
        this.view.showNewsLoading();

        this.controller.getNews(
            sourceId,
            (response: IArticlesResponse): void => {
                if (this.activeSourceId !== sourceId) {
                    return;
                }

                if (response.articles.length === 0) {
                    this.autoSelectSource(index + 1);

                    return;
                }

                this.view.drawNews(response);
            },
            (message: string): void => {
                this.view.showNewsError(message);
            }
        );
    }

    private loadNews(sourceId: string): void {
        this.view.showNewsLoading();

        this.controller.getNews(
            sourceId,
            (response: IArticlesResponse): void => {
                this.view.drawNews(response);
            },
            (message: string): void => {
                this.view.showNewsError(message);
            }
        );
    }

    private reloadNews(): void {
        if (this.activeSourceId !== null) {
            this.loadNews(this.activeSourceId);
        }
    }

    private renderCurrentYear(): void {
        getElement<HTMLElement>('.footer__year').textContent = `© ${new Date().getFullYear()}`;
    }
}

export default App;
