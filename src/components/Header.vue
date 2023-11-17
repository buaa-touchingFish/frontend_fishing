<template>
    <div class="headerContainer">
        <div class="headerLeft">
            <div class="logo" @click="$router.push('/')">
                logo
            </div>
            <div class="searchInput">
                <n-input></n-input>
            </div>
        </div>
        <div class="headerRight">
            <div class="user">
                user
            </div>
            <div class="setting">
                setting
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue';

</script>

<style scoped>
.headerContainer{
    width: 70%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.headerLeft{
    width: 70%;
    height: 100%;
    background-color: green;
    display: flex;
    align-items: center;
}
.headerRight{
    width: 30%;
    height: 100%;
    background-color: blue;
    display: flex;
    flex-direction: row-reverse;
}
.logo{
    width: 20%;
    height: 100%;
    background-color: #222;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    cursor: pointer;
}
.user{
    height: 100%;
    width: 50px;
    background-color: #555;
}
.setting{
    height: 100%;
    width: 50px;
    background-color: #777;
}
</style>
