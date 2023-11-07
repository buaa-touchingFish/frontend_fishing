import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useUserStore = defineStore('user', () => {
    const curUser = ref(-1);
    const isNew = ref(false);
    return { curUser,isNew };
})