import type { Callback, ErrorCallback, IArticlesResponse, ISourcesResponse } from '../../types/api';
import { Endpoint } from '../../types/api';
import AppLoader from './appLoader';

class AppController extends AppLoader {
    private static readonly NEWS_PAGE_SIZE = 10;

    public getSources(callback: Callback<ISourcesResponse>, onError?: ErrorCallback): void {
        this.getResp<ISourcesResponse>({ endpoint: Endpoint.Sources }, callback, onError);
    }

    public getNews(sourceId: string, callback: Callback<IArticlesResponse>, onError?: ErrorCallback): void {
        this.getResp<IArticlesResponse>(
            {
                endpoint: Endpoint.Everything,
                query: {
                    sources: sourceId,
                    pageSize: String(AppController.NEWS_PAGE_SIZE),
                },
            },
            callback,
            onError
        );
    }
}

export default AppController;
