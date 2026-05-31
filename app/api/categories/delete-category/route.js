import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import Category from '@/lib/models/Category';
import { formatZodErrors } from '@/lib/utils';
import { databaseConnection } from '@/lib/dbConfig';

await databaseConnection();

export async function DELETE(request) {
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
        const deleted = await Category.findByIdAndDelete(id);

        return NextResponse.json(
          { message: 'Category deleted', category: deleted },
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
