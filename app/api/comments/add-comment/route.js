import Comment from '@/lib/models/Comment';
import { NextResponse } from 'next/server';
import { formatZodErrors } from '@/lib/utils';
import { databaseConnection } from '@/lib/dbConfig';
import { addCommentSchema } from '@/lib/schemas/comment';

await databaseConnection();

export async function POST(request) {
  try {
    const reqBody = await request.json();

    const { name, pageId, comment } = addCommentSchema.parse(reqBody);

    const newPage = await Comment.create({
      name,
      comment,
      page: pageId,
    });

    return NextResponse.json(
      {
        page: newPage,
        message: 'comment Added',
      },
      { status: 200 },
    );
  } catch (error) {
    if (error.name === 'ZodError') {
      const message = formatZodErrors(error);
      return NextResponse.json({ message }, { status: 422 });
    } else {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
  }
}
