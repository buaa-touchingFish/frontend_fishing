<template>
    <div class="platformTop">
        <n-statistic label="今日访问" :value="11451444">
            <template #prefix>
                <n-icon>
                    <GlobeSearch24Filled />
                </n-icon>
            </template>
            <template #suffix>

            </template>
        </n-statistic>
    </div>
    <div class="platformBottom">
        <n-statistic label="收录文章" tabular-nums>
            <template #prefix>
                <n-icon>
                    <DocumentBulletListMultiple24Filled></DocumentBulletListMultiple24Filled>
                </n-icon>
            </template>
            <n-number-animation ref="numberAnimationInstRef" :from="0" :to="11451400" :duration="1000" />
            <template #suffix>
                篇
            </template>
        </n-statistic>
        <n-statistic label="入驻学者" tabular-nums>
            <template #prefix>
                <n-icon>
                    <PeopleQueue24Filled />
                </n-icon>
            </template>
            <n-number-animation ref="numberAnimationInstRef" :from="0" :to="114514" :duration="1000" />
            <template #suffix>
                位
            </template>
        </n-statistic>
    </div>
</template>

<script setup lang="ts">
import { GlobeSearch24Filled, DocumentBulletListMultiple24Filled, PeopleQueue24Filled } from '@vicons/fluent'
import { NumberAnimationInst } from 'naive-ui'
import { ref } from 'vue';

const numberAnimationInstRef = ref<NumberAnimationInst | null>(null)
</script>

<style scoped>
.platformTop {

}

.platformBottom {

}

</style>