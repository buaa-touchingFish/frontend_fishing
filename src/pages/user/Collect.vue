<template>
  <div class="collect-container">
    <n-tabs v-model:value="value" type="card" addable closable tab-style="min-width: 80px;" @close="handleClose"
      @add="handleAdd">
      <n-tab-pane v-for="tag in collectStore.tags" :key="tag.name" :closable="notAll(tag.name)" :name="tag.name"
        :tab="tag2String(tag)">
        <div v-for="paper in tag.papers" :key="paper.paper_id">
          <ArticleItem :self_tag_name="tag.name" :paper_id="paper.paper_id" :title="paper.title"
            :author="paper.authors[0]" :journal="paper.journal" :citations="paper.citations" :tags="paper.tags" />
        </div>
      </n-tab-pane>
    </n-tabs>
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
import api from '@/api/axios.ts';
import ArticleItem from "@/components/userHome/ArticleItem.vue";
import { useCollectStore, Tag } from '@/store/collectStore'
import { ref, computed, onMounted } from "vue";
import { NTabs, NTabPane, NModal, NInput, NButton, useMessage, useDialog } from "naive-ui";

const collectStore = useCollectStore();

const message = useMessage();
const dialog = useDialog();

onMounted(() => {
  // collectStore.getAllCollects();
  collectStore.fakeData();
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

const value = ref("全部");

const tag_string_array = computed(() => {
  const strs = [];
  for (const tag of collectStore.tags) {
    strs.push(tag.name);
  }
  return strs;
})

const hasClickedCreateBtn = ref(false);
const newCreatingLabel = ref('');

const creatingStatus = ref<string>();
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
    params: {
      user_id: collectStore.user_id,
      paper_id: '',
      label_name
    }
  });
  console.log('requestCreateNewLabel', res.data);
  return res.data.code === 0;
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

</script>
<style scoped>
.collect-container {
  margin-top: 15px;
  margin-left: 80px;
  width: 100%;
}

.label_input::before {
  content: var(--pseudo-content, '');
  /* 默认值为空字符串 */
  font-size: smaller;
  color: red;
}
</style>