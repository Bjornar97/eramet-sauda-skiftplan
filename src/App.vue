<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import {
    CalendarMinus as CalendarMinusIcon,
    CalendarMonth as CalendarMonthIcon,
    Close as CloseIcon,
} from "mdue";
import { useScheduleStore } from "./stores/schedule";
import { computed } from "@vue/reactivity";
import GroupSelect from "./components/GroupSelect.vue";
import { ref } from "vue";

const scheduleStore = useScheduleStore();

const selectedGroup = computed(() => scheduleStore.selectedGroup);
const groups = computed(() => {
    return scheduleStore.groups.map((item) => {
        return {
            id: item,
            label: item,
        };
    });
});

const isInstalled = () => {
    // Do not show on desktop
    if (window.matchMedia("(min-width: 768px)").matches) return true;

    // For iOS
    // @ts-ignore
    if (window.navigator?.standalone) return true;

    // For Android
    if (window.matchMedia("(display-mode: standalone)").matches) return true;

    // If neither is true, it's not installed
    return false;
};

const showInstallCard = ref(false);

let defferedPrompt: null | any;

window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    defferedPrompt = event;

    showInstallCard.value = !isInstalled();
});

const install = () => {
    defferedPrompt?.prompt();

    defferedPrompt?.userChoise.then((choice: any) => {
        defferedPrompt = null;
    });
};
</script>

<template>
    <header>
        <div class="install-card" v-if="showInstallCard">
            <p>Installer som app</p>
            <button class="button" @click="install">Installer</button>
            <button class="icon-button">
                <CloseIcon
                    width="2rem"
                    height="2rem"
                    @click="showInstallCard = false"
                ></CloseIcon>
            </button>
        </div>
        <h1 class="title">Velg skift</h1>
        <nav class="group-select-nav">
            <GroupSelect
                class="group-select"
                v-model="selectedGroup"
                :options="groups"
                @change="scheduleStore.setSelectedGroup($event.toString())"
            ></GroupSelect>
        </nav>
    </header>

    <main>
        <RouterView />
    </main>

    <footer>
        <nav>
            <RouterLink class="nav-link bold has-accent-icon" to="14-days">
                <span>14</span>
                <CalendarMinusIcon class="accent-icon"></CalendarMinusIcon>
            </RouterLink>

            <RouterLink class="nav-link bold" to="month">
                <CalendarMonthIcon class="nav-icon"></CalendarMonthIcon>
            </RouterLink>
        </nav>
    </footer>
</template>

<style lang="scss">
@import "@/assets/main.css";

#app {
    max-width: 1280px;
    margin: 0 auto;
    font-weight: normal;
    margin-bottom: 10rem;
}

header,
main {
    margin: 0 1rem;
}

.install-card {
    display: grid;
    grid-template-columns: 1fr max-content max-content;
    align-items: center;
    margin-block-start: 1rem;
    padding: 1.5rem;
    border: var(--color-background-soft);
    background-color: var(--color-background-mute);
    border-radius: 0.5rem;

    p {
        font-size: 1.2rem;
    }

    .button {
        padding: 0.75rem 1.5rem;
        background-color: var(--color-primary);
        color: hsl(var(--color-primary-hue), var(--color-primary-sat), 85%);
        border: none;
        border-radius: 0.3rem;
        font-size: 1.2rem;
    }

    .icon-button {
        background-color: transparent;
        border: none;
        width: 2rem;
        height: 2rem;
        color: var(--color-text);
    }
}

.title {
    margin-top: 1rem;
}

.group-select {
    margin-block: 1rem;
    justify-self: center;
    padding: 0;
    align-items: center;

    * {
        flex-grow: 1;
    }
}

footer {
    position: fixed;
    display: grid;
    justify-content: center;
    height: max-content;
    bottom: 0;
    right: 0;
    left: 0;
    background-color: var(--color-background-mute);
    padding: 0.5rem;
    z-index: 99;

    nav {
        display: flex;
        width: max-content;
        align-content: space-between;
        gap: 1.5rem;

        .nav-icon {
            width: 2rem;
            height: 2rem;
            color: #777;
        }

        .nav-link {
            font-size: 1.5rem;
            text-decoration: none;
            color: var(--color-text);

            &.has-accent-icon {
                margin-right: 1rem;
            }

            .accent-icon {
                position: absolute;
                z-index: -1;
                right: -0.7em;
                width: 1rem;
            }
        }

        .router-link-active {
            .nav-icon {
                color: var(--color-primary);
            }

            &.nav-link {
                color: var(--color-primary);
            }
        }
    }
}
</style>
