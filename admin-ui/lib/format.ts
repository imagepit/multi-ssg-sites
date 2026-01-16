export function formatDate(value?: string | null): string {
  if (!value) {
    return '-'
  }
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }
  return date.toLocaleString()
}

export function formatTags(tags?: string[] | null): string {
  if (!tags || tags.length === 0) {
    return '-'
  }
  return tags.join(', ')
}
