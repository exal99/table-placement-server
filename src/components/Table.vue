<template>
    <table style="position:absolute;">
        <tr>
            <td/>

            <td>
                <div class="chair-row" style="flex-flox: row nowrap;">
                    <Chair v-for="[id, name] in chairs[0].entries()"
                    :key="id"
                    :name="name"
                    :tableStyle="'table-cell'" />
                </div>
            <td/>

            <td/>
        </tr>

        <tr>
            <td>
                <div class="chair-row" style="flex-flow: column nowrap;">
                    <Chair v-for="[id, name] in chairs[2].entries()"
                    :key="id"
                    :name="name" />
                </div>

            </td>

            <td>
                <div class="table" :style="{'height':tableHeight + 'px'}"></div>
            </td>

            <td>
                <div class="chair-row" style="flex-flow: column nowrap;">
                    <Chair v-for="[id, name] in chairs[3].entries()"
                    :key="id"
                    :name="name" />
                </div>

            </td>
        </tr>

        <tr>
            <td/>

            <td>
                <div class="chair-row" style="flex-flow: row nowrap;">
                    <Chair v-for="[id, name] in chairs[1].entries()"
                    :key="id"
                    :name="name"
                    :tableStyle="'table-cell'" />
                </div>
            </td>

            <td/>
        </tr>

    </table>
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
    },

    computed: {
        tableHeight: function () {
            const height = Math.max(this.chairs[2].length, this.chairs[3].length, 1) * 170;
            return height;
        }
    }
}
</script>

<style scoped>

td {
    position:relative;
}

.chair-row {
    /*position: absolute;*/
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-around;
    border: 0;
    margin: 0;
    border-collapse: separate;
    border-spacing: 10px;

}

.table {
    /*height: 150px;*/
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