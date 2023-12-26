<template>
    <div class="container">
        <DetailComponent :paper_id="route.params.id" />
    </div>
</template>

<script setup lang='ts'>
import DetailComponent from '@/components/detail/DetailComponent.vue'
import { useRoute } from 'vue-router'
import { onMounted } from 'vue'
import { useMessage } from 'naive-ui'
const message = useMessage();
import { post } from '@/api/axios';
const route = useRoute();
onMounted(async () => {
    await post(message, '/history/create', { 'paper_id': route.params.id });
})
//await post(message, '/history/create', { 'paper_id': route.params.id });
</script>

<style scoped>
.container {
    width: 80%;
    margin-top: 20px;
    display: flex;
    flex-direction: column;
}
</style>