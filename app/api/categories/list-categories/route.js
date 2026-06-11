import { NextResponse } from 'next/server';
import Category from '@/lib/models/Category';
import { formatZodErrors } from '@/lib/utils';
import { databaseConnection } from '@/lib/dbConfig';

await databaseConnection();

export async function GET() {
  try {
    const categories = await Category.aggregate([
      {
        $lookup: {
          from: 'pages',
          localField: '_id',
          foreignField: 'categoryId',
          as: 'totalPages',
        },
      },
      {
        $addFields: {
          pages: {
            $size: {
              $ifNull: ['$totalPages', []],
            },
          },
        },
      },
      {
        $project: {
          totalPages: 0,
        },
      },
      { $sort: { createdAt: -1 } },
    ]);
    return NextResponse.json({ data: categories }, { status: 200 });
  } catch (error) {
    if (error.name === 'ZodError') {
      const message = formatZodErrors(error);
      return NextResponse.json({ message }, { status: 422 });
    } else {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
  }
}
