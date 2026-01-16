import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { source } from '@/lib/source'
import MainToc from '../../components/MainToc'
import { getMDXComponents } from '@/mdx-components'

export default async function Page(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params
  const page = source.getPage(params.slug || [])
  if (!page) notFound()
  const MDX = page.data.body
  return (
    <article>
      <h1>{page.data.title}</h1>
      {page.data.description ? <p>{page.data.description}</p> : null}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 24 }}>
        <div>
          <MDX components={getMDXComponents()} />
        </div>
        <div>
          <MainToc toc={page.data.toc as any} />
        </div>
      </div>
    </article>
  )
}

export async function generateStaticParams() {
  return source.generateParams()
}

export async function generateMetadata(props: { params: Promise<{ slug?: string[] }> }): Promise<Metadata> {
  const params = await props.params
  const page = source.getPage(params.slug || [])
  if (!page) notFound()
  return {
    title: page.data.title,
    description: page.data.description,
  }
}
