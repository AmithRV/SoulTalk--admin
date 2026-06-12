import Page from '@/lib/models/Page';
import { NextResponse } from 'next/server';
import { formatZodErrors } from '@/lib/utils';
import { databaseConnection } from '@/lib/dbConfig';

await databaseConnection();

const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // replace with domain in prod
  'Access-Control-Allow-Methods': 'GET, PATCH, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const categoryId = searchParams.get('categoryId');

    // Build the query dynamically
    const query = {};

    if (categoryId) {
      // Optional: Check if valid to prevent CastErrors on malformed IDs
      if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        return NextResponse.json(
          { message: 'Invalid categoryId format' },
          { status: 400 },
        );
      }
      query.categoryId = categoryId;
    }

    const pages = await Page.find(query).sort({ createdAt: -1 });

    return NextResponse.json(
      {
        message: 'pages',
        data: { pages },
      },
      { status: 200, headers: corsHeaders },
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
