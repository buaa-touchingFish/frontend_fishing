export type Paper = {
    id: string;
    title: string;
    authorships: {
        author: {
            id: string;
            display_name: string;
        };
        institutions: never[];
    }[];
    keywords: string[];
    oa_url: string;
    doi: string;
    publication_date: string;
    type: string;
    publisher: {
        id: string;
        display_name: string;
    };
    referenced_works: string[];
    related_works: string[];
    lan: string;
    issn: string;
    is_active: boolean;
    abstract: string;
    isCollected: boolean;
    //统计数据
    cited_by_count: number;
    browse: number;
    good: number;
    collect: number;
}
export type Author = {
    id: string;
    display_name: string;
    works_count: number;
    cited_by_count: number;
    last_known_institution: {
        id: string;
        type: string;
        country_code: string;
        display_name: string;
    };
    fields: string[];
    h_index: number;
    claim_uid: number;
    updated_date: string;
}
export type CoAuthor = {
    id: string;
    display_name: string;
    last_known_institution_display_name: string;
}
export type Institution = {
    id: string;
    display_name: string;
    ror: string;
    country_code: string;
    works_count: number;
    cited_by_count: number;
    type: string;
    homepage_url: string;
    fields: string[];
    associated_institutions?: {
        id: string;
        ror: string;
        display_name: string;
        country_code: string;
        type: string;
        relationship: string;
    }[];
}

export type recommendPaper = {
    id: string,
    title: string,
    browse: number
}