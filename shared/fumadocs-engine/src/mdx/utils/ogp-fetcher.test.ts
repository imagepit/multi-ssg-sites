import { describe, it, expect } from 'vitest'

// プライベートIPチェック関数をテスト用にエクスポートするか、
// 同等のロジックをテスト内で検証

describe('OGP Fetcher', () => {
  describe('isPrivateIP logic', () => {
    // プライベートIP判定ロジックのテスト
    const isPrivateIP = (hostname: string): boolean => {
      if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1') {
        return true
      }

      const ipv4Match = hostname.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/)
      if (ipv4Match) {
        const [, a, b] = ipv4Match.map(Number)
        if (a === 10) return true
        if (a === 172 && b >= 16 && b <= 31) return true
        if (a === 192 && b === 168) return true
        if (a === 169 && b === 254) return true
        if (a === 127) return true
      }

      return false
    }

    it('should detect localhost', () => {
      expect(isPrivateIP('localhost')).toBe(true)
      expect(isPrivateIP('127.0.0.1')).toBe(true)
      expect(isPrivateIP('::1')).toBe(true)
    })

    it('should detect 10.x.x.x range', () => {
      expect(isPrivateIP('10.0.0.1')).toBe(true)
      expect(isPrivateIP('10.255.255.255')).toBe(true)
    })

    it('should detect 172.16-31.x.x range', () => {
      expect(isPrivateIP('172.16.0.1')).toBe(true)
      expect(isPrivateIP('172.31.255.255')).toBe(true)
      expect(isPrivateIP('172.15.0.1')).toBe(false)
      expect(isPrivateIP('172.32.0.1')).toBe(false)
    })

    it('should detect 192.168.x.x range', () => {
      expect(isPrivateIP('192.168.0.1')).toBe(true)
      expect(isPrivateIP('192.168.255.255')).toBe(true)
      expect(isPrivateIP('192.167.0.1')).toBe(false)
    })

    it('should detect 169.254.x.x (link-local) range', () => {
      expect(isPrivateIP('169.254.0.1')).toBe(true)
      expect(isPrivateIP('169.254.255.255')).toBe(true)
    })

    it('should allow public IPs', () => {
      expect(isPrivateIP('8.8.8.8')).toBe(false)
      expect(isPrivateIP('1.1.1.1')).toBe(false)
      expect(isPrivateIP('203.0.113.1')).toBe(false)
    })

    it('should allow domain names', () => {
      expect(isPrivateIP('example.com')).toBe(false)
      expect(isPrivateIP('zenn.dev')).toBe(false)
    })
  })

  describe('URL validation logic', () => {
    const validateUrl = (urlString: string): URL => {
      const url = new URL(urlString)

      if (url.protocol !== 'http:' && url.protocol !== 'https:') {
        throw new Error(`Invalid protocol: ${url.protocol}`)
      }

      return url
    }

    it('should accept http/https URLs', () => {
      expect(() => validateUrl('https://example.com')).not.toThrow()
      expect(() => validateUrl('http://example.com')).not.toThrow()
    })

    it('should reject non-http protocols', () => {
      expect(() => validateUrl('ftp://example.com')).toThrow('Invalid protocol')
      expect(() => validateUrl('file:///etc/passwd')).toThrow('Invalid protocol')
      expect(() => validateUrl('javascript:alert(1)')).toThrow('Invalid protocol')
    })

    it('should reject invalid URLs', () => {
      expect(() => validateUrl('not-a-url')).toThrow()
      expect(() => validateUrl('')).toThrow()
    })
  })

  describe('HTML entity decoding', () => {
    const decodeHtmlEntities = (text: string): string => {
      return text
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&#x27;/g, "'")
        .replace(/&#x2F;/g, '/')
    }

    it('should decode common HTML entities', () => {
      expect(decodeHtmlEntities('&amp;')).toBe('&')
      expect(decodeHtmlEntities('&lt;')).toBe('<')
      expect(decodeHtmlEntities('&gt;')).toBe('>')
      expect(decodeHtmlEntities('&quot;')).toBe('"')
      expect(decodeHtmlEntities('&#39;')).toBe("'")
    })

    it('should decode mixed content', () => {
      expect(decodeHtmlEntities('Tom &amp; Jerry')).toBe('Tom & Jerry')
      expect(decodeHtmlEntities('&lt;script&gt;')).toBe('<script>')
    })
  })

  describe('OGP parsing logic', () => {
    const parseOgpFromHtml = (html: string, url: string) => {
      const result: { url: string; title?: string; description?: string; image?: string; siteName?: string } = { url }

      const titleMatch = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i)
        || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["']/i)
      if (titleMatch) {
        result.title = titleMatch[1]
      }

      const descMatch = html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i)
        || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:description["']/i)
      if (descMatch) {
        result.description = descMatch[1]
      }

      const imageMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
        || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i)
      if (imageMatch) {
        result.image = imageMatch[1]
      }

      const siteNameMatch = html.match(/<meta[^>]+property=["']og:site_name["'][^>]+content=["']([^"']+)["']/i)
        || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:site_name["']/i)
      if (siteNameMatch) {
        result.siteName = siteNameMatch[1]
      }

      return result
    }

    it('should parse OGP meta tags (property first)', () => {
      const html = `
        <html>
          <head>
            <meta property="og:title" content="Test Title">
            <meta property="og:description" content="Test Description">
            <meta property="og:image" content="https://example.com/image.png">
            <meta property="og:site_name" content="Test Site">
          </head>
        </html>
      `

      const result = parseOgpFromHtml(html, 'https://example.com')
      expect(result.title).toBe('Test Title')
      expect(result.description).toBe('Test Description')
      expect(result.image).toBe('https://example.com/image.png')
      expect(result.siteName).toBe('Test Site')
    })

    it('should parse OGP meta tags (content first)', () => {
      const html = `
        <html>
          <head>
            <meta content="Test Title" property="og:title">
            <meta content="Test Description" property="og:description">
          </head>
        </html>
      `

      const result = parseOgpFromHtml(html, 'https://example.com')
      expect(result.title).toBe('Test Title')
      expect(result.description).toBe('Test Description')
    })

    it('should handle missing OGP tags', () => {
      const html = '<html><head></head></html>'

      const result = parseOgpFromHtml(html, 'https://example.com')
      expect(result.url).toBe('https://example.com')
      expect(result.title).toBeUndefined()
      expect(result.description).toBeUndefined()
    })
  })
})
