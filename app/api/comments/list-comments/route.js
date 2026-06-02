/* eslint-disable @typescript-eslint/no-unused-vars */

import mongoose from 'mongoose';
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

    // Build the query dynamically
    const query = {};

    if (pageId) {
      // Optional: Check if valid to prevent CastErrors on malformed IDs
      if (!mongoose.Types.ObjectId.isValid(pageId)) {
        return NextResponse.json(
          { message: 'Invalid pageId format' },
          { status: 400 },
        );
      }
      query.page = pageId;
    }

    const comments = await Comment.find(query)
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
