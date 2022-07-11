<script setup lang="ts">
import { useScheduleStore } from "@/stores/schedule";
import dayjs from "dayjs";
import calendar from "dayjs/plugin/calendar";
dayjs.extend(calendar);

const props = defineProps<{
    date: dayjs.Dayjs;
    shift: string;
}>();

const scheduleStore = useScheduleStore();
</script>

<template>
    <div class="shift">
        <p class="date">{{ date.calendar() }}</p>
        <p
            :style="{
                '--shift-color-hue': scheduleStore.getShiftHue(shift),
                '--shift-color-text-lightness':
                    scheduleStore.getShiftTextLightness(shift, 'light'),
                '--shift-color-text-lightness-dark':
                    scheduleStore.getShiftTextLightness(shift, 'dark'),
            }"
            class="shift-type"
        >
            {{ shift }}
        </p>
    </div>
</template>

<style lang="scss" scoped>
.shift {
    display: grid;
    grid-template-columns: 1fr max-content;
    border: 1px solid var(--color-background-mute);

    * {
        padding: 1rem;
    }

    .shift-type {
        width: 4rem;
        display: grid;
        place-content: center;
        background-color: hsl(var(--shift-color-hue), 90%, 45%);
        color: hsl(
            var(--shift-color-hue),
            30%,
            var(--shift-color-text-lightness)
        );

        transition: background-color 250ms ease-in;

        @media (prefers-color-scheme: dark) {
            background-color: hsl(var(--shift-color-hue), 90%, 30%);
            color: hsl(
                var(--shift-color-hue),
                30%,
                var(--shift-color-text-lightness-dark)
            );
        }
    }
}
</style>
