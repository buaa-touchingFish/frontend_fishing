<template>
  <div>
    <n-tabs v-model:value="value" type="card" addable closable tab-style="min-width: 80px;" @close="handleClose"
      @add="handleAdd">
      <n-tab-pane v-for="tag in tags" :key="tag.name" :closable="notAll(tag.name)" :name="tag.name"
        :tab="tag2String(tag)">
        <ArticleItem v-for="paper in tag.papers" :key="paper.title" :userid="user_id" :title="paper.title"
          :author="paper.authors[0]" :journal="paper.journal" :citations="paper.citations" :tags="paper.tags" />
      </n-tab-pane>
    </n-tabs>
    <n-modal v-model:show="showModal" preset="dialog" title="新标签">
      <template #header>
        <div>新标签</div>
      </template>
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
import { Ref, ref, computed, onMounted } from "vue";
import { NTabs, NTabPane, NModal, NInput, NButton, useMessage } from "naive-ui";

class Tag {
  public name: string;
  public number: number;
  public papers: Paper[];
  constructor(name: string, number: number = 0, papers: Paper[] = []) {
    this.name = name;
    this.number = number;
    this.papers = papers;
  }
  addPaper(paper: Paper) {
    this.papers.push(paper);
    this.number++;
  }
}

class Paper {
  public paper_id: string;
  public title: string;
  public authors: string[];
  public journal: string;
  public citations: number;
  public tags: string[];
  constructor(paper_id: string, title: string, authors: string[], journal: string, citations: number, tags: string[]) {
    this.paper_id = paper_id;
    this.title = title;
    this.authors = authors;
    this.journal = journal;
    this.citations = citations;
    this.tags = tags;
  }
}

interface ArticleDetail {
  aid: number;
  title: string;
  authors: string[];
  abstract: string;
  journal: string;
  keywords: string[];
  tags: string[];
  citations: number;
}

const message = useMessage();

const user_id = ref(1);
const getAllCollects = async (user_id: number) => {
  const res = await api.get('/collect', {
    params: {
      user_id
    }
  })
  const datas = res.data;
  const labelMap = new Map<string, Tag>();
  // 此时按照文章遍历, 将文章加入到指定的标签数据结构中
  const tagAll = new Tag('全部');
  for (const data of datas) {
    const { paper_id, title, authors, publisher, cited_by_count, labels } = data;
    const paper = new Paper(paper_id, title, authors, publisher, cited_by_count, labels);
    for (const label of labels) {
      if (!labelMap.has(label)) {
        labelMap.set(label, new Tag(label));
      }
      const tag = labelMap.get(label);
      tag?.addPaper(paper);
      tagAll.addPaper(paper);
    }
  }
  return [tagAll, ...labelMap.values()];
}

onMounted(() => {
  getAllCollects(user_id.value).then((res) => {
    tags.value = res;
  })
})

const tag2String = computed(() => {
  return (tag: Tag) => {
    return `${tag.name} (${tag.number})`
  }
});

const notAll = computed(() => {
  return (name: string) => {
    return name !== '全部'
  }
})

const value = ref("全部");
const tmpPapers = [
  new Paper("1", "title1", ["author1"], "journal1", 1, ["tag1"]),
  new Paper("2", "title2", ["author2"], "journal2", 2, ["tag2"]),
  new Paper("3", "title3", ["author3"], "journal3", 3, ["tag3"]),
  new Paper("4", "title4", ["author4"], "journal4", 4, ["tag4"]),
  new Paper("5", "title5", ["author5"], "journal5", 5, ["tag5"]),
];
const tags: Ref<Tag[]> = ref([
  new Tag("全部", 5, tmpPapers),
  new Tag("医学", 2, tmpPapers),
  new Tag("电气", 3, tmpPapers),
  new Tag("AI", 1, tmpPapers),
  new Tag("CS", 0, tmpPapers),
]);

const tag_string_array = computed(() => {
  const strs = [];
  for (const tag of tags.value) {
    strs.push(tag.name);
  }
  return strs;
})

let hasClickedCreateBtn = ref(false);
let newCreatingLabel = ref('');

let creatingStatus = ref<string>();
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
      user_id,
      paper_id: '',
      label_name
    }
  });
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
  showModal.value = false;
  requestCreateNewLabel(newCreatingLabel.value).then((res) => {
    if (res === true) {
      tags.value.push(new Tag(newCreatingLabel.value));
      message.success(`成功创建标签: ${newCreatingLabel.value}`);
    } else {
      message.error('创建标签失败');
    }
  }).catch(() => {
    message.error('创建标签失败');
  });
}

const handleClose = (name: number) => {
  console.log(name);
}
</script>
<style scoped>
.label_input::before {
  content: var(--pseudo-content, '');
  /* 默认值为空字符串 */
  font-size: smaller;
  color: red;
}
</style>