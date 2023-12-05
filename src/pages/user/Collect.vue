<template>
  <div>
    <n-tabs v-model:value="value" type="card" :addable="addable" :closable="closable" tab-style="min-width: 80px;"
      @close="handleClose" @add="handleAdd">
      <n-tab-pane v-for="panel in panels" :key="panel" :name="panel">
        {{ panel }}
        <ArticleItem :title="'This is a title ' + titles[panel - 1]" :author="authors[panel - 1]" :journal="journal"
          :citations="panel" :tags="tags" />
      </n-tab-pane>
    </n-tabs>
  </div>
</template>
<script setup lang="ts">
import ArticleItem from "@/components/userHome/ArticleItem.vue";
import { Ref, ref, computed } from "vue";
import { NTabs, NTabPane } from "naive-ui";
const value: Ref<number> = ref(1);
const panels: Ref<number[]> = ref([1, 2, 3, 4, 5]);
const addable = computed(() => panels.value.length < 10);
const closable = computed(() => panels.value.length > 1);
const titles = ref(["1", "2", "3", "4", "5"]);
const authors = ref(['author1', 'author2', 'author3', 'author4', 'author5'])
const journal = "journal";
const tags = ref(["tag1", "tag2", "tag3"]);

const handleAdd = () => {
  const newValue = Math.max(...panels.value) + 1
  panels.value.push(newValue)
  value.value = newValue
}

const handleClose = (name: number) => {
  const { value: panelsValue } = panels
  const nameIndex = panelsValue.findIndex((panelName) => panelName === name)
  if (!~nameIndex) return
  panelsValue.splice(nameIndex, 1)
  if (name === value.value) {
    value.value = panelsValue[Math.min(nameIndex, panelsValue.length - 1)]
  }
}
</script>
<style scoped></style>