import Comment from '@/lib/models/Comment';
import { NextResponse } from 'next/server';
import { formatZodErrors } from '@/lib/utils';
import { databaseConnection } from '@/lib/dbConfig';
import { updateCommentSchema } from '@/lib/schemas/comment';

await databaseConnection();

export async function PATCH(request) {
  try {
    const reqBody = await request.json();

    const { id, name, comment } = updateCommentSchema.parse(reqBody);

    const commentExists = await Comment.findById(id);

    if (!commentExists) {
      return NextResponse.json(
        { message: 'comment not found' },
        { status: 404 },
      );
    } else {
      const updated = await Comment.findByIdAndUpdate(
        id,
        {
          $set: {
            name,
            comment,
          },
        },
        {
          new: true,
          runValidators: true,
        },
      );

      return NextResponse.json(
        { comment: updated, message: 'comment updated.' },
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
