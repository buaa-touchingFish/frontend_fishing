<template>
    <div class="login-out-container">
        <div class="background">
            <StarBackground />
        </div>
        <div class="login-in-container">
            <!-- <div class="login-left">
                <Earth></Earth>
            </div> -->
            <div class="login-right">
                <LoginForm />
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import LoginForm from '@/components/Login/LoginForm.vue';
import StarBackground from '@/components/Login/StarBackground.vue';
// import Earth from '@/components/Login/Earth.vue';
</script>

<style scoped>
.login-out-container {
    position: relative;
    
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;

    .background {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 0;
    }
    .login-in-container {
        z-index: 1;
        width: 60%;
        min-width: 600x;
        height: 60%;
        min-height: 500px;
        flex-direction: row;
        display: flex;
        justify-content: center;
        border-radius: 10px;
        overflow: hidden;
        background-color: white;
        opacity: 0.9;
        box-shadow: 0 0 10px 10px white;;
        backdrop-filter: blur(50px);

        .login-left {
            width: 60%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }

        .login-right {
            width: 60%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            /* padding: 30px; */
        }
    }

}</style>