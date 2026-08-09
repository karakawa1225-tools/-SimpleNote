import { PhoneMockup } from '@/components/PhoneMockup'

export function MainCopySection() {
  return (
    <section className="relative overflow-hidden bg-sn-blue py-20 text-white diag-band lg:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 lg:grid-cols-2 lg:px-8">
        <div>
          <h2 className="font-display text-[clamp(2rem,6vw,3.5rem)] font-black leading-[1.15] text-balance">
            <span className="block">すべての情報を、</span>
            <span className="block text-sn-yellow">ひとつのNOTEに。</span>
          </h2>
          <p className="mt-5 max-w-md text-base leading-8 text-white/85">
            テキスト・写真・PDF・メモをまとめて管理。
            複雑な機能は要らない。残したいことを、すぐ残す。
          </p>
        </div>
        <div className="anim-slide-up">
          <PhoneMockup initialPath="/notes/note-1" />
        </div>
      </div>
    </section>
  )
}
