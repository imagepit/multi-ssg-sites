import defaultMdxComponents from 'fumadocs-ui/mdx'
import type { MDXComponents } from 'mdx/types'
import { ImageZoom } from 'fumadocs-ui/components/image-zoom'
import { Files as FdFiles } from 'fumadocs-ui/components/files'
import { File as FdFile } from 'fumadocs-ui/components/files'
import { Folder as FdFolder } from 'fumadocs-ui/components/files'
import ExportedImage from 'next-image-export-optimizer'
import { LinkCard, XTweetCard } from '@techdoc/fumadocs-engine/components'

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    img: (props: any) => (
      <ImageZoom>
        <ExportedImage loading="lazy" alt={props.alt ?? ''} {...props} />
      </ImageZoom>
    ),
    Image: (props: any) => (
      <ImageZoom>
        <ExportedImage loading="lazy" alt={props.alt ?? ''} {...props} />
      </ImageZoom>
    ),
    Files: FdFiles as any,
    File: FdFile as any,
    Folder: ((props: any) => <FdFolder defaultOpen {...props} />) as any,
    LinkCard: LinkCard as any,
    XTweetCard: XTweetCard as any,
    ...components,
  }
}
