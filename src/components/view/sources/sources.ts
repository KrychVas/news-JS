import './sources.css';
import type { ISource } from '../../../types/api';
import { cloneTemplate, getElement, getElements } from '../../../utils/dom';

class Sources {
    private static readonly TEMPLATE_ID = 'sourceItemTemp';

    private readonly container: HTMLElement;

    public constructor(selector: string = '.sources') {
        this.container = getElement<HTMLElement>(selector);
    }

    public draw(sources: readonly ISource[]): void {
        const fragment: DocumentFragment = document.createDocumentFragment();

        sources.forEach((source: ISource) => {
            fragment.append(this.createChip(source));
        });

        this.container.replaceChildren(fragment);
    }

    public showLoading(): void {
        this.container.replaceChildren(this.createStatus('Loading sources…'));
    }

    public showError(message: string): void {
        const status: HTMLSpanElement = this.createStatus(message);
        status.classList.add('sources__status--error');
        this.container.replaceChildren(status);
    }

    public setActive(sourceId: string): void {
        getElements<HTMLButtonElement>('.source__item', this.container).forEach((item: HTMLButtonElement) => {
            const isActive: boolean = item.dataset.sourceId === sourceId;

            item.classList.toggle('source__item--active', isActive);
            item.setAttribute('aria-pressed', String(isActive));
        });
    }

    private createChip(source: ISource): DocumentFragment {
        const fragment: DocumentFragment = cloneTemplate(Sources.TEMPLATE_ID);
        const item: HTMLButtonElement = getElement<HTMLButtonElement>('.source__item', fragment);

        item.dataset.sourceId = source.id;
        item.title = source.description;
        item.setAttribute('aria-pressed', 'false');
        getElement<HTMLElement>('.source__item-name', fragment).textContent = source.name;

        return fragment;
    }

    private createStatus(message: string): HTMLSpanElement {
        const status: HTMLSpanElement = document.createElement('span');
        status.className = 'sources__status';
        status.textContent = message;

        return status;
    }
}

export default Sources;
