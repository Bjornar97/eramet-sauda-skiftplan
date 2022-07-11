<script setup lang="ts">
import { defineProps, ref } from "vue";
import type { VCalendarDay } from "@/types/VCalendar";
import { computed } from "@vue/reactivity";
import { useScheduleStore } from "@/stores/schedule";

const props = defineProps<{
    day: VCalendarDay;
}>();

const scheduleStore = useScheduleStore();

const currentGroup = computed(() => scheduleStore.selectedGroup);

const shift = computed(() =>
    scheduleStore.getShift(currentGroup.value, props.day.date)
);

const hue = computed(() => scheduleStore.getShiftHue(shift.value));

const textLightness = computed(() =>
    scheduleStore.getShiftTextLightness(shift.value, "light")
);

const textLightnessDark = computed(() =>
    scheduleStore.getShiftTextLightness(shift.value, "dark")
);
</script>

<template>
    <div class="day" :aria-label="day.ariaLabel">
        <div
            :class="{
                'is-today': props.day.isToday,
            }"
            class="day-label"
        >
            <span>{{ props.day.label }}</span>
        </div>

        <Transition>
            <div
                v-if="shift !== 'Fri'"
                class="shift"
                :style="{
                    '--shift-color-hue': scheduleStore.getShiftHue(shift),
                    '--shift-color-text-lightness':
                        scheduleStore.getShiftTextLightness(shift, 'light'),
                    '--shift-color-text-lightness-dark':
                        scheduleStore.getShiftTextLightness(shift, 'dark'),
                }"
            >
                {{ shift }}
            </div>
        </Transition>
    </div>
</template>

<style lang="scss" scoped>
.day {
    display: grid;
    height: 100%;

    .shift {
        display: grid;
        place-content: center;
        margin-bottom: 0.5rem;
        border-radius: 0.4rem;
        height: 100%;
        background-color: hsl(var(--shift-color-hue), 90%, 45%);
        color: hsl(
            var(--shift-color-hue),
            30%,
            var(--shift-color-text-lightness)
        );

        transition: background-color 250ms ease-in, opacity 250ms ease-in;

        @media (prefers-color-scheme: dark) {
            background-color: hsl(var(--shift-color-hue), 90%, 30%);
            color: hsl(
                var(--shift-color-hue),
                30%,
                var(--shift-color-text-lightness-dark)
            );
        }
    }

    .day-label {
        display: grid;
        place-items: center;
        aspect-ratio: 1/1;
        margin-top: 5px;
        max-width: 2rem;

        &.is-today {
            color: var(--vt-c-text-dark-1);
            background-color: var(--color-primary);
            border-radius: 50%;
        }
    }
}

.v-enter-active,
.v-leave-active {
    transition: opacity 250ms ease-in;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}
</style>
