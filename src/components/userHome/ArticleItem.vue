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
          <n-tag v-for="tag in tags" closable type="info" size="small" @close="handleClose(tag)">{{ tag }}</n-tag>
          <n-popover trigger="hover" placement="bottom-start">
            <template #trigger>
              <n-tag class="add-tag" type="info" size="small">+</n-tag>
            </template>
            <template #header>
              <n-space>
                <div v-for="tag in other_tags">
                  <n-button strong secondary type="info" size="tiny" @click="handleAdd(tag)">{{ tag
                  }}</n-button>
                </div>
              </n-space>
            </template>
            <!-- <template #footer>
              上面就是分割线
            </template> -->
          </n-popover>
        </div>
        <div class="citations">被引频次: {{ citations }}</div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useCollectStore } from '@/store/collectStore'
import { ref, computed } from "vue";
import { NCheckbox, NTag, useMessage, useDialog, NPopover, NButton, NSpace } from "naive-ui";

const props = defineProps({
  self_tag_name: String,
  paper_id: String,
  title: String,
  author: String,
  journal: String,
  citations: Number,
  tags: Array as () => string[],
});

const message = useMessage();

const dialog = useDialog();

const collectStore = useCollectStore();

// console.log('self idx', props.self_tag_idx, props.self_paper_idx);
// console.log('active idx', props.active_tag_idx, props.active_paper_idx);

const selected = computed(() => {
  return (
    props.self_tag_name === collectStore.active_tag_name &&
    props.paper_id === collectStore.active_paper_id
  );
});

const handleContainerClicked = () => {
  // console.log("container clicked", props.self_tag_idx, props.self_paper_idx);
  collectStore.set_active_tag_name(props.self_tag_name);
  collectStore.set_active_paper_id(props.paper_id);
  // console.log("active idx", collectStore.active_tag_idx, collectStore.active_paper_idx);
  // console.log("self idx", props.self_tag_idx, props.self_paper_idx);
  // console.log("selected", selected.value);
};

const check = ref(false);

const handleCheckedChange = (value: boolean) => {
  check.value = value;
  console.log("check", check.value);
  collectStore.change_item_checked(props.self_tag_name, props.paper_id, value);
};

const handleClose = (tag_name: string) => {
  console.log('tag_name', tag_name);
  dialog.warning({
    title: '删除标签',
    content: `将从《${props.title}》删除标签: ${tag_name}`,
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      collectStore.requestDeleteTag(tag_name, props.paper_id).then((res) => {
        if (res === true) {
          collectStore.delete_tag_from_paper(tag_name, props.paper_id);
          message.success('删除标签成功');
        } else {
          message.success('删除标签失败');
        }
      })
    },
    onNegativeClick: () => {
      message.info('取消')
    }
  })
};

const other_tags = computed(() => {
  const allSet = new Set(collectStore.all_tags);
  if (props.tags) {
    for (const tag of props.tags) {
      allSet.delete(tag);
    }
  }
  return [...allSet.keys()];
})

const handleAdd = (tag_name: string) => {
  console.log('tag_name', tag_name);
  collectStore.requestAddTag(tag_name, props.paper_id).then((res) => {
    if (res === true) {
      collectStore.add_tag_to_paper(tag_name, props.paper_id);
      message.success('添加标签成功');
    } else {
      message.success('添加标签失败');
    }
  })
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