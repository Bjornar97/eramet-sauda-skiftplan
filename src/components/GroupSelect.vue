<script setup lang="ts">
const props = defineProps<{
    modelValue: number | string;
    options: {
        id: number | string;
        label: string;
    }[];
}>();

const emit = defineEmits<{
    (e: "change", id: number | string): void;
}>();
</script>

<template>
    <ul>
        <li
            v-for="option in props.options"
            :key="option.id"
            :class="{
                selected: option.id === props.modelValue,
            }"
        >
            <button @click="emit('change', option.id)">
                {{ option.label }}
            </button>
        </li>
    </ul>
</template>

<style lang="scss" scoped>
ul {
    list-style: none;
    display: flex;
    align-content: center;
    border: var(--color-background-mute);
    background-color: var(--color-background-mute);
    border-radius: 0.5rem;
    overflow: hidden;

    li {
        button {
            cursor: pointer;
            width: 100%;
            border: none;
            padding: 1rem 1.5rem;
            font-size: 1.4rem;
            background-color: transparent;
            color: var(--color-text);

            transition: background-color 250ms ease-in, color 250ms;
        }

        &.selected button {
            background-color: var(--color-primary);
            color: var(--color-text-invert);
        }
    }
}
</style>
