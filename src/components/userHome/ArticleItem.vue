<template>
  <div class="root">
    <div class="check-box">
      <n-checkbox v-model:checked="check"></n-checkbox>
    </div>
    <div class="right-container">
      <div class="title">{{ title }}</div>
      <div class="author-journal">{{ author }} -《{{ journal }}》</div>
      <div class="card-footer">
        <div class="tag-container">
          <n-tag v-for="tag in tags" closable type="info" size="small">{{ tag }}</n-tag>
        </div>
        <div class="citations">被引频次: {{ citations }}</div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Ref, ref } from "vue";
import { NCheckbox, NTag } from "naive-ui";
defineProps({
  title: String,
  author: String,
  journal: String,
  citations: Number,
  tags: Array<String>,
});
const emit = defineEmits(["change"]);
let check: Ref<boolean> = ref(false);
</script>
<style scoped>
.root {
  width: 375px;
  height: 100px;
  display: flex;

  .check-box {
    margin: 10px;
  }

  .right-container {
    width: 100%;
    /* height: 100%; */
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 10px;
    border-bottom: 1px solid #eaeaea;

    .title {
      font-size: 16px;
      font-weight: bold;
    }

    .author-journal {
      font-size: 12px;
      color: #999999;
    }

    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .tag-container {
        display: flex;
        gap: 5px;
      }

      .citations {
        font-size: 12px;
        color: #999999;
      }
    }
  }
}
</style>