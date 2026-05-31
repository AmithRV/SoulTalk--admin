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
      const page = await Page.findById(id);

      if (!page) {
        return NextResponse.json(
          {
            message: 'page not found',
          },
          { status: 404 },
        );
      } else {
        const page = await Page.findById(id)
          .populate('categories') // Category details
          .sort({ createdAt: -1 });

        return NextResponse.json(
          { message: 'page', data: { page } },
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
