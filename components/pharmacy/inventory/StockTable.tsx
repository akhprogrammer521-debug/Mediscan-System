'use client'

import { useMemo, useState } from 'react'
import type { PharmacyStockItem } from '@/lib/api/api'
import { SectionCard } from '@/components/pharmacy/shared/SectionCard'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Pill, Trash2, Save, X, Edit3 } from 'lucide-react'
import { StatusBadge } from '@/components/pharmacy/shared/StatusBadge'

type Props = {
  items: PharmacyStockItem[]
  onUpdate: (
    stockId: number,
    qty: number,
    price: number
  ) => Promise<void> | void
  onRemove: (stockId: number) => Promise<void> | void
}

type EditState = {
  id: number
  qty: string
  price: string
}

type StockStatus = 'active' | 'inactive'

function getStockStatus(qty: number): StockStatus {
  return qty === 0 ? 'inactive' : 'active'
}

export function StockTable({ items, onUpdate, onRemove }: Props) {
  const [edit, setEdit] = useState<EditState | null>(null)

  const sorted = useMemo(() => {
    return [...items].sort((a, b) => {
      const sa = getStockStatus(a.quantity)
      const sb = getStockStatus(b.quantity)
      return sa === sb ? 0 : sa === 'inactive' ? -1 : 1
    })
  }, [items])

  return (
    <SectionCard
      title="قائمة المخزون"
      description="إدارة الكميات والأسعار"
      icon={Pill}
      className="page-animate"
    >
      {sorted.length === 0 ? (
        <p className="text-sm text-muted">لا يوجد عناصر في المخزون حاليًا.</p>
      ) : (
        <>
          {/* ================= MOBILE VIEW ================= */}
          <div className="space-y-3 sm:hidden">
            {sorted.map((it) => {
              const status = getStockStatus(it.quantity)
              const isEditing = edit?.id === it.id

              return (
                <div
                  key={it.id}
                  className="rounded-xl border bg-white p-3 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-medium">
                        {it.drug?.name ?? it.customDrug?.name ?? '—'}
                      </div>
                      <div className="text-xs text-muted">
                        {it.drug?.strength ?? it.customDrug?.strength ?? ''}
                      </div>
                    </div>

                    <StatusBadge status={status} />
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-2">
                    {isEditing ? (
                      <div className="flex gap-2">
                        <Input
                          value={edit.qty}
                          onChange={(e) =>
                            setEdit({ ...edit, qty: e.target.value })
                          }
                          className="w-20"
                          inputMode="numeric"
                          placeholder="الكمية"
                        />
                        <Input
                          value={edit.price}
                          onChange={(e) =>
                            setEdit({ ...edit, price: e.target.value })
                          }
                          className="w-24"
                          inputMode="numeric"
                          placeholder="السعر"
                        />
                      </div>
                    ) : (
                      <span className="text-sm">
                        الكمية: <b>{it.quantity}</b> — السعر:{' '}
                        <b>{it.price}</b>
                      </span>
                    )}

                    <div className="flex gap-2">
                      {!isEditing ? (
                        <Button
                          size="sm"
                          variant="soft"
                          onClick={() =>
                            setEdit({
                              id: it.id,
                              qty: String(it.quantity),
                              price: String(it.price),
                            })
                          }
                        >
                          <Edit3 size={14} />
                        </Button>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={async () => {
                              const qty = Number(edit.qty)
                              const price = Number(edit.price)
                              if (!Number.isFinite(qty) || qty < 0) return
                              if (!Number.isFinite(price) || price < 0) return
                              await onUpdate(it.id, qty, price)
                              setEdit(null)
                            }}
                          >
                            <Save size={14} />
                          </Button>

                          <Button
                            size="sm"
                            variant="soft"
                            onClick={() => setEdit(null)}
                          >
                            <X size={14} />
                          </Button>
                        </>
                      )}

                      <Button
                        size="sm"
                        variant="soft"
                        onClick={() => onRemove(it.id)}
                        title="حذف من المخزون"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* ================= DESKTOP VIEW ================= */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-muted">
                <tr className="border-b">
                  <th className="py-3 text-right font-medium">الدواء</th>
                  <th className="py-3 text-right font-medium">العيار</th>
                  <th className="py-3 text-right font-medium">السعر</th>
                  <th className="py-3 text-right font-medium">الحالة</th>
                  <th className="py-3 text-right font-medium">الكمية</th>
                  <th className="py-3 text-right font-medium">إجراءات</th>
                </tr>
              </thead>

              <tbody>
                {sorted.map((it) => {
                  const status = getStockStatus(it.quantity)
                  const isEditing = edit?.id === it.id

                  return (
                    <tr
                      key={it.id}
                      className="border-b last:border-0 hover:bg-subtle/40 transition"
                    >
                      <td className="py-3">
                        <div className="font-medium">
                          {it.drug?.name ?? it.customDrug?.name ?? '—'}
                        </div>
                        <div className="text-xs text-muted line-clamp-1">
                          {it.drug?.description ?? it.customDrug?.notes ?? '—'}
                        </div>
                      </td>

                      <td className="py-3 text-muted">
                        {it.drug?.strength ?? it.customDrug?.strength ?? ''}
                      </td>

                      <td className="py-3">
                        {isEditing ? (
                          <Input
                            value={edit.price}
                            onChange={(e) =>
                              setEdit({ ...edit, price: e.target.value })
                            }
                            className="w-28"
                            inputMode="numeric"
                          />
                        ) : (
                          <span className="font-semibold">
                            {it.price} ل.س
                          </span>
                        )}
                      </td>

                      <td className="py-3">
                        <StatusBadge status={status} />
                      </td>

                      <td className="py-3">
                        {isEditing ? (
                          <Input
                            value={edit.qty}
                            onChange={(e) =>
                              setEdit({ ...edit, qty: e.target.value })
                            }
                            className="w-24"
                            inputMode="numeric"
                          />
                        ) : (
                          <span className="font-semibold">
                            {it.quantity}
                          </span>
                        )}
                      </td>

                      <td className="py-3">
                        <div className="flex gap-2">
                          {!isEditing ? (
                            <Button
                              variant="soft"
                              onClick={() =>
                                setEdit({
                                  id: it.id,
                                  qty: String(it.quantity),
                                  price: String(it.price),
                                })
                              }
                            >
                              تعديل
                            </Button>
                          ) : (
                            <>
                              <Button
                                variant="primary"
                                onClick={async () => {
                                  const qty = Number(edit.qty)
                                  const price = Number(edit.price)
                                  if (!Number.isFinite(qty) || qty < 0) return
                                  if (!Number.isFinite(price) || price < 0) return
                                  await onUpdate(it.id, qty, price)
                                  setEdit(null)
                                }}
                              >
                                حفظ
                              </Button>

                              <Button
                                variant="soft"
                                onClick={() => setEdit(null)}
                              >
                                إلغاء
                              </Button>
                            </>
                          )}

                          <Button
                            variant="soft"
                            onClick={() => onRemove(it.id)}
                            title="حذف من المخزون"
                          >
                            حذف
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </SectionCard>
  )
}
