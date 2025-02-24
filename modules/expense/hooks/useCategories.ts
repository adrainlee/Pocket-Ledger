'use client'

import { useState, useEffect, useCallback } from 'react'
import { CategoryItem } from '../types'
import { CATEGORY_LABELS } from '../types'
import { ExpenseCategory } from '@prisma/client'

// 将内置分类转换为 CategoryItem 格式
const builtInCategories: CategoryItem[] = Object.entries(CATEGORY_LABELS).map(([key, label]) => ({
    key: key as ExpenseCategory,
    label,
}))

export const useCategories = () => {
    const [categories, setCategories] = useState<CategoryItem[]>(builtInCategories)
    const [isLoading, setIsLoading] = useState(true)

    const fetchCategories = useCallback(async () => {
        setIsLoading(true)
        try {
            const response = await fetch('/api/settings')
            if (!response.ok) {
                throw new Error('获取分类列表失败')
            }
            const data = await response.json()

            // 确保新的自定义分类被正确合并
            const updatedCategories = [
                ...builtInCategories,
                ...data.filter((item: CategoryItem) =>
                    !builtInCategories.some(builtin => builtin.key === item.key)
                )
            ]
            setCategories(updatedCategories)
        } catch (error) {
            console.error('获取分类列表时发生错误:', error)
            // 如果获取失败，至少保留内置分类
            setCategories(builtInCategories)
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchCategories()
    }, [fetchCategories])

    return { categories, isLoading, fetchCategories }
}