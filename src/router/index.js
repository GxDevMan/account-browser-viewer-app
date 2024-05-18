import mainPage from "@/components/mainPage.vue";
import accountsView from "@/components/accountsView.vue";
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    {path: '/', component: mainPage,
        name: 'mainPage'
    },
    {path: '/accountsView', component: accountsView,
    props: true,
    name: 'accountsView'
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})
export default router;