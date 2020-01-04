<template>
    <table :style="{'position': 'absolute','transform': `translate(${translateX}px, ${translateY}px) scale(${scale})`}">
        <tr>
            <td/>

            <td>
                <div class="chair-row" style="flex-flox: row nowrap;">
                    <Chair v-for="[id, name] in chairs[1].entries()"
                    :key="id"
                    :name.sync="name" />
                </div>
            <td/>

            <td/>
        </tr>

        <tr>
            <td>
                <div class="chair-row" style="flex-flow: column nowrap;">
                    <Chair v-for="[id, name] in chairs[0].entries()"
                    :key="id"
                    :name.sync="name" />
                </div>

            </td>

            <td>
                <div class="table" :style="{'height':tableHeight + 'px', 'width':tableWidth + 'px'}" @click="selected = true" v-click-outside="onOutside">
                    <div v-if="selected" class="selected">
                        <p class="shape-text flex-item">Shape:</p>
                        <input type="text" class="input-field  flex-item no-drag"
                        v-model="strDimentions"
                        @keydown.enter="onEnter"
                        @blur="onBlur">
                        <button class="update-button flex-item no-drag" @click="onUpdateButton">Update</button>
                    </div>
                </div>
            </td>

            <td>
                <div class="chair-row" style="flex-flow: column nowrap;">
                    <Chair v-for="[id, name] in chairs[2].entries()"
                    :key="id"
                    :name.sync="name" />
                </div>

            </td>
        </tr>

        <tr>
            <td/>

            <td>
                <div class="chair-row" style="flex-flow: row nowrap;">
                    <Chair v-for="[id, name] in chairs[3].entries()"
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

    data() {
        return {
            selected: true,
            strDimentions: this.dimentions,
            dimCopy: "",
            translateX: 0,
            translateY: 0
        };
    },

    props: {
        chairs: {
            type: Array,
            required: true
        },
        scale: {
            type: Number,
            default: 0.7
        }
    },

    computed: {
        tableHeight: function () {
            const height = Math.max(this.chairs[0].length, this.chairs[2].length, 1) * 170;
            return height;
        },

        tableWidth: function () {
            const width = Math.max(this.chairs[1].length, this.chairs[3].length, 1) * 170;
            return width;
        },

        dimentions: function() {
            const chairs = this.chairs;
            const dim = [chairs[0].length, chairs[1].length, chairs[2].length, chairs[3].length];

            return dim.join('x');
        }
    },

    watch: {
        chairs: function() {
            interact(".table").draggable({
                modifiers: [this.getModifiers()]
            });
        }
    },

    methods: {
        getModifiers() {
            const left = -1/Math.max(this.chairs[1].length, this.chairs[3].length, 1);
            const right = 1 - left;
            const top = -1/Math.max(this.chairs[0].length, this.chairs[2].length, 1);
            const bottom = 1 - top;
            return interact.modifiers.restrictRect({
                restriction: "#table-background",
                endOnly: true,
                elementRect: {left, right, top, bottom}
            });
        },

        onBlur() {
            this.dimCopy = this.strDimentions;
            this.strDimentions = this.dimentions;
        },

        onOutside() {
            this.selected = false;
        },

        onEnter() {
            this.updateSize(this.strDimentions);
        },

        onUpdateButton() {
            this.updateSize((this.dimCopy !== "") ? this.dimCopy : this.strDimentions);
        },

        updateSize(value) {
            const dim = value.split('x').map((x) => parseInt(x));

            for (const [ind, row] of this.chairs.entries()) {
                if (row.length !== dim[ind].length) {
                    while (row.length > dim[ind]) {
                        row.pop();
                    }

                    while (row.length < dim[ind]) {
                        row.push("");
                    }
                }
            }

            this.dimCopy = "";
            this.strDimentions = this.dimentions;
        }


    },

    mounted: function() {
        this.strDimentions = this.dimentions;
        let dragMoveListener = (event) => {
            this.translateX += event.dx;
            this.translateY += event.dy;
        }

        const modifiers = this.getModifiers();

        interact(".table")
        .draggable({
            inertia: true,
            ignoreFrom: ".no-drag",

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

.selected {
    display:flex;
    flex-flow: row wrap;
    justify-content: space-around;
    align-content: center;
    height:100%;
}

.flex-item {
    margin: 5px 10px;
}

.shape-text {
    width: 100px;
    font-size: 30px;
}

.input-field {
    width: 150px;
    height: 25px;
}

.update-button {
    width: 150px;
    height: 33px;
}

</style>