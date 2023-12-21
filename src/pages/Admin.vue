<template>
    <div class="adminBg">
        <div class="adminTop">
            <Header></Header>
        </div>
        <div class="adminBottom">
            <div class="adminBottomLeft">
                <n-menu :value="branch" @update:value="switchTable" :collapsed-width="64" :collapsed-icon-size="22" :options="menuOptions" />
            </div>
            <div class="adminBottomRight">
              <platformTable v-if = "branch === 'platform'"></platformTable>
              <scholarTable v-if = "branch === 'scholar'"></scholarTable>
              <auditTable v-if = "branch === 'audit'"></auditTable>
              <historyTable v-if = "branch === 'history'"></historyTable>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import Header from "@/components/Home/Header.vue"
import { MenuOption, NIcon } from "naive-ui";
import { BookOpenGlobe24Filled, PeopleAudience24Regular, PeopleList28Regular, SaveSearch20Filled } from "@vicons/fluent"
import {  Component, h, ref } from "vue";
import scholarTable from "@/components/admin/scholarTable.vue"
import platformTable from "@/components/admin/platformTable.vue"
import auditTable from "@/components/admin/auditTable.vue"
import historyTable from "@/components/admin/historyTable.vue"

function renderIcon (icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}
const switchTable = (key:string) => {
    branch.value = key;
}
const branch = ref('platform')

const menuOptions: MenuOption[] = [
  {
    label: '平台详情',
    key: 'platform',
    icon: renderIcon(BookOpenGlobe24Filled),
  },
  {
    label: '已入驻学者',
    key: 'scholar',
    icon: renderIcon(PeopleAudience24Regular),
  },
  {
    label: '待审核信息',
    key: 'audit',
    icon: renderIcon(PeopleList28Regular),
  },
  {
    label: '历史信息',
    key: 'history',
    icon: renderIcon(SaveSearch20Filled),
  },
]
</script>

<style scoped>
.adminBg {
    display: flex;
    flex-direction: column;
    justify-content: center;
}
.adminTop {
    width: 100%;
    display: flex;
    justify-content: center;
}
.adminBottom {
    height: 100%;
    display: flex;
    flex-direction: row;
    padding-top: 5%;
}

.adminBottomLeft {
    width: 15%;
    margin-right: 5%;
}

.adminBottomRight {
    width: 70%;
}

</style>