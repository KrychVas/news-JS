import type { IArticlesResponse, ISource, ISourcesResponse } from '../../types/api';
import AppController from '../controller/controller';
import AppView from '../view/appView';
import { getElement } from '../../utils/dom';

class App {
    private readonly controller: AppController;
    private readonly view: AppView;
    private activeSourceId: string | null = null;

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

                const firstSource: ISource | undefined = response.sources[0];

                if (firstSource !== undefined) {
                    this.activeSourceId = firstSource.id;
                    this.view.setActiveSource(firstSource.id);
                    this.loadNews(firstSource.id);
                }
            },
            (message: string): void => {
                this.view.showSourcesError(message);
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
