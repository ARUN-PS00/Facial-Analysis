export default function Footer() {
  return (
    <footer className="border-t border-gray-900 bg-gray-950/60 py-8 text-center text-xs text-gray-500">
      <div className="mx-auto max-w-6xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          Facial Analysis AI — Real-time Client-side Vision Studio
        </div>
        <div className="text-gray-600">
          Based on the <a href="https://github.com/gazijarin/itsgiving" target="_blank" rel="noreferrer" className="underline hover:text-emerald-400">It's Giving</a> reference project.
        </div>
      </div>
    </footer>
  )
}
