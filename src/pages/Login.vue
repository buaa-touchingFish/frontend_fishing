<template>
    <div class="login-out-container">
        <div class="background">
            <!-- <StarBackground /> -->
        </div>
        <div class="login-in-container">
            <div class="login-left">
                <div class="login-left-top">
                    <div class="login-left-title">
                        <Earth></Earth>
                    </div>
                </div>
                <div class="login-left-bottom">
                    
                </div>
            </div>
            <div class="login-right">
                <LoginForm />
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import LoginForm from '@/components/LoginForm.vue';
import StarBackground from '@/components/StarBackground.vue';
import Earth from '@/components/Earth.vue';
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
        min-height: 550px;
        flex-direction: row;
        display: flex;
        justify-content: space-evenly;
        border-radius: 10px;
        overflow: hidden;
        background-color: white;
        opacity: 0.9;
        box-shadow: 0 0 10px 10px white;;
        backdrop-filter: blur(50px);

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