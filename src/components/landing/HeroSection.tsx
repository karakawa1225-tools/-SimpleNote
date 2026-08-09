import { Link } from 'react-router-dom'
import { Logo } from '@/components/Logo'
import { PhoneMockup } from '@/components/PhoneMockup'

export function HeroSection() {
  return (
    <section className="hero-glow relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-16 pt-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:px-8 lg:pb-24 lg:pt-10">
        <div className="relative z-10">
          <div className="anim-fade-in">
            <Logo size="lg" />
          </div>

          <h1 className="mt-8 font-display font-black leading-[1.05] tracking-tight text-balance">
            <span className="anim-fade-up block text-[clamp(2.4rem,11vw,4.75rem)] text-sn-navy">
              シンプルに書く。
            </span>
            <span className="anim-fade-up delay-1 block text-[clamp(2.4rem,11vw,4.75rem)] text-sn-blue">
              すぐに残す。
            </span>
          </h1>

          <div className="anim-fade-up delay-2 relative mt-6 inline-block">
            <span className="absolute inset-0 -skew-x-6 rounded-md bg-sn-yellow" />
            <p className="relative px-4 py-2 font-display text-sm font-bold text-sn-navy sm:text-base">
              メモを、もっと自由に。
            </p>
          </div>

          <p className="anim-fade-up delay-2 mt-5 max-w-md text-sm leading-7 text-sn-muted sm:text-base">
            テキスト・写真・PDF・メモを、ひとつのNOTEに。
            仕事も現場もアイデアも、すぐに残せてすぐ見つかる。
          </p>

          <div className="anim-fade-up delay-3 mt-8 flex flex-wrap gap-3">
            <Link
              to="/home"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-sn-blue px-7 text-sm font-bold text-white shadow-lg shadow-sn-blue/30 transition hover:bg-sn-blue-dark"
            >
              今すぐSimpleNoteを使う
            </Link>
            <a
              href="#features"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-sn-line bg-white px-6 text-sm font-bold text-sn-navy hover:bg-sn-blue-soft"
            >
              特徴を見る
            </a>
          </div>
        </div>

        <div className="anim-scale-in delay-2 relative">
          <div className="pointer-events-none absolute -inset-8 -z-10 rounded-full bg-sn-blue/10 blur-3xl" />
          <PhoneMockup />
          <p className="mt-4 text-center text-xs font-semibold text-sn-muted lg:text-left">
            ※ モックアップ内のUIは実際に操作できます
          </p>
        </div>
      </div>
    </section>
  )
}
