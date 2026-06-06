import Page from '@/lib/models/Page';
import View from '@/lib/models/View';
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

export async function PATCH(request) {
  try {
    //
    const country = request.headers.get('x-vercel-ip-country') || 'Unknown';

    console.log('country : ', country);
    const reqBody = await request.json();

    const { id } = reqBody;

    const pageExists = await Page.findById(id);

    if (!pageExists) {
      return NextResponse.json(
        { message: 'page not found', headers: corsHeaders },
        { status: 404 },
      );
    } else {
      //
      const views = pageExists?.views;
      const id = pageExists?._id;

      await View.create({
        visitorId: '1',
        country,
        pageId: id,
      });

      const updated = await Page.findByIdAndUpdate(
        id,
        {
          $set: {
            views: views + 1,
          },
        },
        {
          new: true,
          runValidators: true,
        },
      );

      return NextResponse.json(
        { page: updated, message: 'View Updated.' },
        { status: 200, headers: corsHeaders },
      );
    }
  } catch (error) {
    if (error.name === 'ZodError') {
      const message = formatZodErrors(error);
      return NextResponse.json(
        { message },
        { status: 422, headers: corsHeaders },
      );
    } else {
      console.log('error : ', error);

      return NextResponse.json(
        { message: error.message },
        { status: 500, headers: corsHeaders },
      );
    }
  }
}
