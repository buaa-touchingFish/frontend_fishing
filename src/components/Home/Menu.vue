<template>
    <div class="leftDiv">
        <n-layout class="leftLayout" has-sider>
            <n-layout-sider :class="{ sisi: collapsed }" bordered collapse-mode="width" :collapsed-width="64" :width="240"
                :collapsed="collapsed" @collapse="collapsed = true" @expand="collapsed = false"
                @mouseenter="$setTimeout(() => collapsed = false, 400)"
                @mouseleave="$setTimeout(() => collapsed = true, 500)">
                <n-menu :collapsed="collapsed" :collapsed-width="64" :collapsed-icon-size="22" :options="menuOptions" />
            </n-layout-sider>
            <n-layout style="background-color: transparent;">
                <div style="width: 15px; background-color: transparent;" />
            </n-layout>
        </n-layout>
    </div>
</template>

<script setup lang='ts'>
import { Component, h, ref } from 'vue'
import { NIcon } from 'naive-ui'
import type { MenuOption } from 'naive-ui'

import { Search16Regular, Book24Regular, PeopleCheckmark16Regular } from '@vicons/fluent'
function renderIcon(icon: Component) {
    return () => h(NIcon, null, { default: () => h(icon) })
}
//let lastTimeVal: NodeJS.Timeout | undefined = undefined;
function $setTimeout(func: () => void, time: number) {
    //if (lastTimeVal != undefined) clearTimeout(lastTimeVal);
    setTimeout(func, time);
}
const menuOptions: MenuOption[] = [
    {
        label: '文献',
        key: 'paper',
        icon: renderIcon(Search16Regular)

    }, {
        label: '期刊',
        key: 'id',
        icon: renderIcon(Book24Regular)
    }, {
        label: '学者',
        key: 'scholar',
        icon: renderIcon(PeopleCheckmark16Regular)
    },
    /*
    // {
    //     label: '1973年的弹珠玩具',
    //     key: 'pinball-1973',
    //     disabled: true,
    //     children: [
    //         {
    //             label: '鼠',
    //             key: 'rat'
    //         }
    //     ]
    // },
    // {
    //     label: '寻羊冒险记',
    //     key: 'a-wild-sheep-chase',
    //     disabled: true
    // },
    // {
    //     label: '舞，舞，舞',
    //     key: 'dance-dance-dance',
    //     children: [
    //         {
    //             type: 'group',
    //             label: '人物',
    //             key: 'people',
    //             children: [
    //                 {
    //                     label: '叙事者',
    //                     key: 'narrator'
    //                 },
    //                 {
    //                     label: '羊男',
    //                     key: 'sheep-man'
    //                 }
    //             ]
    //         },
    //         {
    //             label: '饮品',
    //             key: 'beverage',
    //             children: [
    //                 {
    //                     label: '威士忌',
    //                     key: 'whisky',
    //                     href: 'https://baike.baidu.com/item/%E5%A8%81%E5%A3%AB%E5%BF%8C%E9%85%92/2959816?fromtitle=%E5%A8%81%E5%A3%AB%E5%BF%8C&fromid=573&fr=aladdin'
    //                 }
    //             ]
    //         },
    //         {
    //             label: '食物',
    //             key: 'food',
    //             children: [
    //                 {
    //                     label: '三明治',
    //                     key: 'sandwich'
    //                 }
    //             ]
    //         },
    //         {
    //             label: '过去增多，未来减少',
    //             key: 'the-past-increases-the-future-recedes'
    //         }
    //     ]
    // }
    */
]
const collapsed = ref(true);


</script>
<style scoped>
.leftDiv {
    height: 100%;
    background-color: transparent;
}

.leftLayout {
    height: 100%;
    background-color: transparent;
}
</style>
