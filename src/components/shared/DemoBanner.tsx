import { RotateCcw } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useDemoSessionStore } from '@/stores/demo-session-store'

export function DemoBanner() {
  const resetDemoData = useDemoSessionStore((s) => s.resetDemoData)

  return (
    <div className="sticky top-0 z-50 border-b border-amber-200/80 bg-amber-50/95 px-3 py-1.5 text-amber-950 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2">
        <p className="text-xs sm:text-sm">
          Offline demo — no sign-in. Orders, chat, and history stay in this
          browser. Use the portal switcher to flip Customer / Vendor / LGU.
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 shrink-0 border-amber-300 bg-white/70 text-xs text-amber-950 hover:bg-white"
          onClick={() => {
            resetDemoData()
            toast.success('Demo data reset.')
          }}
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset demo
        </Button>
      </div>
    </div>
  )
}
