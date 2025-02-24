import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { startOfMonth, endOfMonth } from 'date-fns'
import { Prisma } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { BUILTIN_CATEGORIES } from '@/modules/expense/types'

const isValidCategory = async (category: string): Promise<boolean> => {
  // 检查是否是内置分类
  if (category in BUILTIN_CATEGORIES) {
    return true
  }

  // 检查是否是自定义分类
  const customCategory = await prisma.category.findUnique({
    where: { key: category }
  })

  return !!customCategory
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const dateStr = searchParams.get('date')

    if (!dateStr) {
      return NextResponse.json({ error: '日期参数必填' }, { status: 400 })
    }

    const date = new Date(dateStr)
    const start = startOfMonth(date)
    const end = endOfMonth(date)

    const expenses = await prisma.expense.findMany({
      where: {
        date: {
          gte: start,
          lte: end,
        },
      },
      orderBy: {
        date: 'desc',
      },
    })

    return NextResponse.json(expenses)
  } catch (error) {
    console.error('获取支出记录失败:', error)
    return NextResponse.json({ error: '获取支出记录失败' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    if (!(await isValidCategory(data.category))) {
      return NextResponse.json(
        { error: '无效的支出分类' },
        { status: 400 }
      )
    }

    const expense = await prisma.expense.create({
      data: {
        amount: new Prisma.Decimal(data.amount),
        category: data.category,
        date: new Date(data.date),
        note: data.note || null,
      },
    })

    revalidatePath('/bills')
    revalidatePath('/')
    return NextResponse.json(expense)
  } catch (error) {
    console.error('创建支出记录失败:', error)
    return NextResponse.json({ error: '创建支出记录失败' }, { status: 500 })
  }
}
