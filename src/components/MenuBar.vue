<template>
    <div id="menu_bar">
        <div id="left-item" class="menu_item">
            <input type="text" id="p-name" placeholder="Project Name">
        </div>
        <div id="right-item" class="menu_item">                
            <p>Number of chairs:</p>
            <input type="text" id="n-chairs">
            <button id="update">Update Project<font-awesome-icon :icon="['fas', 'sync']" id="ico"/></button>
            
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

input {
    margin-left: 5px;
    margin-right: 50px;
    background: #192a56;
    border-radius: 10px;
    padding: 4px;
    color: #ffffff;
    border: 0;
    font-size: 16px;
}

p {
    float: left;
    margin: auto 0px;
    font-size: 20px;
    user-select: none;
}

#p-name {
    width: 200px;
    float: left;
}

#n-chairs {
    width: 40px;
    float: left;
}

button {
    float: left;
    background-color: #192a56;
    color: #ffffff;
    border: 0;
    border-radius: 10px;
    padding: 4px 6px;
    font-size: 16px;
    user-select: none;
}

#ico {
    margin-left: 10px;
    transition: 400ms;
}

button:hover {
    background-color: #273c75;
}

button:hover #ico {
    transform: rotate(180deg);
}

button:active {
    background-color: #40739e;
}
</style>