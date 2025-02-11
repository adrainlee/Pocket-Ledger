import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'
import { CATEGORY_LABELS } from '@/modules/expense/types'

// 清除所有数据
export async function DELETE() {
  try {
    await prisma.expense.deleteMany()
    return NextResponse.json({ message: '数据已成功清除' })
  } catch (error) {
    console.error('清除数据时发生错误:', error)
    return NextResponse.json({ error: '清除数据时发生错误' }, { status: 500 })
  }
}

// 获取所有分类
export async function GET() {
  try {
    // 获取内置分类
    const builtInCategories = Object.entries(CATEGORY_LABELS).map(([key, label]) => ({
      key,
      label,
    }))

    // 获取自定义分类
    const userCategories = await prisma.category.findMany({
      select: {
        key: true,
        label: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    // 合并内置分类和自定义分类
    const allCategories = [...builtInCategories, ...userCategories]
    return NextResponse.json(allCategories)
  } catch (error) {
    console.error('获取分类列表时发生错误:', error)
    return NextResponse.json({ error: '获取分类列表时发生错误' }, { status: 500 })
  }
}
