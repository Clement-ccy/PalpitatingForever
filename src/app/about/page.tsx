'use client';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowUpRight,
  BadgeCheck,
  Compass,
  Gamepad2,
  Heart,
  Laptop,
  Music2,
  PenTool,
  Sparkles,
  Star,
  Trophy,
  User,
  Wand2,
} from 'lucide-react';
import { BentoGrid, BentoItem } from '@/components/ui/bento-grid';
import { SpotlightCard } from '@/components/ui/spotlight-card';
import { cn } from '@/lib/utils';

const badgeItems = [
  { icon: Sparkles, label: '沉浸式设计' },
  { icon: PenTool, label: '产品叙事' },
  { icon: Star, label: '创作记录' },
  { icon: Heart, label: '长期主义' },
  { icon: Compass, label: '实验精神' },
];

const focusItems = [
  {
    icon: BadgeCheck,
    title: 'Notion 数据驱动',
    description: '页面/区块全量同步，内容结构先行。',
  },
  {
    icon: Wand2,
    title: '隐私友好分析',
    description: '自建 analytics + comments，轻量透明。',
  },
  {
    icon: Compass,
    title: '系统化搭建',
    description: 'Worker + D1 组合，保持可维护与扩展。',
  },
];

const stackItems = [
  { label: 'Figma', icon: '/media/stack/figma.png', color: 'text-orange-300', dot: 'bg-orange-400' },
  { label: 'Procreate', icon: '/media/stack/procreate.png', color: 'text-amber-300', dot: 'bg-amber-400' },
  { label: 'Illustrator', icon: '/media/stack/illustrator.png', color: 'text-orange-200', dot: 'bg-orange-300' },
  { label: 'Photoshop', icon: '/media/stack/photoshop.png', color: 'text-sky-300', dot: 'bg-sky-400' },
  { label: 'After Effects', icon: '/media/stack/after-effects.png', color: 'text-purple-300', dot: 'bg-purple-400' },
  { label: 'Swift', icon: '/media/stack/swift.png', color: 'text-rose-300', dot: 'bg-rose-400' },
  { label: 'React', icon: '/media/stack/react.png', color: 'text-cyan-300', dot: 'bg-cyan-400' },
  { label: 'Next.js', icon: '/media/stack/next.png', color: 'text-neutral-200', dot: 'bg-neutral-300' },
  { label: 'TypeScript', icon: '/media/stack/typescript.png', color: 'text-blue-300', dot: 'bg-blue-400' },
  { label: 'JavaScript', icon: '/media/stack/javascript.png', color: 'text-yellow-300', dot: 'bg-yellow-400' },
  { label: 'Tailwind', icon: '/media/stack/tailwind.png', color: 'text-teal-300', dot: 'bg-teal-400' },
  { label: 'Framer', icon: '/media/stack/framer.png', color: 'text-fuchsia-300', dot: 'bg-fuchsia-400' },
  { label: 'Notion', icon: '/media/stack/notion.png', color: 'text-zinc-200', dot: 'bg-zinc-300' },
  { label: 'Cloudflare', icon: '/media/stack/cloudflare.png', color: 'text-orange-200', dot: 'bg-orange-300' },
  { label: 'SQLite', icon: '/media/stack/sqlite.png', color: 'text-emerald-200', dot: 'bg-emerald-300' },
  { label: 'Vercel', icon: '/media/stack/vercel.png', color: 'text-slate-200', dot: 'bg-slate-300' },
  { label: 'VSCode', icon: '/media/stack/vscode.png', color: 'text-blue-200', dot: 'bg-blue-300' },
  { label: 'WebGL', icon: '/media/stack/webgl.png', color: 'text-sky-200', dot: 'bg-sky-300' },
  { label: 'Git', icon: '/media/stack/git.png', color: 'text-red-300', dot: 'bg-red-400' },
];

const stackMarquee = [...stackItems, ...stackItems];

const milestones = [
  { year: '2022', label: '设计起步', position: '6%', color: 'bg-sky-400' },
  { year: '2023', label: '产品思维', position: '32%', color: 'bg-indigo-400' },
  { year: '2024', label: '前端系统', position: '62%', color: 'bg-emerald-400' },
  { year: '2025', label: '独立创作', position: '90%', color: 'bg-amber-400' },
];

const strengthTags = ['产品设计', '交互体验', '视觉系统', '前端工程', '信息架构', '内容叙事', '动效设计', '工具构建'];

const hobbyItems = [
  { icon: Gamepad2, title: 'APEX Legends', desc: '团队协作与策略', accent: 'text-emerald-400' },
  { icon: Trophy, title: 'Terraria', desc: '探索与冒险', accent: 'text-purple-400' },
  { icon: Laptop, title: '数码科技', desc: '效率工具控', accent: 'text-sky-400' },
  { icon: Music2, title: '音乐/影像', desc: '节奏与氛围', accent: 'text-pink-400' },
];

const highlightStats = [
  { value: '2003', label: '出生' },
  { value: '4+', label: '设计年限' },
  { value: '10+', label: '项目实践' },
  { value: '∞', label: '灵感续航' },
];

const supporters = ['期待你的名字', '加入赞助', '长期主义', '创作共建', 'Thanks', 'Support', '赞助席位', '一起成长'];

export default function AboutPage() {
  return (
    <div className="min-h-screen text-foreground">
      <header className="mb-12">
        <div className="flex flex-col items-center text-center gap-6">
          <div className="flex flex-wrap justify-center gap-2">
            {badgeItems.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-card-border text-[10px] font-mono text-muted"
              >
                <Icon size={12} /> {label}
              </span>
            ))}
          </div>

          <div className="relative">
            <div className="absolute -inset-2 rounded-full bg-linear-to-br from-accent-works/20 via-accent-blogs/10 to-accent-mlogs/20 blur-xl" />
            <div className="relative h-24 w-24 rounded-full overflow-hidden border border-card-border bg-card">
              <Image src="/media/avatar.png" alt="Clement Chen" fill className="object-cover" />
            </div>
          </div>

          <div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">关于本站</h1>
            <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl">
              这是一个关于设计、工程与长期主义的个人系统。用内容搭建结构，用体验讲述故事。
            </p>
          </div>
        </div>
      </header>

      <BentoGrid className="max-w-6xl w-full grid-cols-1 md:grid-cols-4 gap-6">
        <BentoItem colSpan={2} rowSpan={1}>
          <SpotlightCard className="h-full w-full p-6 md:p-8 bg-linear-to-br from-indigo-500/90 to-blue-500/90 border-transparent text-white">
            <p className="text-xs font-mono uppercase tracking-widest text-white/70">你好，很高兴认识你</p>
            <h2 className="mt-3 text-3xl md:text-4xl font-semibold">我叫 Clement Chen</h2>
            <p className="mt-2 text-sm text-white/80">产品设计 · 前端工程 · 视觉叙事</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {['产品策略', '交互体验', '视觉系统', '工程落地'].map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-full text-[10px] font-mono border border-white/30 bg-white/10">
                  {tag}
                </span>
              ))}
            </div>
          </SpotlightCard>
        </BentoItem>

        <BentoItem colSpan={2} rowSpan={1}>
          <SpotlightCard className="h-full w-full p-6 md:p-8">
            <p className="text-xs font-mono text-muted uppercase tracking-widest">站点理念</p>
            <h2 className="mt-3 text-2xl md:text-3xl font-semibold">
              源于<span className="text-accent-blogs">热爱</span>，面向体验
            </h2>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              这里是我的内容中枢：博客、音乐日志、摄影记录、作品集。它们来自 Notion 并被重新组织成可阅读、可检索的体验。
            </p>
            <div className="mt-6 grid gap-4">
              {focusItems.map(({ icon: Icon, title, description }) => (
                <div key={title} className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-xl border border-card-border bg-card flex items-center justify-center">
                    <Icon size={16} className="text-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{title}</p>
                    <p className="text-xs text-muted-foreground">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </SpotlightCard>
        </BentoItem>

        <BentoItem colSpan={2} rowSpan={2}>
          <SpotlightCard className="group h-full w-full p-6 md:p-8 overflow-hidden">
            <p className="text-xs font-mono text-muted uppercase tracking-widest">开启创造力</p>
            <h3 className="mt-3 text-2xl font-semibold">从概念到落地的工具链</h3>
            <p className="mt-2 text-sm text-muted-foreground">我所掌握的技术栈，Hover 查看具体的技术栈详情。</p>

            <div className="mt-6 relative h-[320px] rounded-2xl border border-card-border bg-background/40 overflow-hidden">
              <div className="absolute inset-0 transition-opacity duration-500 ease-out opacity-100 group-hover:opacity-0">
                <div className="absolute inset-0 rotate-[-8deg]">
                  <div className="stack-diagonal gap-4">
                    {stackMarquee.map((item, index) => (
                      <div
                        key={`${item.label}-${index}`}
                        className="h-32 w-32 rounded-3xl border border-card-border bg-card flex items-center justify-center"
                        title={item.label}
                      >
                        <Image src={item.icon} alt={item.label} width={64} height={64} className="object-contain" />
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 stack-diagonal-reverse gap-4">
                    {stackMarquee.map((item, index) => (
                      <div
                        key={`${item.label}-reverse-${index}`}
                        className="h-32 w-32 rounded-3xl border border-card-border bg-card flex items-center justify-center"
                        title={item.label}
                      >
                        <Image src={item.icon} alt={item.label} width={64} height={64} className="object-contain" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="absolute inset-0 transition-opacity duration-500 ease-out opacity-0 group-hover:opacity-100">
                <div className="absolute inset-0 bg-linear-to-t from-background/90 via-background/70 to-background/40" />
                <div className="absolute inset-0 p-4 flex flex-wrap content-start gap-3">
                  {stackItems.map((item) => (
                    <span
                      key={`${item.label}-tag`}
                      className={cn(
                        'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-mono border border-card-border bg-card/70 text-muted-foreground',
                        item.color
                      )}
                    >
                      <span className={cn('h-2 w-2 rounded-full', item.dot)} />
                      {item.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </SpotlightCard>
        </BentoItem>

        <BentoItem colSpan={2} rowSpan={2}>
          <SpotlightCard className="h-full w-full p-6 md:p-8">
            <p className="text-xs font-mono text-muted uppercase tracking-widest">无限进步</p>
            <h3 className="mt-3 text-2xl font-semibold">探索路径与里程碑</h3>
            <p className="mt-2 text-sm text-muted-foreground">每一次阶段性突破都沉淀在系统里。</p>
            <div className="mt-6">
              <div className="relative h-2 rounded-full bg-card-border/50 overflow-hidden">
                <div className="absolute inset-y-0 left-0 w-[85%] bg-linear-to-r from-sky-500 via-indigo-500 to-rose-500 rounded-full" />
                {milestones.map((milestone) => (
                  <span
                    key={milestone.year}
                    className={cn('absolute -top-1.5 h-5 w-5 rounded-full border-2 border-background', milestone.color)}
                    style={{ left: milestone.position }}
                  />
                ))}
              </div>
              <div className="mt-6 grid gap-4">
                {milestones.map((milestone) => (
                  <div key={`${milestone.year}-detail`} className="rounded-2xl border border-card-border bg-background/40 p-4">
                    <div className="flex items-center gap-3">
                      <span className={cn('h-2.5 w-2.5 rounded-full', milestone.color)} />
                      <p className="text-sm font-semibold text-foreground">{milestone.year}</p>
                      <span className="text-xs text-muted">{milestone.label}</span>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {milestone.year === '2017' && '启动设计训练，建立视觉与品牌敏感度。'}
                      {milestone.year === '2019' && '进入产品思考阶段，关注用户体验与商业平衡。'}
                      {milestone.year === '2022' && '搭建前端体系与组件化设计，形成可复用框架。'}
                      {milestone.year === '2025' && '持续独立创作，强化内容与系统的可持续性。'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </SpotlightCard>
        </BentoItem>

        <BentoItem colSpan={1} rowSpan={1}>
          <SpotlightCard className="h-full w-full p-6 flex flex-col justify-between">
            <p className="text-xs font-mono text-muted uppercase tracking-widest">人格标签</p>
            <div>
              <h3 className="mt-3 text-2xl font-semibold">INFP-T</h3>
              <p className="mt-2 text-sm text-muted-foreground">调停者 · 以故事和共情驱动设计</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {['共情', '理想主义', '叙事感'].map((tag) => (
                <span key={tag} className="px-2 py-1 rounded-full text-[10px] font-mono border border-card-border text-muted">
                  {tag}
                </span>
              ))}
            </div>
          </SpotlightCard>
        </BentoItem>

        <BentoItem colSpan={1} rowSpan={1}>
          <SpotlightCard className="h-full w-full p-6 flex flex-col justify-between">
            <p className="text-xs font-mono text-muted uppercase tracking-widest">座右铭</p>
            <div>
              <h3 className="mt-3 text-xl font-semibold">荆棘之路，勇敢前行</h3>
              <p className="mt-2 text-sm text-muted-foreground">保持好奇、持续迭代，在复杂中寻找秩序。</p>
            </div>
            <div className="mt-4 inline-flex items-center gap-2 text-xs text-muted">
              <User size={14} /> 自我驱动
            </div>
          </SpotlightCard>
        </BentoItem>

        <BentoItem colSpan={2} rowSpan={1}>
          <SpotlightCard className="h-full w-full p-6 md:p-8">
            <p className="text-xs font-mono text-muted uppercase tracking-widest">热爱清单</p>
            <h3 className="mt-3 text-2xl font-semibold">生活里的能量来源</h3>
            <div className="mt-6 grid grid-cols-2 gap-4">
              {hobbyItems.map((item) => (
                <div key={item.title} className="rounded-2xl border border-card-border bg-background/40 p-4">
                  <div className="flex items-center gap-2">
                    <item.icon size={16} className={item.accent} />
                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </SpotlightCard>
        </BentoItem>

        <BentoItem colSpan={2} rowSpan={1}>
          <SpotlightCard className="h-full w-full p-6 md:p-8">
            <p className="text-xs font-mono text-muted uppercase tracking-widest">擅长领域</p>
            <h3 className="mt-3 text-2xl font-semibold">从策略到细节的协作</h3>
            <div className="mt-5 flex flex-wrap gap-2">
              {strengthTags.map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-full text-[10px] font-mono border border-card-border text-muted">
                  {tag}
                </span>
              ))}
            </div>
          </SpotlightCard>
        </BentoItem>

        <BentoItem colSpan={2} rowSpan={1}>
          <SpotlightCard className="h-full w-full p-6 md:p-8">
            <p className="text-xs font-mono text-muted uppercase tracking-widest">里程碑</p>
            <h3 className="mt-3 text-2xl font-semibold">持续输出与积累</h3>
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              {highlightStats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-card-border bg-background/40 p-4">
                  <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </SpotlightCard>
        </BentoItem>
      </BentoGrid>

      <section className="mt-12 space-y-6">
        <SpotlightCard className="p-6 md:p-8">
          <p className="text-xs font-mono text-muted uppercase tracking-widest">为什么建站？</p>
          <h2 className="mt-3 text-3xl font-semibold">让创作成为一种长期系统</h2>
          <div className="mt-4 space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p>
              这个站点是一个持续更新的自我档案：博客、音乐日志、摄影与作品集共同组成我的创作图谱。
              我希望它不仅承载作品，还能留下思考、记录路径。
            </p>
            <p>
              我在尝试建立一种更轻量、可控的内容与数据系统：Notion 负责内容结构，Worker + D1 负责数据流转，
              前端负责呈现体验。它既是实验场，也是未来产品的原型。
            </p>
          </div>
        </SpotlightCard>

        <SpotlightCard className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-xs font-mono text-muted uppercase tracking-widest">打赏名单</p>
              <h3 className="mt-2 text-2xl font-semibold">谢谢你为创作加速</h3>
              <p className="mt-2 text-sm text-muted-foreground">席位持续更新中，欢迎加入。</p>
            </div>
            <Link
              href="/links"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-foreground text-background text-xs font-semibold hover:opacity-80 transition-opacity"
            >
              进入支持页 <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
            {supporters.map((name, index) => (
              <div key={`${name}-${index}`} className="rounded-2xl border border-card-border bg-background/40 p-3 text-xs text-muted">
                {name}
              </div>
            ))}
          </div>
        </SpotlightCard>
      </section>
    </div>
  );
}
