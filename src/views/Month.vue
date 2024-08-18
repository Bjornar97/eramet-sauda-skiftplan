<script setup lang="ts">
import { useScheduleStore } from "@/stores/schedule";
import { computed, ref, watch } from "vue";
import FullCalendar from "@fullcalendar/vue3";
import dayGridMonthPlugin from "@fullcalendar/daygrid";
import type {
    CalendarOptions,
    EventSourceFuncArg,
    EventInput,
} from "@fullcalendar/core";
import dayjs from "dayjs";
import debounce from "debounce";
import nbLocale from "@fullcalendar/core/locales/nb";
import { onMounted } from "vue";

const scheduleStore = useScheduleStore();

const matchMedia = window.matchMedia("(prefers-color-scheme: dark)");

const isDark = ref(matchMedia.matches);

matchMedia.addEventListener("change", (e) => {
    isDark.value = e.matches;
});

const fullCalendar = ref<InstanceType<typeof FullCalendar> | null>(null);

const windowSize = ref(window.innerWidth);

window.addEventListener(
    "resize",
    debounce(() => {
        windowSize.value = window.innerWidth;
    }, 100)
);

watch(
    () => scheduleStore.selectedGroup,
    () => {
        if (!fullCalendar.value) {
            return;
        }

        fullCalendar.value.getApi().refetchEvents();
    }
);

const calendarOptions = computed((): CalendarOptions => {
    return {
        locale: nbLocale,
        plugins: [dayGridMonthPlugin],
        initialView: "dayGridMonth",
        height: "70dvh",
        dayMaxEvents: 1,
        weekNumbers: true,

        customButtons: {
            prevYear: {
                text: "<<",
                click: function () {
                    fullCalendar.value?.getApi().incrementDate({ years: -1 }); // Move back by one year
                },
            },
            nextYear: {
                text: ">>",
                click: function () {
                    fullCalendar.value?.getApi().incrementDate({ years: 1 }); // Move forward by one year
                },
            },
        },

        // Add custom buttons to the header
        headerToolbar: {
            start: "title today",
            end: "prevYear,prev,next,nextYear",
        },

        buttonText: {
            today: "Gå til i dag",
        },

        // Remove dots from day numbers in the calendar grid
        dayCellContent: (arg) => {
            return arg.dayNumberText.replace(".", "");
        },

        dayHeaderContent: (arg) => {
            return arg.text.replace(".", "");
        },

        events: async (info: EventSourceFuncArg) => {
            let currentDay = dayjs(info.startStr);
            const endDay = dayjs(info.endStr);

            const events: EventInput[] = [];

            while (currentDay.isBefore(endDay)) {
                const shift = scheduleStore.getShift(
                    scheduleStore.selectedGroup,
                    currentDay.toDate()
                );

                if (shift === "Fri") {
                    currentDay = currentDay.add(1, "day");
                    continue;
                }

                const hue = scheduleStore.getShiftHue(shift);
                const lightness = isDark ? "30%" : "45%";
                const color = `hsl(${hue}, 90%, ${lightness})`;

                events.push({
                    date: currentDay.toDate(),
                    allDay: true,
                    title: shift,
                    color,
                    overlap: false,
                });

                currentDay = currentDay.add(1, "day");
            }

            return events;
        },
    };
});

// Variables to track touch positions
let touchStartX = 0;
let touchEndX = 0;

const handleSwipe = () => {
    if (!fullCalendar.value) {
        return;
    }

    if (touchEndX < touchStartX - 70) {
        // Swipe left threshold
        fullCalendar.value.getApi().next(); // Go to the next month
    }
    if (touchEndX > touchStartX + 70) {
        // Swipe right threshold
        fullCalendar.value.getApi().prev(); // Go to the previous month
    }
};

onMounted(() => {
    if (!fullCalendar.value) {
        return;
    }

    const element = document.querySelector(".calendar-wrapper") as HTMLElement;

    if (!element) {
        return;
    }

    element.addEventListener("touchstart", (event: TouchEvent) => {
        touchStartX = event.changedTouches[0].screenX;
    });

    element.addEventListener("touchend", (event: TouchEvent) => {
        touchEndX = event.changedTouches[0].screenX;
        handleSwipe();
    });
});
</script>

<template>
    <div class="calendar-wrapper">
        <FullCalendar
            ref="fullCalendar"
            :options="calendarOptions"
        ></FullCalendar>
    </div>
</template>

<style lang="scss">
.calendar-wrapper {
    --fc-border-color: #eee;
    --fc-today-bg-color: hsla(50, 100%, 58%, 0.5);

    .fc-header-toolbar {
        margin-inline: 0.5rem;
    }

    .fc-toolbar-title {
        font-size: 1.2rem;
        text-transform: capitalize;
    }

    .fc-today-button {
        margin: 0 !important;
    }

    .fc-daygrid-week-number {
        bottom: 0;
        top: unset;
        font-size: 0.8rem;
        padding: 0;
        padding-left: 0.1rem;
    }

    .fc-daygrid-day-frame {
        min-height: 5.2rem;
        height: 100%;
    }

    .fc-day-other .fc-daygrid-day-events {
        opacity: 0.6;
    }

    .fc-event-title-container {
        text-align: center;
    }
}

@media screen and (min-width: 768px) {
    .fc-daygrid-week-number {
        font-size: 1rem;
        margin: 0.3rem;
    }

    .fc-event-title-container {
        text-align: center;
        padding-block: 0.4rem;
    }
}

@media (prefers-color-scheme: dark) {
    .calendar-wrapper {
        --fc-border-color: #666;
        --fc-today-bg-color: hsla(50, 100%, 58%, 0.25);
        --fc-neutral-bg-color: var(--color-background-soft);
        --fc-neutral-text-color: var(--color-text);
        --fc-page-bg-color: var(--color-background-soft);
    }
}
</style>
