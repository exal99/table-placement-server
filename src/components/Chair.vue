<template>
    <div class="container">
        <div class="content" contenteditable="true" @input="onEdit" @keydown.enter="onEnter">
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
            required: false,
            default: ''
        },
        id: {
            type:Array,
            required: true
        }
    },

    methods: {
        onEdit(event) {
            const src = event.target.innerHTML;
            this.$emit('update:name', {id: this.id, "n":src});
        },

        onEnter() {
            this.$el.querySelector(".content").blur();
        }
    }
}
</script>

<style scoped>

.container {
    margin: 10px;
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

