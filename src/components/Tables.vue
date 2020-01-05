<template>
    <div id="table-background" class="background" @wheel="zoom">
        <Table v-for="table in tables"
        :key="table.id"
        :chairs="table.chairs"
        :scale="scale"
        :zoomPos="zoomPos"
        />
    </div>
</template>

<script>
import Table from './Table.vue'
import Vector from '../vector.js'
import interact from 'interactjs'

export default {
    name: "TablesVue",
    components: {
        Table
    },
    data () {
        return {
            tables: [
                {
                    id: 0,
                    chairs: [["a", "b"], ["c", ], ["d","e"], ["x"]]
                },
                //{
                //    id:1,
                //    chairs:[['a'],[],[],[]]
               // }
            ],

            scale: 0.7,
            zoomPos: new Vector(0,0)
        }
    },

    methods: {
        zoom(event) {
            this.scale -= event.deltaY * 0.01;
            this.scale = Math.max(this.scale, 0.1);

            this.zoomPos = new Vector(event.clientX, event.clientY);
        }
    },

    mounted: function() {
        let dragMoveListener = (event) => {
            event.target.drag(event.dx, event.dy);
        }


        interact(".table-container")
        .draggable({
            inertia: true,
            allowFrom: '.table',
            ignoreFrom: ".no-drag",

            modifiers: [interact.modifiers.restrictRect({
                restriction: '#table-background',
                endOnly: true
            })],

            onmove: dragMoveListener

        });
    }
}
</script>

<style scoped>

.background {
    width: 100%;
    height: 100%;
    background-color: #00a8ff;
    position: relative;
    flex-grow: 1;
    touch-action: none;
}
</style>