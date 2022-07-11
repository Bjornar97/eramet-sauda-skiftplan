import { diffInDays } from "@/helpers/dates";
import dayjs from "dayjs";
import { defineStore } from "pinia";
import schedule from "./schedule.json";

export const useScheduleStore = defineStore({
    id: "schedule",
    state: () => ({
        schedule,
        selectedGroup: localStorage.getItem("selectedGroup") ?? "B",
    }),
    getters: {
        groups: (state) => {
            return state.schedule.groups;
        },
        getShiftHue: (state) => {
            return (shiftType: string) =>
                state.schedule.shiftTypes.find(
                    (item) => item.name === shiftType
                )?.colorHue;
        },
        getShiftTextLightness: (state) => {
            return (shiftType: string, mode: string = "light") => {
                const shift = state.schedule.shiftTypes.find(
                    (item) => item.name === shiftType
                );

                if (mode === "light") {
                    return shift?.lightnessText;
                }

                return shift?.darkLightnessText;
            };
        },
        getShift: (state) => {
            return (group: string, date: Date): "FM" | "EM" | "N" | "Fri" => {
                const groupOffset =
                    state.schedule.groups.findIndex((item) => item === group) *
                    state.schedule.shiftOffsetPerGroup;

                const dayFromStart = diffInDays(
                    new Date(state.schedule.startDate),
                    date
                );

                const maxIndex = state.schedule.schedule.length;

                let indexInSchedule = (dayFromStart % maxIndex) + groupOffset;

                if (indexInSchedule < 0) {
                    indexInSchedule = maxIndex + indexInSchedule;
                }

                if (indexInSchedule >= maxIndex) {
                    indexInSchedule = indexInSchedule - maxIndex;
                }

                const shift = state.schedule.schedule[indexInSchedule];

                if (
                    typeof shift === "string" &&
                    !["FM", "EM", "N", "Fri"].includes(shift)
                ) {
                    throw new Error(`Non existing shift found: ${shift}`);
                }

                // @ts-ignore
                return shift;
            };
        },
    },
    actions: {
        setSelectedGroup(group: string) {
            this.selectedGroup = group;
            localStorage.setItem("selectedGroup", group);
        },
    },
});
