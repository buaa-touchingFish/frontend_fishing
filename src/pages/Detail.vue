<template>
    <div class="container">
        <DetailComponent :paper_id="route.params.id"/>
    </div>
</template>

<script setup lang='ts'>
import DetailComponent from '@/components/detail/DetailComponent.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<style scoped>
.container{
    width: 80%;
    margin-top: 20px;
    display: flex;
    flex-direction: column;
}
</style>