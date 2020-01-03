<template>
    <table style="position:absolute;">
        <tr>
            <td/>

            <td>
                <div class="chair-row" style="flex-flox: row nowrap;">
                    <Chair v-for="[id, name] in chairs[0].entries()"
                    :key="id"
                    :name.sync="name" />
                </div>
            <td/>

            <td/>
        </tr>

        <tr>
            <td>
                <div class="chair-row" style="flex-flow: column nowrap;">
                    <Chair v-for="[id, name] in chairs[2].entries()"
                    :key="id"
                    :name.sync="name" />
                </div>

            </td>

            <td>
                <div class="table" :style="{'height':tableHeight + 'px'}"></div>
            </td>

            <td>
                <div class="chair-row" style="flex-flow: column nowrap;">
                    <Chair v-for="[id, name] in chairs[3].entries()"
                    :key="id"
                    :name.sync="name" />
                </div>

            </td>
        </tr>

        <tr>
            <td/>

            <td>
                <div class="chair-row" style="flex-flow: row nowrap;">
                    <Chair v-for="[id, name] in chairs[1].entries()"
                    :key="id"
                    :name.sync="name" />
                </div>
            </td>

            <td/>
        </tr>

    </table>
</template>

<script>

import Chair from './Chair.vue'
import interact from 'interactjs'

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
    },

    watch: {
        chairs: function() {
            console.log("ok");
            interact(".table").draggable({
                modifiers: [this.getModifiers()]
            });
        }
    },

    methods: {
        getModifiers() {
            const left = -1/Math.max(this.chairs[0].length, this.chairs[1].length, 1);
            const right = 1 - left;
            const top = -1/Math.max(this.chairs[2].length, this.chairs[3].length, 1);
            const bottom = 1 - top;
            console.log({left, right, top, bottom});
            return interact.modifiers.restrictRect({
                restriction: "#table-background",
                endOnly: true,
                elementRect: {left, right, top, bottom}
            });
        }
    },

    mounted: function() {
        let dragMoveListener = (event) => {
            let target = event.target.parentElement.parentElement.parentElement;

            // keep the dragged position in the data-x/data-y attributes
            let x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
            let y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

            // translate the element
            target.style.webkitTransform =
                target.style.transform =
                'translate(' + x + 'px, ' + y + 'px)';

            // update the posiion attributes
            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
        }

        const modifiers = this.getModifiers();

        interact(".table")
        .draggable({
            inertia: true,

            modifiers: [modifiers],

            onmove: dragMoveListener

        });
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