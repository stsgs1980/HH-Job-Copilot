import Link from 'next/link'
import { Home, SearchX } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center gradient-mesh px-4">
      <div className="glass-card p-10 sm:p-14 max-w-lg w-full text-center page-transition">
        {/* Large 404 */}
        <p className="text-8xl sm:text-9xl font-black gradient-text leading-none mb-4 select-none">
          404
        </p>

        {/* Icon */}
        <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-6">
          <SearchX className="w-7 h-7 text-white" />
        </div>

        {/* Heading */}
        <h1 className="text-2xl sm:text-3xl font-bold gradient-text mb-3">
          Страница не найдена
        </h1>

        {/* Description */}
        <p className="text-muted-foreground text-sm sm:text-base mb-8 max-w-sm mx-auto">
          Запрашиваемая страница не существует или была перемещена. Проверьте адрес или вернитесь на главную.
        </p>

        {/* Action */}
        <Link href="/">
          <Button className="gradient-bg text-white border-0 hover:opacity-90 gap-2 text-base px-8 h-12">
            <Home className="w-5 h-5" />
            На главную
          </Button>
        </Link>
      </div>
    </div>
  )
}
