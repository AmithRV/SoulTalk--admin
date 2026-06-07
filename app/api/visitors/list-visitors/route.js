/* eslint-disable @typescript-eslint/no-unused-vars */
import View from '@/lib/models/View';
import Page from '@/lib/models/Page';
import Visitor from '@/lib/models/Visitor';
import { NextResponse } from 'next/server';
import { formatZodErrors } from '@/lib/utils';
import { databaseConnection } from '@/lib/dbConfig';

await databaseConnection();

export async function GET(request) {
  try {
    //
    const Visitors = await Visitor.aggregate([
      {
        $lookup: {
          from: 'views',
          let: { visitorId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$visitorId', '$$visitorId'],
                },
              },
            },
            {
              $count: 'totalViews',
            },
          ],
          as: 'viewStats',
        },
      },
      {
        $addFields: {
          totalViews: {
            $ifNull: [{ $arrayElemAt: ['$viewStats.totalViews', 0] }, 0],
          },
        },
      },
      {
        $project: {
          viewStats: 0,
        },
      },
      { $sort: { createdAt: -1 } },
    ]);
    return NextResponse.json({ data: Visitors }, { status: 200 });
  } catch (error) {
    if (error.name === 'ZodError') {
      const message = formatZodErrors(error);
      return NextResponse.json({ message }, { status: 422 });
    } else {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
  }
}
