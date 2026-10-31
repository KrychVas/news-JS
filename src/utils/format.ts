const UNKNOWN_DATE = '—';

/**
 * Formats an ISO date coming from the News API into a short human readable
 * string, e.g. `12 лют. 2024 р.` for the `uk-UA` locale.
 */
export function formatPublishDate(isoDate: string): string {
    const date = new Date(isoDate);

    if (Number.isNaN(date.getTime())) {
        return UNKNOWN_DATE;
    }

    return date.toLocaleDateString('uk-UA', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}
