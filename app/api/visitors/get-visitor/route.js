/* eslint-disable @typescript-eslint/no-unused-vars */
import mongoose from 'mongoose';
import View from '@/lib/models/View';
import Page from '@/lib/models/Page';
import Visitor from '@/lib/models/Visitor';
import { NextResponse } from 'next/server';
import { formatZodErrors } from '@/lib/utils';
import { databaseConnection } from '@/lib/dbConfig';

await databaseConnection();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (mongoose.Types.ObjectId.isValid(id)) {
      const visitor = await Visitor.findById(id);

      const views = await View.aggregate([
        {
          $match: {
            visitorId: new mongoose.Types.ObjectId(id),
          },
        },
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

      if (!visitor) {
        return NextResponse.json(
          {
            message: 'visitor not found',
          },
          { status: 404 },
        );
      } else {
        return NextResponse.json(
          { message: 'visitor', data: { visitor, views } },
          { status: 200 },
        );
      }
    }
  } catch (error) {
    if (error.name === 'ZodError') {
      const message = formatZodErrors(error);
      return NextResponse.json({ message }, { status: 422 });
    } else {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
  }
}
