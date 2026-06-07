export const metadata = {
  title: 'AgencyAudit AI',
  description: 'Audit any website and generate high-converting pitches',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
