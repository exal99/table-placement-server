<template>
    <table :style="{'position': 'absolute','transform': `translate(${pos.x}px, ${pos.y}px) scale(${scale})`}" ref="table-container" class="table-container">
        <tr>
            <td/>

            <td>
                <div class="chair-row" style="flex-flox: row nowrap;">
                    <Chair v-for="[id, name] in chairs[1].entries()"
                    :key="id + name"
                    :name="name"
                    :id="[1,id]"
                    v-on:update:name="updateName"/>
                </div>
            <td/>

            <td/>
        </tr>

        <tr>
            <td>
                <div class="chair-row" style="flex-flow: column nowrap;">
                    <Chair v-for="[id, name] in chairs[0].entries()"
                    :key="id + name"
                    :name="name"
                    :id="[0,id]"
                    v-on:update:name="updateName"/>
                </div>

            </td>

            <td>
                <div class="table" :style="{'height':tableHeight + 'px', 'width':tableWidth + 'px'}" @click="selected = true" v-click-outside="onOutside" ref="table">
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
                    :key="id + name"
                    :name="name"
                    :id="[2,id]"
                    v-on:update:name="updateName"/>
                </div>

            </td>
        </tr>

        <tr>
            <td/>

            <td>
                <div class="chair-row" style="flex-flow: row nowrap;">
                    <Chair v-for="[id, name] in chairs[3].entries()"
                    :key="id + name"
                    :name="name"
                    :id="[3,id]"
                    v-on:update:name="updateName"/>
                </div>
            </td>

            <td/>
        </tr>

    </table>
</template>

<script>

import Chair from './Chair.vue'
import Vector from '../vector.js'

export default {
    name: "TableVue",
    components: {Chair},

    data() {
        return {
            selected: false,
            strDimentions: this.dimentions,
            dimCopy: "",
            pos: new Vector(0,0),
            oldZoom: 1,
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
        },
        zoomPos: {
            type: Object,
            required: true
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
        zoomPos: {
            handler: function(newZoomPos) {
                const box = this.$refs["table-container"].getBoundingClientRect();
                const pos = new Vector(box.x + box.width/2, box.y + box.height/2);
                let dir = pos.sub(newZoomPos);
                const scaleChange = this.scale/this.oldZoom;
                this.pos = this.pos.add(dir.mult(scaleChange).sub(dir)); // (p-z) * s - (p-z)
                this.oldZoom = this.scale;
            },
            deep: true
        }
    },

    methods: {
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
        },

        updateName(event) {
            this.chairs[event.id[0]][event.id[1]] = event.n;
        }


    },

    mounted: function() {
        this.strDimentions = this.dimentions;
        this.oldZoom = this.scale;

        this.$refs['table-container'].drag = (dx, dy) => this.pos = this.pos.add(new Vector(dx, dy));

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