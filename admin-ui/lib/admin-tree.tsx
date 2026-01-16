import type * as PageTree from 'fumadocs-core/page-tree'

export const adminTree: PageTree.Root = {
  name: 'Admin',
  children: [
    {
      type: 'page',
      name: 'Home',
      url: '/',
    },
    {
      type: 'separator',
      name: 'Resources',
    },
    {
      type: 'folder',
      name: 'Content',
      defaultOpen: true,
      children: [
        {
          type: 'page',
          name: 'Sites',
          url: '/sites',
        },
        {
          type: 'page',
          name: 'Pages',
          url: '/pages',
        },
      ],
    },
    {
      type: 'separator',
      name: 'System',
    },
    {
      type: 'page',
      name: 'Access',
      url: '/access',
    },
  ],
}
