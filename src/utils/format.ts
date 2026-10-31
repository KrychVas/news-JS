const UNKNOWN_DATE = '—';

/**
 * Formats an ISO date coming from the News API into a short human readable
 * string, e.g. `Feb 12, 2024`.
 */
export function formatPublishDate(isoDate: string): string {
    const date = new Date(isoDate);

    if (Number.isNaN(date.getTime())) {
        return UNKNOWN_DATE;
    }

    return date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}
