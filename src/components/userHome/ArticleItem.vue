<template>
  <div class="item-container" :class="{ 'selected-style': selected }" @click="handleContainerClicked">
    <div class="check-box">
      <n-checkbox v-model:checked="computed_check" @click.stop></n-checkbox>
    </div>
    <div class="right-container">
      <div class="title">{{ paper.title }}</div>
      <div class="author-journal">{{ paper.authors[0] }} -《{{ paper.journal }}》</div>
      <div class="card-footer">
        <div class="tag-container">
          <n-tag v-for="tag in paper.tags" closable type="info" size="small" @close="handleClose(tag)">{{ tag }}</n-tag>
          <n-popover trigger="hover" placement="bottom-start">
            <template #trigger>
              <n-tag class="add-tag" type="info" size="small">
                <template #icon>
                  <n-icon>
                    <Add />
                  </n-icon>
                </template>
                添加
              </n-tag>
            </template>
            <template #header>
              <n-button text @click="handleAddNewTag">
                <template #icon>
                  <n-icon>
                    <AddCircleOutline />
                  </n-icon>
                </template>
                新标签
              </n-button>
            </template>
            <template v-if="other_tags.length > 0" #footer>
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
        <div class="citations">被引频次: {{ paper.citations }}</div>
      </div>
    </div>
    <n-modal v-model:show="showModal" preset="dialog" title="新标签">
      <div :class="{ label_input: statusIsError }" :style="{ '--pseudo-content': `'${pseudoContent}'` }">
        <n-input v-modal:value="newCreatingLabel" @input="updateCreatingStatus" :status="creatingStatus"
          placeholder="请输入标签名" />
      </div>
      <template #action>
        <div>
          <n-button type="info" @click="createLabel">
            创建
          </n-button>
        </div>
      </template>
    </n-modal>
  </div>
</template>
<script setup lang="ts">
import { Add, AddCircleOutline } from '@vicons/ionicons5'
import { useCollectStore, Tag } from '@/store/collectStore'
import { ref, computed, toRef } from "vue";
import { FormValidationStatus } from 'naive-ui/es/form/src/interface';
import { NCheckbox, NTag, useMessage, useDialog, NPopover, NButton, NSpace, NIcon } from "naive-ui";

const props = defineProps({
  self_tag_name: String,
  self_paper_id: String,
});

const paper_id = toRef(props, 'self_paper_id');
const paper = computed(() => {
  return collectStore.get_paper_by_paper_id(paper_id.value);
});

const message = useMessage();
const dialog = useDialog();

const collectStore = useCollectStore();

const emit = defineEmits(['itemClick']);

// console.log('self idx', props.self_tag_idx, props.self_paper_idx);
// console.log('active idx', props.active_tag_idx, props.active_paper_idx);

const selected = computed(() => {
  return (
    paper.value.paper_id === collectStore.active_paper_id
  );
});

const handleContainerClicked = () => {
  // console.log("container clicked", paper.self_tag_idx, paper.self_paper_idx);
  collectStore.set_active_tag_name(props.self_tag_name);
  collectStore.set_active_paper_id(paper.value.paper_id);
  emit('itemClick');
  // console.log("active idx", collectStore.active_tag_idx, collectStore.active_paper_idx);
  // console.log("self idx", props.self_tag_idx, props.self_paper_idx);
  // console.log("selected", selected.value);
};

const computed_check = computed({
  get() {
    return collectStore.paper_checked.has(paper.value.paper_id ?? 'wrong_paper_id');
  },
  set(val) {
    collectStore.change_paper_checked(paper.value.paper_id, val);
  }
})

const handleClose = (tag_name: string) => {
  // console.log('tag_name', tag_name);
  dialog.warning({
    title: '删除标签',
    content: `将从《${paper.value.title}》删除标签: ${tag_name}`,
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      collectStore.requestDeleteTag(tag_name, paper.value.paper_id).then((res) => {
        if (res === true) {
          collectStore.delete_tag_from_paper(tag_name, paper.value.paper_id);
          message.success('删除标签成功');
        } else {
          message.error('删除标签失败');
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
  if (paper.value.tags) {
    for (const tag of paper.value.tags) {
      allSet.delete(tag);
    }
  }
  return [...allSet.keys()];
})

const handleAdd = (tag_name: string) => {
  // console.log('tag_name', tag_name);
  collectStore.requestAddTag(tag_name, paper.value.paper_id).then((res) => {
    if (res === true) {
      collectStore.add_tag_to_paper(tag_name, paper.value.paper_id);
      message.success('添加标签成功');
    } else {
      message.error('添加标签失败');
    }
  })
};

const tag_string_array = computed(() => {
  const strs = [];
  for (const tag of collectStore.tags) {
    strs.push(tag.name);
  }
  return strs;
})

const hasClickedCreateBtn = ref(false);
const newCreatingLabel = ref('');

const creatingStatus = ref<FormValidationStatus>();
const updateCreatingStatus = (value: string) => {
  // console.log(`newCreatingLabel.value=${value}`)
  newCreatingLabel.value = value;
  pseudoContent.value = '标签名不能为空';
  if (hasClickedCreateBtn.value === true) {
    creatingStatus.value = (value === '' ? 'error' : 'success');
  }
}

const pseudoContent = ref('标签名不能为空')
const statusIsError = computed(() => {
  return creatingStatus.value === 'error' ? true : false;
})
const showModal = ref(false);

const handleAddNewTag = () => {
  showModal.value = true;
}

const createLabel = () => {
  hasClickedCreateBtn.value = true;
  // console.log(`newCreatingLabel.value=${newCreatingLabel.value}`)
  // 如果输入为空, 则警告
  if (newCreatingLabel.value === '') {
    creatingStatus.value = 'error';
    pseudoContent.value = '标签名不能为空';
    return;
  }
  // 如果输入的内容和已存在的标签名重复, 也警告
  const idx = tag_string_array.value.indexOf(newCreatingLabel.value);
  // console.log(idx);
  if (idx !== -1) {
    creatingStatus.value = 'error';
    pseudoContent.value = '不能创建重复的标签';
    return;
  }
  // 可以创建
  hasClickedCreateBtn.value = false;
  showModal.value = false;
  collectStore.requestAddTag(newCreatingLabel.value, paper.value.paper_id).then((res) => {
    if (res === true) {
      const tag: Tag = new Tag(newCreatingLabel.value);
      collectStore.push_new_tag(tag);
      collectStore.add_tag_to_paper(tag.name, paper.value.paper_id);
      message.success(`成功创建并添加标签: ${newCreatingLabel.value}`);
    } else {
      message.error('创建标签失败');
    }
  }).catch(() => {
    message.error('创建标签失败');
  });
}

</script>
<style scoped>
.item-container {
  width: 375px;
  height: auto;
  display: flex;
  cursor: pointer;
  /* border: 1px solid black; */
  border-radius: 5px;
  background-color: var(--bg-100);
  box-shadow: var(--bg-300);
  /* margin: 10px; */
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
        flex-wrap: wrap;

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

.label_input::before {
  content: var(--pseudo-content, '');
  /* 默认值为空字符串 */
  font-size: smaller;
  color: red;
}
</style>