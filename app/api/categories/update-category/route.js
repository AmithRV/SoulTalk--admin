import { NextResponse } from 'next/server';
import Category from '@/lib/models/Category';
import { formatZodErrors } from '@/lib/utils';
import { databaseConnection } from '@/lib/dbConfig';
import { updateCategorySchema } from '@/lib/schemas/category';

await databaseConnection();

export async function PATCH(request) {
  try {
    const reqBody = await request.json();

    const { id, name, description, path } = updateCategorySchema.parse(reqBody);

    const categoryExists = await Category.findById(id);

    if (!categoryExists) {
      return NextResponse.json(
        { message: 'category not found' },
        { status: 404 },
      );
    } else {
      const updated = await Category.findByIdAndUpdate(
        id,
        {
          $set: {
            name,
            path,
            description,
          },
        },
        {
          new: true,
          runValidators: true,
        },
      );

      return NextResponse.json(
        { category: updated, message: 'category updated.' },
        { status: 200 },
      );
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
