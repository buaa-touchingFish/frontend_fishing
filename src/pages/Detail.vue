<template>
    <div class="container">
        <DetailComponent/>
    </div>
</template>

<script setup lang='ts'>
import DetailComponent from '@/components/detail/DetailComponent.vue'
</script>

<style scoped>
.container{
    width: 80%;
    margin-top: 20px;
    display: flex;
    flex-direction: column;
}
</style>