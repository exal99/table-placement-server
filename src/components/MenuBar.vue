<template>
    <div id="menu_bar">
        <div class="menu_item">
            <input type="text" class="p-name" placeholder="Project Name">
        </div>
        <div class="menu_item">                
            <p>Number of chairs:</p>
            <input type="text" class="n-chairs">
            <button>Update Project<font-awesome-icon :icon="['fas', 'sync']" class="ico"/></button>
            
        </div>
    </div>
</template>

<script>
export default {
    name: "MenuBar"
}
</script>

<style scoped>
#menu_bar {
    position: relative;
    padding: 10px 0;
    margin: auto;
    text-align: center;
    display: inline-block;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10;
    background: #0097e6;
    width: 100%;
}

.menu_item {
    margin-left: 10px;
    float: left;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 3%;
}

p {
    float: left;
    margin: auto 0px;
    font-size: 20px;
    user-select: none;
}

.p-name {
    width: 200px;
    float: left;
}

.n-chairs {
    width: 40px;
    float: left;
}


.ico {
    margin-left: 10px;
    transition: 400ms;
}

button:hover .ico {
    transform: rotate(180deg);
}

</style>