<template>
    <div class="platformTop">
        <n-h1 style="margin-left: 10%;">信息概况</n-h1>
        <div class="platformTopBottom">
            <n-statistic class="item" label="今日访问" tabular-nums>
                <template #prefix>
                    <n-icon>
                        <GlobeSearch24Filled />
                    </n-icon>
                </template>
                <n-number-animation ref="numberAnimationInstRef" :from="0" :to="11451444" :duration="1000" />
            </n-statistic>
            <n-statistic class="item" label="收录文章" tabular-nums>
                <template #prefix>
                    <n-icon>
                        <DocumentBulletListMultiple24Filled></DocumentBulletListMultiple24Filled>
                    </n-icon>
                </template>
                <n-number-animation ref="numberAnimationInstRef" :from="0" :to="11451400" :duration="1000" />
            </n-statistic>
            <n-statistic class="item" label="入驻学者" tabular-nums>
                <template #prefix>
                    <n-icon>
                        <PeopleQueue24Filled />
                    </n-icon>
                </template>
                <n-number-animation ref="numberAnimationInstRef" :from="0" :to="114514" :duration="1000" />
            </n-statistic>
        </div>
    </div>
    <div class="platformBottom">
        <n-h1 style="margin-left: 10%;">近日访问</n-h1>
        <div class="card">
            <Chart type="line" :data="chartData" :options="chartOptions" :height="300" :width="400"/>
        </div>
    </div>
</template>

<script setup lang="ts">
import { GlobeSearch24Filled, DocumentBulletListMultiple24Filled, PeopleQueue24Filled } from '@vicons/fluent'
import { NumberAnimationInst } from 'naive-ui'
import { ref, onMounted } from "vue";

const numberAnimationInstRef = ref<NumberAnimationInst | null>(null)

onMounted(() => {
    chartData.value = setChartData();
    chartOptions.value = setChartOptions();
});

const chartData = ref();
const chartOptions = ref();
const setChartData = () => {
    const documentStyle = getComputedStyle(document.documentElement);

    return {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
                label: 'First Dataset',
                data: [65, 59, 80, 81, 56, 55, 40],
                fill: false,
                borderColor: documentStyle.getPropertyValue('--blue-500'),
                tension: 0.4
            },
        ]
    };
};
const setChartOptions = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    return {
        maintainAspectRatio: false,
        aspectRatio: 0.6,
        plugins: {
            legend: {
                labels: {
                    color: textColor
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder
                }
            },
            y: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder
                }
            }
        }
    };
}
</script>

<style scoped>
.platformTop {
    display: flex;
    flex-direction: column;
}

.platformTopBottom {
    display: flex;
    flex-direction: row;

    .item {
        margin-left: 15%;
        margin-top: 2px;
        width: 20%;
    }
}

.platformBottom {
    margin-top: 2%;
    display: flex;
    flex-direction: column;

    .card {
        width: 100%;
        height: 50%;
        display: flex;
        justify-content: center;
    }
}
</style>