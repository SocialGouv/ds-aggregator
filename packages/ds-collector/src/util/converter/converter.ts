export const asTimestamp = (dateUTC?: string) => {
    if (dateUTC) {
        return new Date(dateUTC).getTime();
    }
    return null;
}
