import Visitor from '@/lib/models/Visitor';
import { NextResponse } from 'next/server';
import { formatZodErrors } from '@/lib/utils';
import { databaseConnection } from '@/lib/dbConfig';
import { updateVisitorSchema } from '@/lib/schemas/visitor';

await databaseConnection();

export async function PATCH(request) {
  try {
    const reqBody = await request.json();

    const { id, name } = updateVisitorSchema.parse(reqBody);

    const visitorExists = await Visitor.findById(id);

    if (!visitorExists) {
      return NextResponse.json(
        { message: 'visitor not found' },
        { status: 404 },
      );
    } else {
      const updated = await Visitor.findByIdAndUpdate(
        id,
        {
          $set: {
            name,
          },
        },
        {
          new: true,
          runValidators: true,
        },
      );

      return NextResponse.json(
        { visitor: updated, message: 'visitor updated.' },
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
