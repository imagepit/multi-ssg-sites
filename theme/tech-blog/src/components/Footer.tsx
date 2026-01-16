export default function Footer({ siteName }: { siteName: string }) {
  return (
    <footer className="tb-footer">
      <div className="tb-container">© {new Date().getFullYear()} {siteName}</div>
    </footer>
  )
}

