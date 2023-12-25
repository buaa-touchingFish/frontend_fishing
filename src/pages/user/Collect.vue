<template>
  <div class="collect-container">
    <n-space>
      <n-tabs v-if="hasCollect" v-model:value="cur_tag_name" :on-update:value="handleUpdatedValue" type="card" addable
        closable @close="handleClose" @add="handleAdd">
        <n-tab-pane v-for="tag in collectStore.tags" :key="tag.name" :closable="notAll(tag.name)" :name="tag.name"
          :tab="tag2String(tag)">
          <n-space v-if="tag?.papers.length > 0" style="display: flex; flex-wrap: nowrap;">
            <n-space vertical>
              <div class="export-container">
                <div class="check-all">
                  <n-checkbox v-model:checked="allChecked">
                    全选
                  </n-checkbox>
                </div>
                <n-button text @click="handleDelete">
                  <template #icon>
                    <n-icon>
                      <TrashBinOutline />
                    </n-icon>
                  </template>
                  取消收藏
                </n-button>
              </div>
              <div v-for="paper in tag.papers" :key="paper.paper_id">
                <ArticleItem @item-click="handleItemClick" :self_tag_name="tag.name" :paper_id="paper.paper_id"
                  :title="paper.title" :author="paper.authors[0]" :journal="paper.journal" :citations="paper.citations"
                  :tags="paper.tags" />
              </div>
            </n-space>
            <div v-if="canLoadPreview" style="flex-grow: 1;">
              <div class="detailContainer">
                <DetailComponent :paper_id="collectStore.active_paper_id" @collectedChange="handleCollectedChange" />
              </div>
            </div>
            <n-card v-else style="background-color: var(--bg-100);">
              <template #header>
                <n-space vertical>
                  <n-skeleton text width="50vw" />
                  <n-skeleton text width="50vw" />
                  <n-skeleton text width="50vw" />
                  <n-skeleton text width="50vw" />
                </n-space>
                <n-skeleton text width="80px" :repeat="3" />
              </template>
              <n-skeleton text :repeat="6" />
            </n-card>
          </n-space>
          <div v-else class="hint">
            <n-empty size="large" description="当前标签下没有文章">
              <template #extra>
                <n-button @click="cur_tag_name = '全部'">
                  去添加
                </n-button>
              </template>
            </n-empty>
          </div>
        </n-tab-pane>
      </n-tabs>
    </n-space>
    <div v-if="!hasCollect" class="result">
      <n-result status="404" title="还没有收藏" description="把文章加入收藏夹试试" size="huge" />
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
import { TrashBinOutline } from '@vicons/ionicons5';
import api from '@/api/axios.ts';
import ArticleItem from "@/components/userHome/ArticleItem.vue";
import DetailComponent from '@/components/detail/DetailComponent.vue'
import { useCollectStore, Tag } from '@/store/collectStore'
import { ref, computed, onMounted } from "vue";
import { FormValidationStatus } from 'naive-ui/es/form/src/interface';
import { NTabs, NTabPane, NModal, NInput, NButton, useMessage, useDialog, NSpace, NCard, NSkeleton, NCheckbox, NIcon, NResult, NEmpty } from "naive-ui";

const collectStore = useCollectStore();

const message = useMessage();
const dialog = useDialog();

onMounted(() => {
  // if (collectStore.isFakeData)
  //   collectStore.fakeData();
  collectStore.getAllCollects();
})

const hasCollect = computed(() => {
  return collectStore.tags[0]?.papers.length !== 0;
})

const handleItemClick = () => {
  if (collectStore.active_paper_id !== 'paper_id')
    return;
}

const allChecked = computed({
  get() {
    const tag = collectStore.tags.find(item => item.name === cur_tag_name.value);
    if (tag) {
      for (const paper of tag.papers) {
        if (!collectStore.paper_checked.has(paper.paper_id)) {
          return false;
        }
      }
      return true;
    }
    return false;
  },
  set(val) {
    const tag = collectStore.tags.find(item => item.name === cur_tag_name.value);
    if (tag)
      tag.papers.forEach(item => collectStore.change_paper_checked(item.paper_id, val));
  }
});

const canLoadPreview = computed(() => {
  // return true;
  return !collectStore.isFakeData && collectStore.active_paper_id !== 'paper_id';
})

const tag2String = computed(() => {
  return (tag: Tag) => {
    return `${tag.name} (${tag.papers.length})`
  }
});

const notAll = computed(() => {
  return (name: string) => {
    return name !== '全部'
  }
})

const cur_tag_name = ref("全部");

const handleUpdatedValue = (value: string) => {
  // console.log('handleUpdatedValue', value);
  cur_tag_name.value = value;
  collectStore.active_paper_id = 'paper_id';
}

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

let pseudoContent = ref('标签名不能为空')
const statusIsError = computed(() => {
  return creatingStatus.value === 'error' ? true : false;
})

let showModal = ref(false);
const handleAdd = () => {
  showModal.value = true;
}

const requestCreateNewLabel = async (label_name: string) => {
  const res = await api.post('/collect/label', {
    // user_id: collectStore.user_id,
    paper_id: '',
    label_name: label_name
  });
  // console.log('requestCreateNewLabel', res.data);
  return res.data.code === 200;
  // return true;
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
  requestCreateNewLabel(newCreatingLabel.value).then((res) => {
    if (res === true) {
      collectStore.push_new_tag(new Tag(newCreatingLabel.value));
      message.success(`成功创建标签: ${newCreatingLabel.value}`);
    } else {
      message.error('创建标签失败');
    }
  }).catch(() => {
    message.error('创建标签失败');
  });
}

// TODO
const handleClose = (name: string) => {
  // console.log(name);
  dialog.warning({
    title: '删除标签',
    content: `将删除标签: ${name}`,
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      collectStore.requestDeleteTag(name).then((res) => {
        if (res === true) {
          if (name === cur_tag_name.value)
            cur_tag_name.value = '全部'
          collectStore.delete_whole_tag(name);
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
}

const handleDelete = () => {
  dialog.warning({
    title: '取消收藏',
    content: `将从收藏夹中删除选中的${collectStore.paper_checked.size}篇论文`,
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      collectStore.requestDeletePaper().then((res) => {
        if (res === true) {
          collectStore.delete_papers(collectStore.paper_checked);
          message.success('取消收藏成功');
        } else {
          message.success('取消收藏失败');
        }
      })
    },
    onNegativeClick: () => {
      message.info('取消')
    }
  })
}

const handleCollectedChange = (paper_id: string, collected: boolean) => {
  if (collected === false)
    collectStore.delete_papers([paper_id]);
}

</script>
<style scoped>
.collect-container {
  position: relative;
  /* position: absolute;
  left: 50%;
  transform: translateX(-50%); */
  margin-top: 15px;
  margin-bottom: 15px;
  padding-left: 74px;
  padding-right: 14px;
  /* margin-left: 80px; */
  /* padding-right: 10px; */
  width: 100vw;
  height: calc(100vh - 57px - 15px);
  /* width: 1800px; */
  /* overflow-y: hidden; */

  .result {
    margin-top: 160px;
  }

  .hint {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .preview {
    width: 200px;
    height: 1200px;
    background-color: red;
  }

  .export-container {
    display: flex;
    justify-content: space-between;

    .check-all {
      margin-left: 10px;
      display: flex;
      align-items: center;
    }
  }
}

.label_input::before {
  content: var(--pseudo-content, '');
  /* 默认值为空字符串 */
  font-size: smaller;
  color: red;
}

.detailContainer {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
}
</style>