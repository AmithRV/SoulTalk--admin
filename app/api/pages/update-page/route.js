import Page from '@/lib/models/Page';
import { NextResponse } from 'next/server';
import { formatZodErrors } from '@/lib/utils';
import { databaseConnection } from '@/lib/dbConfig';
import { updatePageSchema } from '@/lib/schemas/page';

await databaseConnection();

export async function PATCH(request) {
  try {
    const reqBody = await request.json();

    const { id, name, url, publicUrl, description } =
      updatePageSchema.parse(reqBody);

    const pageExists = await Page.findById(id);

    if (!pageExists) {
      return NextResponse.json({ message: 'page not found' }, { status: 404 });
    } else {
      const updated = await Page.findByIdAndUpdate(
        id,
        {
          $set: {
            url,
            name,
            publicUrl,
            description,
          },
        },
        {
          new: true,
          runValidators: true,
        },
      );

      return NextResponse.json(
        { page: updated, message: 'page updated.' },
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
