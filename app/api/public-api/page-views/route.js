import mongoose from 'mongoose';
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
        return NextResponse.json(
          { message: 'page', data: { views: page.views } },
          { status: 200, headers: corsHeaders },
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
