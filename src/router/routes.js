import categories from 'assets/categories' // 类别
import LayoutShowcase from 'layouts/showcase' // 布局展示

// 定义路由
const routes = [
  {
    path: '/',
    component: () => import('pages/landing')
  }
]

function lazyLoad (path, meta) {
  return {
    path,
    meta,
    component: () => import('pages/showcase/' + path)
  }
}

const showcase = {
  path: '/showcase',
  component: LayoutShowcase,
  children: [
    {
      path: '',
      meta: {
        title: 'Ebook Web',
        hash: '/showcase',
        icon: 'layers',
        backRoute: '/'
      },
      component: () => import('pages/showcase/index')
    }
  ]
}

categories.forEach(category => {
  if (category.extract) {
    return
  }
  category.features.forEach(feature => {
    let path = category.hash + '/' + feature.hash

    if (!feature.tabs) {
      showcase.children.push(lazyLoad(path, feature))
      return
    }

    feature.tabs.forEach(tab => {
      let subpath = path + '/' + tab.hash
      showcase.children.push(lazyLoad(subpath, {
        title: tab.title,
        hash: '/' + path,
        iframeTabs: feature.iframeTabs,
        icon: feature.icon,
        tabs: feature.tabs
      }))
    })

    routes.push({
      path: '/showcase/' + path,
      redirect: '/showcase/' + path + '/' + feature.tabs[0].hash
    })
  })
})

routes.push(showcase)

// 添加布局模板路由
routes.push({
  path: '/showcase/layout-demo',
  component: () => import('layouts/layout-demo'),
  children: [
    {path: 'play-with-layout', component: () => import('pages/layout-demo/play-with-layout')},
    {path: 'drawer-panels', component: () => import('pages/layout-demo/drawer-panels')},
    {path: 'page-sticky', component: () => import('pages/layout-demo/page-sticky')},
    {path: 'floating-action-button', component: () => import('pages/layout-demo/floating-action-button')}
  ]
})

// 没有找到路由返回404
routes.push({path: '*', component: () => import('pages/error404.vue')})

export default routes
