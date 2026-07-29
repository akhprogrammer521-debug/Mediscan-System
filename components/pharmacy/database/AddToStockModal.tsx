'use client'

import { useMemo, useState } from 'react'
import type { DrugDto } from '@/lib/api/api'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { PackagePlus, X } from 'lucide-react'

type Props = {
    open: boolean
    drug: DrugDto | null
    onClose: () => void
    onConfirm: (drugId: number, quantity: number) => void | Promise<void>
}

export function AddToStockModal({ open, drug, onClose, onConfirm }: Props) {
    const [qty, setQty] = useState(() => (open ? '1' : '1'))

    const valid = useMemo(() => {
        const n = Number(qty)
        return Number.isFinite(n) && n > 0
    }, [qty])

    if (!open || !drug) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />

            <div className="relative w-full max-w-md rounded-2xl bg-bg shadow-lg border border-border/60 p-5 animate-[fadeIn_.18s_ease-out]">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <PackagePlus size={18} className="text-primary" />
                        <h3 className="font-semibold">إضافة إلى المخزون</h3>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl p-2 hover:bg-subtle/50 transition"
                        aria-label="Close"
                    >
                        <X size={18} />
                    </button>
                </div>

                <p className="mt-2 text-sm text-muted">
                    الدواء: <span className="font-medium text-text">{drug.name}</span> — {drug.strength}
                </p>

                <div className="mt-4">
                    <label className="text-xs text-muted">الكمية</label>
                    <Input
                        value={qty}
                        onChange={(e) => setQty(e.target.value)}
                        inputMode="numeric"
                        className="mt-1 bg-subtle"
                        placeholder="مثال: 10"
                    />
                </div>

                <div className="mt-5 flex gap-2">
                    <Button
                        variant="primary"
                        className="w-full gap-2"
                        disabled={!valid}
                        onClick={() => onConfirm(drug.id, Number(qty))}
                    >
                        <PackagePlus size={18} />
                        إضافة
                    </Button>

                    <Button variant="soft" className="w-full" onClick={onClose}>
                        إلغاء
                    </Button>
                </div>
            </div>
        </div>
    )
}
