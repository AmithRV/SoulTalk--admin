import Page from '@/lib/models/Page';
import { NextResponse } from 'next/server';
import { formatZodErrors } from '@/lib/utils';
import { addPageSchema } from '@/lib/schemas/page';
import { databaseConnection } from '@/lib/dbConfig';

await databaseConnection();

export async function POST(request) {
  try {
    const reqBody = await request.json();

    const { name, url, publicUrl, description } = addPageSchema.parse(reqBody);

    // Check if Page exists
    const pageExists = await Page.findOne({ name });

    if (pageExists) {
      return NextResponse.json(
        { message: 'page already exists.' },
        { status: 409 },
      );
    } else {
      //
      const newPage = await Page.create({
        url,
        name,
        views: 0,
        publicUrl,
        description,
      });

      return NextResponse.json(
        {
          page: newPage,
          message: 'page Added',
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
