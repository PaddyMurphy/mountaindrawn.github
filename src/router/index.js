import Vue from 'vue'
import Router from 'vue-router'
import Mountain from '@/components/Mountain'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Mountain',
      component: Mountain
    },
    {
      path: '/:mountain',
      name: 'MountainUrl',
      component: Mountain
    }
  ]
})
