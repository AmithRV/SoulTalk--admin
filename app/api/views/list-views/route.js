/* eslint-disable @typescript-eslint/no-unused-vars */
import View from '@/lib/models/View';
import Page from '@/lib/models/Page';
import { NextResponse } from 'next/server';
import { formatZodErrors } from '@/lib/utils';
import { databaseConnection } from '@/lib/dbConfig';

await databaseConnection();

export async function GET(request) {
  try {
    //
    const views = await View.aggregate([
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: 'pages',
          localField: 'pageId',
          foreignField: '_id',
          as: 'page',
        },
      },
      {
        $unwind: {
          path: '$page',
          preserveNullAndEmptyArrays: true, // optional
        },
      },
    ]);

    return NextResponse.json({ data: views }, { status: 200 });
  } catch (error) {
    if (error.name === 'ZodError') {
      const message = formatZodErrors(error);
      return NextResponse.json({ message }, { status: 422 });
    } else {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
  }
}
