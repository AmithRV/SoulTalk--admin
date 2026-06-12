import { NextResponse } from 'next/server';
import Category from '@/lib/models/Category';
import { formatZodErrors } from '@/lib/utils';
import { databaseConnection } from '@/lib/dbConfig';
import { addCategorySchema } from '@/lib/schemas/category';

await databaseConnection();

export async function POST(request) {
  try {
    const reqBody = await request.json();

    const { name, description, path } = addCategorySchema.parse(reqBody);

    // Check if Category exists
    const categoryExists = await Category.findOne({ name });

    if (categoryExists) {
      return NextResponse.json(
        { message: 'category already exists.' },
        { status: 409 },
      );
    } else {
      //
      const newCategory = await Category.create({
        name,
        path,
        description,
      });

      return NextResponse.json(
        {
          category: newCategory,
          message: 'Category Added',
        },
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
