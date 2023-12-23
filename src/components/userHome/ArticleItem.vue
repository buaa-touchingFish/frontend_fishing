<template>
  <div class="item-container" :class="{ 'selected-style': selected }" @click="handleContainerClicked">
    <div class="check-box">
      <n-checkbox v-model:checked="check" @update:checked="handleCheckedChange" @click.stop></n-checkbox>
    </div>
    <div class="right-container">
      <div class="title">{{ title }}</div>
      <div class="author-journal">{{ author }} -《{{ journal }}》</div>
      <div class="card-footer">
        <div class="tag-container">
          <n-tag v-for="tag in tags" closable type="info" size="small">{{ tag }}</n-tag>
          <n-tag class="add-tag" type="info" size="small">+</n-tag>
        </div>
        <div class="citations">被引频次: {{ citations }}</div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useCollectStore } from '@/store/collectStore'
import { ref, computed } from "vue";
import { NCheckbox, NTag } from "naive-ui";

const props = defineProps({
  self_tag_idx: Number,
  self_paper_idx: Number,
  paper_id: String,
  title: String,
  author: String,
  journal: String,
  citations: Number,
  tags: Array as () => string[],
});

const collectStore = useCollectStore();

// console.log('self idx', props.self_tag_idx, props.self_paper_idx);
// console.log('active idx', props.active_tag_idx, props.active_paper_idx);

const selected = computed(() => {
  return (
    props.self_tag_idx === collectStore.active_tag_idx &&
    props.self_paper_idx === collectStore.active_paper_idx
  );
});

const handleContainerClicked = () => {
  // console.log("container clicked", props.self_tag_idx, props.self_paper_idx);
  collectStore.set_active_idx(props.self_tag_idx, props.self_paper_idx);
  console.log("active idx", collectStore.active_tag_idx, collectStore.active_paper_idx);
  console.log("self idx", props.self_tag_idx, props.self_paper_idx);
  console.log("selected", selected.value);
};

const check = ref(false);

const handleCheckedChange = (value: boolean) => {
  check.value = value;
  console.log("check", check.value);
  collectStore.change_item_checked(props.self_tag_idx, props.self_paper_idx, value);
};
</script>
<style scoped>
.item-container {
  width: 375px;
  height: 100px;
  display: flex;
  cursor: pointer;
  /* border: 1px solid black; */
  border-radius: 5px;
  background-color: var(--bg-100);
  box-shadow: var(--bg-300);
  margin: 10px;
  transition: filter 0.3s ease;

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
    /* border-bottom: 1px solid #eaeaea; */

    .title {
      font-size: 16px;
      font-weight: bold;
    }

    .author-journal {
      font-size: 12px;
      color: var(--text-200);
      margin-bottom: 5px;
    }

    .card-footer {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;

      .tag-container {
        display: flex;
        gap: 5px;

        .add-tag {
          cursor: pointer;
          transition: filter 0.3s ease;
          /* 平滑过渡效果 */

          &:hover {
            filter: brightness(70%);
            /* 颜色加深 */
          }
        }
      }

      .citations {
        font-size: 12px;
        color: var(--bg-300);
        margin-left: auto;
      }
    }
  }
}

.selected-style {
  filter: brightness(95%);
  /* background-color: #c6dafb; */
  cursor: unset;
}
</style>