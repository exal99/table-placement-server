<template>
    <div class="container">
        <div class="content" contenteditable="true">
            {{ name }}
        </div>
       
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

.container {
    margin: 10px;
    /*height: 150px;
    width: 150px;*/
    min-width: 150px;
    min-height: 150px;
    font-size: 20px;
    background-color: #353b48;
    color: #fff;
    display:table;
    text-align: center
}

.content {
    font-size: 20px;
    background-color: #353b48;
    color: #fff;
    display:table-cell;
    vertical-align: middle;
}

</style>

