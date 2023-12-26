<template>
    <div class="container">
        <DetailComponent :paper_id="route.params.id"/>
    </div>
</template>

<script setup lang='ts'>
import DetailComponent from '@/components/detail/DetailComponent.vue'
import router from '@/router';
import { onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router'

const route = useRoute()
onMounted(() => {
    if (window.history) {
        history.pushState(null, "", document.URL)
        window.addEventListener('popstate', back, false);
    }
});
onUnmounted(() => {
    window.removeEventListener('popstate', back, false);
})
function back() {
    console.log("back");
    let doc = document as any;
    let pro = new Promise((re, rj) => {
        let r = router as any;
        r["re"] = re;
        setTimeout(() => {
            rj(123);
        }, 1000);
    });
    doc.startViewTransition(async () => {
        await pro;
    })
    router.back();
}
</script>

<style scoped>
.container{
    width: 80%;
    margin-top: 20px;
    display: flex;
    flex-direction: column;
}
</style>