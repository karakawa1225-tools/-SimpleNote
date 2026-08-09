import { Check, Download } from 'lucide-react'
import { Link } from 'react-router-dom'

export function CTASection() {
  return (
    <section className="relative overflow-hidden bg-white py-20 lg:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(0,102,230,0.08),_transparent_55%)]" />
      <div className="relative mx-auto max-w-3xl px-5 text-center lg:px-8">
        <p className="font-display text-lg font-bold text-sn-navy sm:text-xl">
          シンプルだから、毎日使える。
        </p>
        <h2 className="mt-3 font-display text-[clamp(2.2rem,8vw,4rem)] font-black leading-tight text-sn-blue">
          今すぐはじめよう！
        </h2>

        <div className="relative mx-auto mt-6 inline-flex">
          <span className="absolute -right-10 -top-4 flex h-16 w-16 rotate-6 items-center justify-center rounded-full bg-sn-yellow text-center text-[11px] font-black leading-tight text-sn-navy shadow-md">
            無料で
            <br />
            使える！
          </span>
          <Link
            to="/home"
            className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-sn-blue px-10 text-base font-bold text-white shadow-xl shadow-sn-blue/30 transition hover:bg-sn-blue-dark"
          >
            <Download className="h-5 w-5" />
            無料でSimpleNoteを使う
          </Link>
        </div>

        <ul className="mt-10 flex flex-col items-center justify-center gap-3 text-sm font-semibold text-sn-ink sm:flex-row sm:gap-8">
          {['スマートフォン対応', 'タブレット対応', 'PC対応'].map((t) => (
            <li key={t} className="inline-flex items-center gap-2">
              <Check className="h-4 w-4 text-sn-blue" strokeWidth={3} />
              {t}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
