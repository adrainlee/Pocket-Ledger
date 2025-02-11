import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { ExpenseCategory } from '@prisma/client'

// 验证分类输入
const validateCategoryInput = async (key: string, label: string) => {
  if (!key || !label) {
    throw new Error('分类标识和名称都是必须的')
  }
  if (key.length < 2 || key.length > 10) {
    throw new Error('分类标识长度必须在2-10个字符之间')
  }
  if (!/^[A-Za-z]+$/.test(key)) {
    throw new Error('分类标识只能包含英文字母')
  }
  if (label.length < 2 || label.length > 10) {
    throw new Error('分类名称长度必须在2-10个字符之间')
  }

  // 检查是否已存在该分类（包括内置分类和自定义分类）
  const existingCategories = Object.values(ExpenseCategory)
  if (existingCategories.includes(key as ExpenseCategory)) {
    throw new Error('该分类标识已存在于内置分类中')
  }

  const existingCategory = await prisma.category.findUnique({
    where: { key: key.toUpperCase() },
  })
  if (existingCategory) {
    throw new Error('该分类标识已存在于自定义分类中')
  }
}

// 添加新分类
export async function POST(req: Request) {
  try {
    const { key, label } = await req.json()
    const upperKey = key.toUpperCase()

    // 验证输入
    try {
      await validateCategoryInput(upperKey, label)
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : '输入验证失败' },
        { status: 400 }
      )
    }

    // 添加到数据库并返回创建的分类
    const newCategory = await prisma.category.create({
      data: {
        key: upperKey,
        label,
      },
    })

    return NextResponse.json({
      message: '分类添加成功',
      category: newCategory,
    })
  } catch (error) {
    console.error('添加分类时发生错误:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '处理请求时发生错误' },
      { status: 500 }
    )
  }
}

// 删除分类
export async function DELETE(req: Request) {
  try {
    const { key: rawKey } = await req.json()
    const key = rawKey.toUpperCase()

    // 检查是否是内置分类
    const existingCategories = Object.values(ExpenseCategory)
    if (existingCategories.includes(key as ExpenseCategory)) {
      return NextResponse.json(
        { error: '不能删除内置分类' },
        { status: 400 }
      )
    }

    // 检查分类是否存在
    const category = await prisma.category.findUnique({
      where: { key },
    })

    if (!category) {
      return NextResponse.json(
        { error: '分类不存在' },
        { status: 404 }
      )
    }

    // 删除分类（自定义分类的key不会出现在支出记录中，所以不需要检查使用情况）
    await prisma.category.delete({
      where: { key },
    })

    return NextResponse.json({
      message: '分类删除成功',
    })
  } catch (error) {
    console.error('删除分类时发生错误:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '删除分类时发生错误' },
      { status: 500 }
    )
  }
}
