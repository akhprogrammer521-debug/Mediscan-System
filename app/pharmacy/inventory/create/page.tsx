'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { pharmacistStockApi } from '@/lib/api/api'
import { useToast } from '@/components/ui/toast/useToast'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { SectionCard } from '@/components/pharmacy/shared/SectionCard'

export default function AddToStockPage() {
  const router = useRouter()
  const { showToast } = useToast()

  const [name, setName] = useState('')
  const [strength, setStrength] = useState('')
  const [price, setPrice] = useState('')
  const [qty, setQty] = useState('1')
  const [notes, setNotes] = useState('')

  const submit = async () => {
    const res = await pharmacistStockApi.addDrug({
      customDrug: {
        name,
        strength: strength || undefined,
        price: Number(price),
        notes: notes || undefined,
      },
      quantity: Number(qty),
    })

    if (!res.success) {
      showToast(res.error, 'error')
      return
    }

    showToast('تمت إضافة الدواء إلى المخزون', 'success')
    router.push('/pharmacy/inventory')
  }

  return (
    <SectionCard title="إضافة دواء للمخزون">
      <div className="space-y-3">
        <Input placeholder="اسم الدواء" value={name} onChange={(e) => setName(e.target.value)} />
        <Input placeholder="العيار" value={strength} onChange={(e) => setStrength(e.target.value)} />
        <Input placeholder="السعر" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
        <Input placeholder="الكمية" type="number" value={qty} onChange={(e) => setQty(e.target.value)} />
        <Input placeholder="ملاحظات" value={notes} onChange={(e) => setNotes(e.target.value)} />

        <Button onClick={submit}>إضافة</Button>
      </div>
    </SectionCard>
  )
}
