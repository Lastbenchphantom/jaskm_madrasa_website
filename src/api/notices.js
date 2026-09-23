import { noticesFallback, site } from '../data/content'

function mapNotice(item) {
  return {
    title: item.EnglishTitle || item.BanglaTitle || 'Notice',
    category: item.NoticeCategoryName || 'Notice',
    date: (item.CreatedDate || '').slice(0, 10),
    file: item.FileLink || null,
  }
}

export async function fetchNotices() {
  try {
    const res = await fetch(`${site.api.base}/NoticeClient/notices`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-App-Key': site.api.key,
        'X-App-Client': site.api.client,
      },
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const json = await res.json()
    const rows = Array.isArray(json?.data) ? json.data : []
    const seen = new Set()
    const mapped = []
    for (const row of rows) {
      const notice = mapNotice(row)
      if (!notice.title || seen.has(notice.title)) continue
      seen.add(notice.title)
      mapped.push(notice)
    }
    return mapped.length ? mapped : noticesFallback
  } catch {
    return noticesFallback
  }
}
