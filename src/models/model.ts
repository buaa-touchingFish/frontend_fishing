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
    cited_by_count: number;
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
    claim_uid: null;
    updated_date: string;
}
export type CoAuthor = {
    id: string;
    display_name: string;
    last_known_institution_display_name: string;
}