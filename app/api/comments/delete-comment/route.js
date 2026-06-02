import mongoose from 'mongoose';
import Comment from '@/lib/models/Comment';
import { NextResponse } from 'next/server';
import { formatZodErrors } from '@/lib/utils';
import { databaseConnection } from '@/lib/dbConfig';

await databaseConnection();

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (mongoose.Types.ObjectId.isValid(id)) {
      const comment = await Comment.findById(id);

      if (!comment) {
        return NextResponse.json(
          {
            message: 'comment not found',
          },
          { status: 404 },
        );
      } else {
        const deleted = await Comment.findByIdAndDelete(id);

        return NextResponse.json(
          { message: 'comment deleted', comment: deleted },
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
