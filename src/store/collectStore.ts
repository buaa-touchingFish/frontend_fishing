import { defineStore } from "pinia";
import api from "@/api/axios";
import { ref, computed } from "vue";

export interface ArticleDetail {
  aid: number;
  title: string;
  authors: string[];
  abstract: string;
  journal: string;
  keywords: string[];
  tags: string[];
  citations: number;
}

export class Tag {
  public name: string;
  public papers: Paper[];
  constructor(name: string, papers: Paper[] = []) {
    this.name = name;
    this.papers = papers;
  }
  public addPaper(paper: Paper) {
    this.papers.push(paper);
  }
  public deletePaper(paper_id: string | undefined) {
    if (paper_id === undefined) return;
    const i = this.papers.findIndex((item) => item.paper_id === paper_id);
    if (i !== -1) this.papers.splice(i, 1);
  }
}

export class Paper {
  public paper_id: string;
  public title: string;
  public authors: string[];
  public journal: string;
  public citations: number;
  public tags: string[];
  constructor(
    paper_id: string | undefined,
    title: string,
    authors: string[],
    journal: string,
    citations: number,
    tags: string[]
  ) {
    this.paper_id = paper_id ?? title;
    this.title = title;
    this.authors = authors.length > 0 ? authors : ["佚名"];
    this.journal = journal.length > 0 ? journal : "未知期刊";
    this.citations = citations;
    this.tags = tags;
  }
  public deleteTag(tag_name: string | undefined) {
    if (tag_name === undefined) return;
    const i = this.tags.findIndex((item) => item === tag_name);
    if (i !== -1) this.tags.splice(i, 1);
  }
}

const fake_authors = ["佚名"];
const fake_publisher = "未知期刊";
export const useCollectStore = defineStore("collect", () => {
  const user_id = ref(1);
  const active_tag_name = ref("全部");
  const active_paper_id = ref("paper_id");
  const tags = ref([] as Tag[]);
  const papers = ref([] as Paper[]);
  const paper_checked = ref(new Set<string>());
  const isFakeData = ref(false);
  const set_active_tag_name = (active_tag_name1: string | undefined) => {
    if (active_tag_name1 === undefined) return;
    // console.log('active_tag_name1', active_tag_name1);
    active_tag_name.value = active_tag_name1;
  };
  const set_active_paper_id = (active_paper_id1: string | undefined) => {
    if (active_paper_id1 === undefined) return;
    active_paper_id.value = active_paper_id1;
  };
  const get_user_id = () => {
    const id_str = localStorage.getItem("user_id");
    user_id.value = id_str ? parseInt(id_str) : 1;
  };
  const push_new_tag = (tag: Tag) => {
    tags.value.push(tag);
  };
  const requestAddTag = async (tag_name: string, paper_id: string = "") => {
    const res = await api.post("/collect/label", {
      // user_id: user_id.value,
      paper_id,
      label_name: tag_name,
    });
    return res.data.code === 200;
    // return true;
  };
  const add_tag_to_paper = (tag_name: string, paper_id: string) => {
    const paper = papers.value.find((item) => item.paper_id === paper_id);
    if (paper === undefined) return;
    paper.tags.push(tag_name);
    const tag = tags.value.find((item) => item.name === tag_name);
    if (tag === undefined) return;
    tag.addPaper(paper);
  };
  const requestDeleteTag = async (tag_name: string, paper_id: string = "") => {
    const res = await api.post("/collect/label/delete", {
      // user_id: user_id.value,
      paper_id: paper_id,
      label_name: tag_name,
    });
    // console.log("requestDeleteTag", res);
    return res.data.code === 200;
    // return true;
  };
  const delete_whole_tag = (tag_name: string) => {
    if (tag_name === active_tag_name.value) {
      active_tag_name.value = "全部";
      active_paper_id.value = "paper_id";
    }
    const tag_idx = tags.value.findIndex((item) => item.name === tag_name);
    if (tag_idx === -1) return;
    tags.value.splice(tag_idx, 1);
    for (const paper of papers.value) {
      paper.deleteTag(tag_name);
    }
  };
  const delete_tag_from_paper = (
    tag_name: string,
    paper_id: string | undefined
  ) => {
    if (paper_id === undefined) return;
    const paper = papers.value.find((item) => item.paper_id === paper_id);
    if (paper === undefined) return;
    paper.deleteTag(tag_name);
    const tag = tags.value.find((item) => item.name === tag_name);
    if (tag === undefined) return;
    tag.deletePaper(paper_id);
  };
  const change_paper_checked = (
    paper_id: string | undefined,
    value: boolean | undefined
  ) => {
    if (paper_id === undefined || value === undefined) return;
    if (value === true) paper_checked.value.add(paper_id);
    else paper_checked.value.delete(paper_id);
  };
  const getAllCollects = async () => {
    get_user_id();
    const labelMap = new Map<string, Tag>();
    const res_label = await api.get("/collect/label");
    const label_list = res_label.data.data.label_list;
    // console.log("label_list", label_list);
    for (const item of label_list) {
      const { name, count } = item;
      labelMap.set(name, new Tag(name));
    }

    const res = await api.get("/collect");
    // console.log(res);
    const datas = res.data.data;
    // console.log(datas);
    // 此时按照文章遍历, 将文章加入到指定的标签数据结构中
    console.log("datas", datas);
    const tagAll = new Tag("全部");
    for (const data of datas) {
      let { paper_id, title, authors, publisher, cited_by_count, labels } =
        data;
      // console.log(paper_id, title, authors, publisher, cited_by_count, labels);
      if (authors.length === 0) authors = fake_authors;
      if (publisher.length === 0) publisher = fake_publisher;
      const paper = new Paper(
        paper_id,
        title,
        authors,
        publisher,
        cited_by_count,
        labels
      );
      // console.log("paper", paper);
      papers.value.push(paper);
      tagAll.addPaper(paper);
      for (const label of labels) {
        const tag = labelMap.get(label);
        tag?.addPaper(paper);
      }
    }
    tags.value = [tagAll, ...labelMap.values()];
  };
  const fakeData = () => {
    papers.value = [
      new Paper("1", "title1", ["author1"], "journal1", 1, ["生物学"]),
      new Paper("2", "title2", ["author2"], "journal2", 2, ["医学"]),
      new Paper("3", "title3", ["author3"], "journal3", 3, ["电气"]),
      new Paper("4", "title4", ["author4"], "journal4", 4, ["AI"]),
      new Paper("5", "title5", ["author5"], "journal5", 5, ["CS"]),
      new Paper("6", "title6", ["author6"], "journal6", 6, ["CS", "生物学"]),
      new Paper("7", "title7", ["author7"], "journal7", 7, [
        "AI",
        "CS",
        "医学",
      ]),
      new Paper("8", "title8", ["author8"], "journal8", 8, ["CS"]),
      new Paper("9", "title9", ["author9"], "journal9", 9, ["CS"]),
    ];
    const tag0 = new Tag("全部");
    const tag1 = new Tag("生物学");
    const tag2 = new Tag("医学");
    const tag3 = new Tag("电气");
    const tag4 = new Tag("AI");
    const tag5 = new Tag("CS");
    tags.value = [tag0, tag1, tag2, tag3, tag4, tag5];
    for (const paper of papers.value) {
      tags.value[0].addPaper(paper);
      for (const tag_name of paper.tags) {
        const tag = tags.value.find((item) => item.name === tag_name);
        // console.log("tag", tag);
        if (tag) tag.addPaper(paper);
      }
    }
  };

  const all_tags = computed(() => {
    return tags.value
      .filter((tag) => tag.name !== "全部")
      .map((tag) => tag.name);
  });

  const requestDeletePaper = async () => {
    console.log("requestDeletePaper");
    const paper_ids = Array.from(paper_checked.value);
    const res = await api.post("/collect/delete", {
      paper_id: paper_ids,
    });
    return res.data.code === 200;
  };

  const delete_papers = (paper_ids: Iterable<string>) => {
    for (const paper_id of paper_ids) {
      if (paper_id === active_paper_id.value)
        active_paper_id.value = "paper_id";
      for (const tag of tags.value) {
        tag.deletePaper(paper_id);
      }
    }
    papers.value = papers.value.filter(
      (item) => !paper_checked.value.has(item.paper_id)
    );
    paper_checked.value.clear();
  };

  return {
    user_id,
    active_tag_name,
    active_paper_id,
    tags,
    isFakeData,
    paper_checked,
    set_active_tag_name,
    set_active_paper_id,
    getAllCollects,
    push_new_tag,
    requestDeleteTag,
    delete_whole_tag,
    delete_tag_from_paper,
    change_paper_checked,
    fakeData,
    all_tags,
    requestAddTag,
    add_tag_to_paper,
    requestDeletePaper,
    delete_papers,
  };
});
