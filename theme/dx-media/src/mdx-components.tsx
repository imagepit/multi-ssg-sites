import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { AsciiFileTree } from '@/components/ascii-file-tree';
import { Callout as BaseCallout } from 'fumadocs-ui/components/callout'
import { SpeechCallout } from '@/components/speech-callout'
import { Steps as FdSteps, Step as FdStep } from 'fumadocs-ui/components/steps'
import { Files as FdFiles } from 'fumadocs-ui/components/files'
import { File as FdFile } from 'fumadocs-ui/components/files'
import { Folder as FdFolder } from 'fumadocs-ui/components/files'
import { ImageZoom } from 'fumadocs-ui/components/image-zoom'
import { Mermaid } from '@/components/Mermaid'
import ExportedImage from '@/components/ExportedImage'
import { PremiumPlaceholder } from '@techdoc/fumadocs-engine/components'

// use this function to get MDX components, you will need it for rendering MDX
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    // Use optimizer output; Zoom wrapper can be applied if needed
    img: (props: any) => <ImageZoom><ExportedImage loading="lazy" alt={props.alt ?? ''} {...props} /></ImageZoom>,
    Image: (props: any) => <ImageZoom><ExportedImage loading="lazy" alt={props.alt ?? ''} {...props} /></ImageZoom>,
    AsciiFileTree: AsciiFileTree as any,
    Files: FdFiles as any,
    File: FdFile as any,
    Folder: ((props: any) => <FdFolder defaultOpen {...props} />) as any,
    Steps: FdSteps as any,
    Step: FdStep as any,
    Callout: (props: any) => {
      const t = String(props?.type || '')
      if (t === 'speech-left' || t === 'speech-right') {
        return (
          <SpeechCallout side={t === 'speech-left' ? 'left' : 'right'} title={props.title}>
            {props.children}
          </SpeechCallout>
        )
      }
      return <BaseCallout {...props} />
    },
    Mermaid: Mermaid as any,
    PremiumPlaceholder: PremiumPlaceholder as any,
    ...components,
  };
}
