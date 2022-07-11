<script setup lang="ts">
import { useScheduleStore } from "@/stores/schedule";
import type { VCalendarDay } from "@/types/VCalendar";
import { computed, ref } from "@vue/reactivity";
import dayjs from "dayjs";
import { Calendar } from "v-calendar";
import CalendarDay from "../components/CalendarDay.vue";

const scheduleStore = useScheduleStore();

const matchMedia = window.matchMedia("(prefers-color-scheme: dark)");

const isDark = ref(matchMedia.matches);

matchMedia.addEventListener("change", (e) => {
    isDark.value = e.matches;
});
</script>

<template>
    <div>
        <Calendar
            :is-dark="isDark"
            class="calendar"
            :masks="{
                weekdays: 'WWW',
            }"
            is-expandable
        >
            <template v-slot:day-content="{ day }: { day: VCalendarDay }">
                <CalendarDay :day="day"></CalendarDay>
            </template>
        </Calendar>
    </div>
</template>

<style lang="scss">
@import "v-calendar/dist/style.css";

.calendar.vc-container {
    --day-border: 1px solid #b8c2cc;
    --day-border-highlight: 1px solid #b8c2cc;
    --day-width: 1rem;
    --day-height: clamp(5rem, 9vw, 7.5rem);
    --weekday-bg: #f8fafc;
    --weekday-border: 1px solid #eaeaea;
    border-radius: 0;
    width: 100%;

    --calendar-bg-color: white;
    --weekend-bg-color: white;

    &.vc-is-dark {
        --calendar-bg-color: var(--color-background-soft);
        --weekend-bg-color: var(--color-background-muted);

        --day-border: 1px solid #50555a;
        --day-border-highlight: 1px solid #50555a;

        --weekday-bg: #3b3b3b;
        --weekday-border: 1px solid #808080;
    }

    & .vc-header {
        background-color: var(--calendar-bg-color);
        padding: 10px 0;
    }
    & .vc-weeks {
        padding: 0;
    }
    & .vc-weekday {
        background-color: var(--weekday-bg);
        border-bottom: var(--weekday-border);
        border-top: var(--weekday-border);
        padding: 5px 0;
    }
    & .vc-day {
        padding: 0 5px 3px 5px;
        text-align: left;
        height: var(--day-height);
        min-width: var(--day-width);
        background-color: var(--calendar-bg-color);
        &.weekday-1,
        &.weekday-7 {
            background-color: var(--weekend-bg-color);
        }
        &:not(.on-bottom) {
            border-bottom: var(--day-border);
            &.weekday-1 {
                border-bottom: var(--day-border-highlight);
            }
        }
        &:not(.on-right) {
            border-right: var(--day-border);
        }
    }
    & .vc-day-dots {
        margin-bottom: 5px;
    }
}
</style>
