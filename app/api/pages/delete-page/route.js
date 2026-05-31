import mongoose from 'mongoose';
import Page from '@/lib/models/Page';
import { NextResponse } from 'next/server';
import { formatZodErrors } from '@/lib/utils';
import { databaseConnection } from '@/lib/dbConfig';

await databaseConnection();

export async function DELETE(request) {
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
        const deleted = await Page.findByIdAndDelete(id);

        return NextResponse.json(
          { message: 'page deleted', page: deleted },
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
