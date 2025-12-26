"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { listLibrary, removeFromLibrary, type LibraryItem } from "@/lib/uploads"
import { Trash2, Loader2 } from "lucide-react"

interface MediaLibraryProps {
  userId: string
  type?: "image" | "logo"
  multiple?: boolean
  maxSelect?: number
  onConfirm: (items: LibraryItem[]) => void
  onCancel: () => void
}

export function MediaLibrary({ userId, type, multiple = true, maxSelect = 5, onConfirm, onCancel }: MediaLibraryProps) {
  const [search, setSearch] = useState("")
  const [items, setItems] = useState<LibraryItem[]>([])
  const [selected, setSelected] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState(false)

  const loadItems = async () => {
    setIsLoading(true)
    try {
      const data = await listLibrary(userId, type)
      setItems(data)
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadItems()
  }, [userId, type])

  const filtered = useMemo(() => {
    if (!search.trim()) return items
    return items.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()))
  }, [items, search])

  const selectedCount = useMemo(() => Object.values(selected).filter(Boolean).length, [selected])

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = { ...prev }
      if (multiple) {
        if (next[id]) {
          delete next[id]
        } else {
          if (selectedCount < maxSelect) next[id] = true
        }
      } else {
        // single-select
        return { [id]: true }
      }
      return next
    })
  }

  const confirm = () => {
    const result = filtered.filter((i) => selected[i.id])
    onConfirm(result.slice(0, maxSelect))
  }

  const handleRemove = async (id: string) => {
    if (!globalThis.confirm("Delete this item?")) return
    setIsLoading(true)
    await removeFromLibrary(userId, id)
    // optimistic update or reload
    await loadItems()

    setSelected((prev) => {
      const n = { ...prev }
      delete n[id]
      return n
    })
    setIsLoading(false)
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-col gap-2">
        <CardTitle className="text-card-foreground">Media Library</CardTitle>
        <div className="flex items-center gap-3">
          <Input
            placeholder="Search media..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-input border-border"
          />
          <Badge variant="secondary">{filtered.length} items</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[420px] pr-2">
          {isLoading && items.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-muted-foreground text-sm">No media found.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filtered.map((item) => {
                const isSelected = !!selected[item.id]
                return (
                  <div key={item.id} className="relative group">
                    <button
                      type="button"
                      onClick={() => toggleSelect(item.id)}
                      className={`block w-full aspect-square rounded-lg overflow-hidden border ${isSelected ? "border-primary ring-2 ring-primary/40" : "border-border"
                        }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.dataUrl || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </button>
                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-xs text-muted-foreground truncate max-w-[120px]">{item.name}</p>
                      <Badge variant="outline" className="text-[10px] uppercase">
                        {item.type}
                      </Badge>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(item.id)
                      }}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 hover:bg-black/70 text-white rounded p-1"
                      title="Remove from library"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </ScrollArea>

        <div className="mt-6 flex items-center justify-end gap-3">
          <Button variant="outline" className="bg-transparent" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={confirm} disabled={selectedCount === 0 || isLoading}>
            Use Selected {selectedCount > 0 ? `(${selectedCount})` : ""}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
