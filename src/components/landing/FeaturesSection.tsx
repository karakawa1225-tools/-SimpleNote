import { CalendarDays, Folder, Paperclip } from 'lucide-react'

const features = [
  {
    no: '01',
    icon: CalendarDays,
    title: 'カレンダーですぐ見つかる',
    desc: 'NOTEを作成した日付から、必要な情報をすぐに見つけられます。',
  },
  {
    no: '02',
    icon: Paperclip,
    title: '写真・PDFもひとつに',
    desc: 'テキストだけではなく、写真やPDFもNOTEと一緒に保存できます。',
  },
  {
    no: '03',
    icon: Folder,
    title: 'フォルダでスッキリ整理',
    desc: '仕事・現場・アイデア・プライベートなど、用途ごとに整理できます。',
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((f) => {
            const Icon = f.icon
            return (
              <article
                key={f.no}
                className="anim-fade-up rounded-3xl border border-sn-line bg-sn-bg/60 p-6"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sn-blue text-white">
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="font-display text-2xl font-black text-sn-blue/25">
                    {f.no}
                  </span>
                </div>
                <h3 className="font-display text-lg font-black text-sn-navy">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-sn-muted">{f.desc}</p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
