export interface VCalendarDay {
    id: string;
    label: string;
    ariaLabel: string;
    day: number;
    attributes: Object[];
    classes: string[];
    date: Date;
    isToday: boolean;
    isFirstDay: boolean;
    isLastDay: boolean;
    inMonth: boolean;
    inPrevMonth: boolean;
    inNextMonth: boolean;
}
