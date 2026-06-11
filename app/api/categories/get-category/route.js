import mongoose from 'mongoose';
import Page from '@/lib/models/Page';
import { NextResponse } from 'next/server';
import Category from '@/lib/models/Category';
import { formatZodErrors } from '@/lib/utils';
import { databaseConnection } from '@/lib/dbConfig';

await databaseConnection();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (mongoose.Types.ObjectId.isValid(id)) {
      const category = await Category.findById(id);

      // Build the query dynamically
      const query = {};

      if (id) {
        // Optional: Check if valid to prevent CastErrors on malformed IDs
        if (!mongoose.Types.ObjectId.isValid(id)) {
          return NextResponse.json(
            { message: 'Invalid pageId format' },
            { status: 400 },
          );
        }
        query.categoryId = new mongoose.Types.ObjectId(id);
      }

      const pages = await Page.find(query).sort({ createdAt: -1 });

      if (!category) {
        return NextResponse.json(
          {
            message: 'category not found',
          },
          { status: 404 },
        );
      } else {
        return NextResponse.json(
          { message: 'category', data: { category, pages } },
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
