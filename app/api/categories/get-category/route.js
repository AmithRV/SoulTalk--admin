import mongoose from 'mongoose';
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

      if (!category) {
        return NextResponse.json(
          {
            message: 'category not found',
          },
          { status: 404 },
        );
      } else {
        return NextResponse.json(
          { message: 'category', data: { category } },
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
