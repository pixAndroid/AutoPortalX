import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/lib/middleware'
import { generateStorageKey, saveFile, deleteFile } from '@/lib/storage'

export async function GET(req: NextRequest) {
  return withAuth(req, async (ctx) => {
    if (!ctx.companyId) return NextResponse.json({ error: 'No company' }, { status: 400 })
    const { searchParams } = new URL(req.url)
    const page = Number(searchParams.get('page') || '1')
    const pageSize = Number(searchParams.get('pageSize') || '20')
    const [files, total] = await Promise.all([
      prisma.fileAsset.findMany({
        where: { companyId: ctx.companyId },
        include: { jobRun: { select: { id: true, workflow: { select: { name: true } } } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.fileAsset.count({ where: { companyId: ctx.companyId } }),
    ])
    return NextResponse.json({ files, total, page, pageSize, totalPages: Math.ceil(total / pageSize) })
  })
}

export async function POST(req: NextRequest) {
  return withAuth(req, async (ctx) => {
    if (!ctx.companyId) return NextResponse.json({ error: 'No company' }, { status: 400 })
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const storageKey = generateStorageKey(file.name, ctx.companyId)
    await saveFile(buffer, storageKey)

    const asset = await prisma.fileAsset.create({
      data: {
        companyId: ctx.companyId,
        filename: storageKey.split('/').pop() || file.name,
        originalName: file.name,
        mimeType: file.type,
        size: buffer.length,
        storageKey,
      },
    })
    return NextResponse.json({ file: asset }, { status: 201 })
  })
}

export async function DELETE(req: NextRequest) {
  return withAuth(req, async (ctx) => {
    if (!ctx.companyId) return NextResponse.json({ error: 'No company' }, { status: 400 })
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })
    const asset = await prisma.fileAsset.findFirst({ where: { id, companyId: ctx.companyId } })
    if (!asset) return NextResponse.json({ error: 'File not found' }, { status: 404 })
    await deleteFile(asset.storageKey).catch(console.error)
    await prisma.fileAsset.delete({ where: { id } })
    return NextResponse.json({ message: 'File deleted' })
  })
}
