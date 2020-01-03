<template>
    <div class="container">
        <div class="content" contenteditable="true" @input="onEdit" @keydown.enter="onEnter">
            {{ localName }}
        </div>
       
    </div>
</template>

<script>
export default {
    name: "ChairVue",
    data () {
        return {
            localName: this.name
        }
    },

    props: {
        name: {
            type:String,
            required: false,
            default: ''
        }
    },

    methods: {
        onEdit(event) {
            const src = event.target.innerHTML;
            this.localName = src;
            this.$emit('update:name', this.localName);
        },

        onEnter() {
            console.log(this.$el.querySelector(".content"));
            this.$el.querySelector(".content").blur();
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

