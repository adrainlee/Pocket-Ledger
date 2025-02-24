'use client'

import { useState, useEffect } from 'react'
import { CATEGORY_LABELS } from '../types'

export const useCategoryLabels = () => {
    const [categoryLabels, setCategoryLabels] = useState<Record<string, string>>(CATEGORY_LABELS)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchCategoryLabels = async () => {
            try {
                const response = await fetch('/api/settings')
                if (!response.ok) {
                    throw new Error('获取分类列表失败')
                }
                const customCategories = await response.json()

                // 合并内置分类和自定义分类的标签
                const labels = { ...CATEGORY_LABELS }
                customCategories.forEach((category: { key: string; label: string }) => {
                    labels[category.key] = category.label
                })

                setCategoryLabels(labels)
            } catch (error) {
                console.error('获取分类列表时发生错误:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchCategoryLabels()
    }, [])

    return { categoryLabels, isLoading }
}