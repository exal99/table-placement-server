<template>
    <div class="background">
        <Table v-for="table in tables"
        :key="table.id"
        :chairs="table.chairs"
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
            ]
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