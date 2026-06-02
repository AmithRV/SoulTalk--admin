/* eslint-disable @typescript-eslint/no-unused-vars */
import Page from '@/lib/models/Page';
import Comment from '@/lib/models/Comment';
import { NextResponse } from 'next/server';
import { formatZodErrors } from '@/lib/utils';
import { databaseConnection } from '@/lib/dbConfig';

await databaseConnection();

export async function GET(request) {
  //
  try {
    const { searchParams } = new URL(request.url);
    const pageId = searchParams.get('pageId');

    const comments = await Comment.find({ page: pageId })
      .populate('page')
      .sort({ createdAt: -1 });

    return NextResponse.json({ data: comments }, { status: 200 });
  } catch (error) {
    if (error.name === 'ZodError') {
      const message = formatZodErrors(error);
      return NextResponse.json({ message }, { status: 422 });
    } else {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
  }
}
