import Link from 'next/link'
import { Home, SearchX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RevealOnScroll } from '@/components/neuro'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center gradient-mesh px-4 relative overflow-hidden">
      {/* NEURO: Mesh blobs */}
      <div className="mesh-blob mesh-blob-1 top-[10%] left-[10%]" />
      <div className="mesh-blob mesh-blob-2 bottom-[20%] right-[10%]" />

      <div className="glass-card p-10 sm:p-14 max-w-lg w-full text-center page-transition relative z-10">
        {/* Large 404 */}
        <p className="text-8xl sm:text-9xl font-extrabold gradient-text leading-none mb-4 select-none">
          404
        </p>

        {/* Icon */}
        <RevealOnScroll delay={0.1}>
          <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-6 shadow-lg shadow-cyan/20">
            <SearchX className="w-7 h-7 text-white" />
          </div>
        </RevealOnScroll>

        {/* Heading */}
        <RevealOnScroll delay={0.2}>
          <h1 className="text-2xl sm:text-3xl font-extrabold gradient-text mb-3">
            Страница не найдена
          </h1>
        </RevealOnScroll>

        {/* Description */}
        <RevealOnScroll delay={0.3}>
          <p className="text-muted-foreground text-sm sm:text-base mb-8 max-w-sm mx-auto leading-relaxed">
            Запрашиваемая страница не существует или была перемещена. Проверьте адрес или вернитесь на главную.
          </p>
        </RevealOnScroll>

        {/* Action */}
        <RevealOnScroll delay={0.4}>
          <Link href="/">
            <Button className="gradient-bg text-white border-0 hover:opacity-90 sweep-btn gap-2 text-base px-8 h-12">
              <Home className="w-5 h-5" />
              На главную
            </Button>
          </Link>
        </RevealOnScroll>
      </div>
    </div>
  )
}
