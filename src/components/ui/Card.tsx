export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-lg shadow">
      {children}
    </div>
  )
}