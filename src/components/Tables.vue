<template>
    <div id="table-background" class="background" @wheel="zoom">
        <Table v-for="table in tables"
        :key="table.id"
        :chairs="table.chairs"
        :scale="scale"
        />
    </div>
</template>

<script>
import Table from './Table.vue'

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
                }
            ],

            scale: 0.7
        }
    },

    methods: {
        zoom(event) {
            this.scale += event.deltaY * 0.01;

            this.scale = Math.max(this.scale, 0.1);
        }
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