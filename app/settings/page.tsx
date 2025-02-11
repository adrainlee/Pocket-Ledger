'use client'

import { useState, FormEvent } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/Card'
import { Button } from '@/shared/components/ui/Button'
import { useCategories } from '@/modules/expense/hooks/useCategories'
import { CategoryItem, CATEGORY_LABELS } from '@/modules/expense/types'

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const { categories, isLoading: isLoadingCategories, fetchCategories } = useCategories()
  const [newCategory, setNewCategory] = useState({ key: '', label: '' })
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [deletingCategoryKey, setDeletingCategoryKey] = useState<string | null>(null)

  // 清除所有数据
  const handleClearData = async () => {
    if (!window.confirm('确定要清除所有数据吗?此操作不可恢复!')) {
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/settings', {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('清除数据失败')
      }

      window.alert('数据已成功清除')
    } catch (error) {
      console.error('清除数据时发生错误:', error)
      window.alert('清除数据时发生错误')
    } finally {
      setIsLoading(false)
    }
  }

  // 验证分类输入
  const validateCategoryInput = (key: string, label: string) => {
    if (key.length < 2 || key.length > 10) {
      throw new Error('分类标识长度必须在2-10个字符之间')
    }
    if (!/^[A-Za-z]+$/.test(key)) {
      throw new Error('分类标识只能包含英文字母')
    }
    if (label.length < 2 || label.length > 10) {
      throw new Error('分类名称长度必须在2-10个字符之间')
    }
  }

  // 添加新分类
  const handleAddCategory = async (e: FormEvent) => {
    e.preventDefault()

    const key = newCategory.key.trim()
    const label = newCategory.label.trim()

    try {
      validateCategoryInput(key, label)
    } catch (error) {
      window.alert((error as Error).message)
      return
    }

    // 转换key为大写
    const upperKey = key.toUpperCase()

    setIsAddingCategory(true)
    try {
      const response = await fetch('/api/settings/category', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: upperKey,
          label,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || '添加分类失败')
      }

      // 重置表单
      setNewCategory({ key: '', label: '' })
      window.alert('分类添加成功')
    } catch (error) {
      console.error('添加分类时发生错误:', error)
      window.alert(error instanceof Error ? error.message : '添加分类时发生错误')
    } finally {
      setIsAddingCategory(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">设置</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>数据管理</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            variant="secondary"
            onClick={handleClearData}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isLoading ? '清除中...' : '清除所有数据'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>支出分类</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    分类标识
                    <span className="text-xs text-foreground/60 ml-1">(英文字母)</span>
                  </label>
                  <input
                    type="text"
                    value={newCategory.key}
                    onChange={(e) =>
                      setNewCategory((prev) => ({ ...prev, key: e.target.value }))
                    }
                    placeholder="例如: PHONE"
                    className="w-full rounded border p-2"
                    maxLength={10}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    分类名称
                    <span className="text-xs text-foreground/60 ml-1">(中文名称)</span>
                  </label>
                  <input
                    type="text"
                    value={newCategory.label}
                    onChange={(e) =>
                      setNewCategory((prev) => ({ ...prev, label: e.target.value }))
                    }
                    placeholder="例如: 手机数码"
                    className="w-full rounded border p-2"
                    maxLength={10}
                  />
                </div>
              </div>
              <Button
                type="submit"
                disabled={isAddingCategory}
                variant="primary"
                fullWidth
              >
                {isAddingCategory ? '添加中...' : '添加新分类'}
              </Button>
            </form>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">现有分类</h3>
                {isLoadingCategories && <span className="text-sm text-foreground/60">加载中...</span>}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {categories.length === 0 ? (
                  <div className="col-span-2 text-center text-foreground/60 py-4">
                    {isLoadingCategories ? "正在加载分类..." : "暂无分类"}
                  </div>
                ) : (
                  categories.map((category: CategoryItem) => (
                    <div
                      key={category.key}
                      className="p-2 rounded bg-foreground/5 flex items-center justify-between"
                      title={`标识: ${category.key}`}
                    >
                      <span>{category.label}</span>
                      {!Object.keys(CATEGORY_LABELS).includes(category.key) && (
                        <button
                          onClick={async () => {
                            if (window.confirm(`确定要删除分类"${category.label}"吗？此操作不可恢复！`)) {
                              try {
                                setDeletingCategoryKey(category.key)
                                const response = await fetch('/api/settings/category', {
                                  method: 'DELETE',
                                  headers: {
                                    'Content-Type': 'application/json',
                                  },
                                  body: JSON.stringify({ key: category.key }),
                                })

                                if (!response.ok) {
                                  const data = await response.json()
                                  throw new Error(data.error || '删除分类失败')
                                }

                                window.alert('分类删除成功')
                                await fetchCategories() // 刷新分类列表
                              } catch (error) {
                                console.error('删除分类时发生错误:', error)
                                window.alert(error instanceof Error ? error.message : '删除分类时发生错误')
                              } finally {
                                setDeletingCategoryKey(null)
                              }
                            }
                          }}
                          className="px-2 py-1 text-sm rounded bg-red-100 text-red-600 hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed ml-2"
                          disabled={deletingCategoryKey === category.key}
                        >
                          {deletingCategoryKey === category.key ? '删除中...' : '删除'}
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>关于</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p>个人记账应用 v1.0.0</p>
            <p className="text-sm text-foreground/60">
              一个简洁实用的个人记账应用,专注于支出记录和统计功能。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
