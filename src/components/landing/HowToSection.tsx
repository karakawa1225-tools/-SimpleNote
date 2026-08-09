import { PhoneMockup } from '@/components/PhoneMockup'

const steps = [
  {
    no: '01',
    title: 'HOMEを見る',
    desc: 'カレンダーと最近のNOTEを確認。',
    path: '/home',
  },
  {
    no: '02',
    title: '日付から探す',
    desc: 'カレンダーの日付をタップして、その日のNOTE一覧を表示。',
    path: '/calendar',
  },
  {
    no: '03',
    title: 'NOTEを見る',
    desc: 'タイトル・本文・写真・PDF・メモをひとつの画面で確認。',
    path: '/notes/note-1',
  },
  {
    no: '04',
    title: 'フォルダで整理',
    desc: '仕事・現場・アイデアなど、用途別に整理。',
    path: '/folders',
  },
]

export function HowToSection() {
  return (
    <section id="howto" className="bg-sn-bg py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="max-w-xl">
          <p className="text-sm font-bold tracking-wide text-sn-blue">HOW TO USE</p>
          <h2 className="mt-2 font-display text-3xl font-black text-sn-navy sm:text-4xl">
            SimpleNoteの使い方
          </h2>
          <p className="mt-3 text-sm leading-7 text-sn-muted">
            下のスマートフォンUIを実際に触って、流れを体験できます。
          </p>
        </div>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
          {steps.map((s) => (
            <article key={s.no} className="flex flex-col">
              <div className="mb-4">
                <span className="font-display text-4xl font-black text-sn-blue/20">
                  {s.no}
                </span>
                <h3 className="mt-1 font-display text-lg font-black text-sn-navy">
                  {s.title}
                </h3>
                <p className="mt-1 text-sm leading-6 text-sn-muted">{s.desc}</p>
              </div>
              <PhoneMockup
                initialPath={s.path}
                className="max-w-[240px]"
                height={520}
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
