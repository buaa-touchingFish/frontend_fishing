<template>
    <div class="login-out-container">
        <div class="login-in-container">
            <div class="login-left">
                <div class="login-left-top">
                    <div class="login-left-title">
                        <n-h2>XX学术平台</n-h2>
                        <n-h3>探索学术海洋</n-h3>
                    </div>
                </div>
                <div class="login-left-bottom">
                    <img :src="planet" height="200" style="border-radius: 10px;">
                </div>
            </div>
            <div class="login-right">
                <LoginForm />
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import planet from '@/assets/planet.gif'
import LoginForm from '@/components/LoginForm.vue';
</script>

<style scoped>
.login-out-container {
    position: relative;
    background-image: url('@/assets/bg.jpg');
    background-size: cover;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;

    .login-in-container {
        width: 874px;
        min-width: 874px;
        height: 78%;
        min-height: 600px;
        flex-direction: row;
        display: flex;
        justify-content: space-evenly;
        border-radius: 10px;
        overflow: hidden;
        background-color: white;
        box-shadow: 0 0 20px 5px rgba(34, 84, 142, .26);

        .login-left {
            width: 50%;
            padding: 47px 54px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            .login-left-top {
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                align-items: flex-start;
                margin: 40px 0px;
            }

            .login-left-bottom {
                width: 100%;
                height: auto;
                margin: 0px 20px;
                display: flex;
                justify-content: center;
            }
        }

        .login-right {
            width: 50%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 30px;

        }
    }

}</style>