'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authToken, pharmacistDrugsApi, pharmacistStockApi } from '@/lib/api/api'
import type { DrugDto } from '@/lib/api/api'
import { useToast } from '@/components/ui/toast/useToast'
import { DatabaseHeader } from '@/components/pharmacy/database/DatabaseHeader'
import { DrugsTable } from '@/components/pharmacy/database/DrugsTable'
import { DrugPreview } from '@/components/pharmacy/database/DrugPreview'
import { AddToStockModal } from '@/components/pharmacy/database/AddToStockModal'
import { PageSkeleton } from '@/components/pharmacy/shared/PageSkeleton'
import { SectionCard } from '@/components/pharmacy/shared/SectionCard'
import { AlertTriangle } from 'lucide-react'

type ViewState = 'loading' | 'ready' | 'error'

export default function DatabasePage() {
  const router = useRouter()
  const { showToast } = useToast()
  const once = useRef(false)

  const [state, setState] = useState<ViewState>('loading')
  const [drugs, setDrugs] = useState<DrugDto[]>([])
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<DrugDto | null>(null)

  const [addOpen, setAddOpen] = useState(false)
  const [addDrug, setAddDrug] = useState<DrugDto | null>(null)

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return drugs
    return drugs.filter((d) => d.name.toLowerCase().includes(q) || d.strength.toLowerCase().includes(q))
  }, [drugs, query])

  const load = async () => {
    setState('loading')

    const res = query.trim()
      ? await pharmacistDrugsApi.searchByName(query)
      : await pharmacistDrugsApi.getAll()

    if (!res.success) {
      setState('error')

      if (!once.current) {
        showToast(res.error, 'error')
        once.current = true
      }

      const msg = (res.error || '').toLowerCase()
      if (msg.includes('unauthorized') || msg.includes('invalid token') || msg.includes('token')) {
        authToken.remove()
        router.replace('/login')
      }
      return
    }

    setDrugs(res.data)
    setState('ready')
  }

  // initial load
  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // debounce search
  useEffect(() => {
    const t = window.setTimeout(() => {
      load()
    }, 350)
    return () => window.clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  const handleAddToStock = (drug: DrugDto) => {
    setAddDrug(drug)
    setAddOpen(true)
  }

  const confirmAdd = async (drugId: number, quantity: number) => {
    const res = await pharmacistStockApi.addDrug({drugId, quantity})
    if (!res.success) {
      showToast(res.error, 'error')
      return
    }
    showToast('تمت إضافة الدواء إلى المخزون', 'success')
    setAddOpen(false)
    setAddDrug(null)
  }

  if (state === 'loading') return <PageSkeleton title="قاعدة الأدوية" />

  if (state === 'error') {
    return (
      <div className="space-y-6 page-animate">
        <DatabaseHeader query={query} onQueryChange={setQuery} onRefresh={load} />
        <SectionCard title="تعذر تحميل قاعدة الأدوية" icon={AlertTriangle} description="تحقق من endpoint /drugs في الباك اند ثم أعد المحاولة.">
          <button
            onClick={load}
            className="mt-3 inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm text-white transition hover:opacity-90"
          >
            إعادة المحاولة
          </button>
        </SectionCard>
      </div>
    )
  }

  return (
    <div className="space-y-6 page-animate">
      <DatabaseHeader query={query} onQueryChange={setQuery} onRefresh={load} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <DrugsTable
            drugs={visible}
            selectedId={selected?.id ?? null}
            onSelect={setSelected}
            onAddToStock={handleAddToStock}
          />
        </div>

        <div className="lg:col-span-1">
          <DrugPreview drug={selected} />
        </div>
      </div>

      <AddToStockModal
        open={addOpen}
        drug={addDrug}
        onClose={() => {
          setAddOpen(false)
          setAddDrug(null)
        }}
        onConfirm={confirmAdd}
      />
    </div>
  )
}
