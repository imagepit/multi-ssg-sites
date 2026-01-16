import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { getBranding, getSiteName } from '@/lib/site-config';
const navLinks: BaseLayoutProps['links'] = [
  { type: 'main', text: 'AI', url: '#', active: 'none' },
  { type: 'main', text: 'クラウド', url: '#', active: 'none' },
  { type: 'main', text: 'DevOps', url: '#', active: 'none' },
  { type: 'main', text: 'フロントエンド', url: '#', active: 'none' },
  { type: 'main', text: 'バックエンド', url: '#', active: 'none' },
  { type: 'main', text: 'セキュリティ', url: '#', active: 'none' },
  { type: 'main', text: 'データベース', url: '#', active: 'none' },
  { type: 'main', text: 'システム設計', url: '#', active: 'none' },
]

/**
 * Shared layout configurations
 *
 * you can customise layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (() => {
        const { logo } = getBranding();
        const name = getSiteName() ?? 'Docs';
        return (
          <>
            {logo ? (
              <img src={`/brand/${logo}`} width={24} height={24} alt="Logo" />
            ) : (
              <svg
                width="24"
                height="24"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="Logo"
              >
                <circle cx={12} cy={12} r={12} fill="currentColor" />
              </svg>
            )}
            <span className="site-title-text">{name}</span>
          </>
        );
      })(),
    },
    // see https://fumadocs.dev/docs/ui/navigation/links
    links: navLinks,
  };
}
