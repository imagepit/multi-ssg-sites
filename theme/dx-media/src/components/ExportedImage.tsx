import ExportedImage, { type ExportedImageProps } from 'next-image-export-optimizer'

const isDev = process.env.NODE_ENV === 'development'

export default function DevExportedImage(props: ExportedImageProps) {
  const { unoptimized, ...rest } = props
  const resolvedUnoptimized = isDev ? true : unoptimized
  return <ExportedImage {...rest} unoptimized={resolvedUnoptimized} />
}
