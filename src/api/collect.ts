import api from '@/api/axios'

export const collectArticle2All = (user_id: number, paper_id: number) => {
    return api.post('/collect', {
        params: {
            user_id,
            paper_id
        }
    })
}

export const deleteArticleFromAll = (user_id: number, paper_id: number) => {
    return api.delete('/collect', {
        params: {
            user_id,
            paper_id
        }
    })
}