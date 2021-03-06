// JS Imports
// –– Vue
import Vue from 'vue'
import VueRouter from 'vue-router'
import store from 'app/vuex/store'

// –– Constants
import {debug, hash_routing} from './consts/local'

// -- Route Panels
import DashboardPanel from "./panels/dashboard_panel/dashboard"
import SubscriptionsPanel from "./panels/subscriptions_panel/subscriptions"
import PreviewDashboard from './panels/preview_panel/preview'
import SubscriptionCreator from "./panels/subscription_creator/subscription_creator"

import { authenticate } from 'app/vuex/actions'
import { create_sign_out_url } from 'app/utils/url_helpers'


Vue.use(VueRouter)
Vue.config.debug = debug

const router = new VueRouter({
    history: !hash_routing,
    hashbang: hash_routing,
})

router.map({
    '/': {
        name: 'dashboard',
        component: DashboardPanel,
        authenticated: true,
    },
    '/subscriptions': {
        name: 'subscriptions',
        component: SubscriptionsPanel,
        authenticated: true,
    },
    '/subscriptions/new': {
        name: 'create-subscription',
        title: 'Create New Subscription',
        component: SubscriptionCreator,
        authenticated: true,
    },
    '/preview': {
        name: 'preview-dashboard',
        title: 'Preview Subscription',
        component: PreviewDashboard,
        authenticated: false,
    },
})

router.beforeEach(function({to, next}) {
    if (to.authenticated && store.state.user === null) {
        const go_auth = auth_client_url => {
            const router_mode = to.router.mode
            const redirect_path = to.path
            const auth_url = create_sign_out_url({router_mode, auth_client_url, redirect_path})
            window.location = auth_url}
        authenticate(store).then(next).catch(go_auth)
    } else {
        next()
    }
})

// For debugging against the web console
if (debug) {
    window.app = router
}

export default router
