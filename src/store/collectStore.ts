import { defineStore } from 'pinia'
import api from '@/api/axios'
import { ref } from 'vue'

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
    public number: number;
    public papers: Paper[];
    public papers_checked: boolean[];
    constructor(name: string, number: number = 0, papers: Paper[] = [], papers_checked: boolean[] = []) {
        this.name = name;
        this.number = number;
        this.papers = papers;
        this.papers_checked = papers_checked;
    }
    addPaper(paper: Paper) {
        this.papers.push(paper);
        this.papers_checked.push(false);
        this.number++;
    }
}

export class Paper {
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

export const useCollectStore = defineStore('collect', () => {
    const user_id = ref(1);
    const active_tag_idx = ref(-1);
    const active_paper_idx = ref(0);
    const tags = ref([] as Tag[]);
    const set_active_idx = (active_tag_idx1: number | undefined, active_paper_idx1: number | undefined) => {
        if (active_tag_idx1 === undefined || active_paper_idx1 === undefined) return;
        console.log(active_tag_idx1, active_paper_idx1);
        active_tag_idx.value = active_tag_idx1;
        active_paper_idx.value = active_paper_idx1;
    };
    const set_active_tag = (active_tag_name: string | undefined) => {
        if (active_tag_name === undefined) return;
        console.log('active_tag_name', active_tag_name);
        const active_tag_idx1 = tags.value.findIndex(tag => tag.name === active_tag_name);
        active_tag_idx.value = active_tag_idx1;
        active_paper_idx.value = 0;
    };
    const get_user_id = () => {
        const id_str = localStorage.getItem('user_id');
        user_id.value = id_str ? parseInt(id_str) : 1;
    };
    const push_new_tag = (tag: Tag) => {
        tags.value.push(tag);
    };
    const change_item_checked = (tag_idx: number | undefined, paper_idx: number | undefined, value: boolean | undefined) => {
        if (tag_idx === undefined || paper_idx === undefined || value === undefined) return;
        console.log(tag_idx, paper_idx, value);
        tags.value[tag_idx].papers_checked[paper_idx] = value;
    };
    const getAllCollects = async () => {
        get_user_id();
        const res = await api.get('/collect', {
            params: {
                user_id: user_id.value
            }
        })
        const datas = res.data.data;
        console.log(datas);
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
        tags.value = [tagAll, ...labelMap.values()];
    };
    const fakeData = () => {
        const tmpPapers = [
            new Paper("1", "title1", ["author1"], "journal1", 1, ["生物学"]),
            new Paper("2", "title2", ["author2"], "journal2", 2, ["医学"]),
            new Paper("3", "title3", ["author3"], "journal3", 3, ["电气"]),
            new Paper("4", "title4", ["author4"], "journal4", 4, ["AI"]),
            new Paper("5", "title5", ["author5"], "journal5", 5, ["CS"]),
        ];
        const tag0 = new Tag("全部", 5, tmpPapers, [false, false, false, false, false]);
        const tag1 = new Tag("生物学", 1, [tmpPapers[0]], [false]);
        const tag2 = new Tag("医学", 1, [tmpPapers[1]], [false]);
        const tag3 = new Tag("电气", 1, [tmpPapers[2]], [false]);
        const tag4 = new Tag("AI", 1, [tmpPapers[3]], [false]);
        const tag5 = new Tag("CS", 1, [tmpPapers[4]], [false]);
        tags.value = [tag0, tag1, tag2, tag3, tag4, tag5];
    };

    return {
        user_id,
        active_tag_idx,
        active_paper_idx,
        tags,
        set_active_idx,
        set_active_tag,
        getAllCollects,
        push_new_tag,
        change_item_checked,
        fakeData
    }
})