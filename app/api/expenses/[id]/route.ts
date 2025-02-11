import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const expenseId = parseInt(id)
    const data = await request.json()

    const expense = await prisma.expense.update({
      where: { id: expenseId },
      data: {
        amount: data.amount,
        category: data.category,
        date: new Date(data.date),
        note: data.note || null,
      },
    })

    revalidatePath('/bills')
    return NextResponse.json(expense)
  } catch (error) {
    console.error('更新支出失败:', error)
    return NextResponse.json({ error: '更新支出失败' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const expenseId = parseInt(id)
    await prisma.expense.delete({
      where: { id: expenseId },
    })

    revalidatePath('/bills')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('删除支出失败:', error)
    return NextResponse.json({ error: '删除支出失败' }, { status: 500 })
  }
}
