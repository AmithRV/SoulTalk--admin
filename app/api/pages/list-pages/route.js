/* eslint-disable @typescript-eslint/no-unused-vars */
import Page from '@/lib/models/Page';
import { NextResponse } from 'next/server';
import { formatZodErrors } from '@/lib/utils';
import { databaseConnection } from '@/lib/dbConfig';

await databaseConnection();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Use aggregation to join the comments
    const pages = await Page.aggregate([
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'page',
          as: 'comments',
        },
      },
    ]);
    return NextResponse.json({ data: pages }, { status: 200 });
  } catch (error) {
    if (error.name === 'ZodError') {
      const message = formatZodErrors(error);
      return NextResponse.json({ message }, { status: 422 });
    } else {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
  }
}
