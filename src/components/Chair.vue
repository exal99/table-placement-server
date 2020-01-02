<template>
    <div contenteditable="true">
        {{ name }}
    </div>
</template>

<script>
export default {
    name: "ChairVue",
    props: {
        name: {
            type:String,
            required: true
        }
    }
}
</script>

<style scoped>

div {
    height: 150px;
    width: 150px;
    min-width: 150px;
    min-height: 150px;
    font-size: 20px;
    display: table-cell;
    vertical-align: middle;
    text-align: center;
    background-color: #353b48;
    color: #fff;
}

</style>

