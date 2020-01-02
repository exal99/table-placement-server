<template>
    <div style="position:absolute;">
        <div class="above chair-row">
            <Chair v-for="[id, name] in chairs[0].entries()"
            :key="id"
            :name="name" />
        </div>
        <div class="table"></div>
        <div class="below chair-row">
            <Chair v-for="[id, name] in chairs[1].entries()"
            :key="id"
            :name="name" />
        </div>

    </div>
</template>

<script>

import Chair from './Chair.vue'

export default {
    name: "TableVue",
    components: {Chair},
    props: {
        chairs: {
            type: Array,
            required: true
        }
    }
}
</script>

<style scoped>

.chair-row {
    display: table;
    border: 0;
    margin: 0;
    border-collapse: separate;
    border-spacing: 10px;
}

.table {
    height: 150px;
    width: inherit;
    background-color: #dcdde1;
    border: 3px solid #000000;
    padding: 0;
    margin: 0;
    border-radius: 20px;
    touch-action: none;
    user-select: none;
}

</style>