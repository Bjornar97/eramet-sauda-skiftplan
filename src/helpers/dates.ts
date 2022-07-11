export const diffInDays = (first: Date, second: Date) => {
    return Math.round(
        (second.valueOf() - first.valueOf()) / (1000 * 60 * 60 * 24)
    );
};
