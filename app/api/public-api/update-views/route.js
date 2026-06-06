import Page from '@/lib/models/Page';
import View from '@/lib/models/View';
import Visitor from '@/lib/models/Visitor';
import { NextResponse } from 'next/server';
import { formatZodErrors } from '@/lib/utils';
import { databaseConnection } from '@/lib/dbConfig';
//
await databaseConnection();

const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:5500', // replace with domain in prod
  'Access-Control-Allow-Methods': 'GET, PATCH, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true', // Required for cookies
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function PATCH(request) {
  try {
    //
    const country = request.headers.get('x-vercel-ip-country') || 'Unknown';

    const reqBody = await request.json();

    const { id } = reqBody;

    const visitorId = request.cookies.get('visitorId')?.value || '';

    const pageExists = await Page.findById(id);

    // page not found
    if (!pageExists) {
      const response = NextResponse.json(
        { message: 'page not found', headers: corsHeaders },
        { status: 404 },
      );
      if (!visitorId) {
        const newVisitor = await Visitor.create({
          visitorId,
          country,
          totalVisits: 0,
          device: '',
        });

        response.cookies.set('visitorId', newVisitor?._id, {
          httpOnly: true,
          path: '/',
          maxAge: 60 * 60 * 24 * 365 * 100,
          sameSite: 'lax',
          secure: false,
        });
      } else {
        console.log('visitorId :  ', visitorId);
      }

      return response;
    } else {
      //
      const views = pageExists?.views;
      const id = pageExists?._id;

      await View.create({
        country,
        visitorId,
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

      const response = NextResponse.json(
        { page: updated, message: 'View Updated.' },
        { status: 200, headers: corsHeaders },
      );

      if (!visitorId) {
        const newVisitor = await Visitor.create({
          country,
          totalVisits: 0,
          device: '',
        });
        console.log('newVisitor : ', newVisitor);

        response.cookies.set('visitorId', newVisitor._id, {
          httpOnly: true,
          path: '/',
          maxAge: 60 * 60 * 24 * 365 * 100,
          sameSite: 'lax',
          secure: false,
        });
      } else {
        console.log('visitorId :  ', visitorId);
        // await Visitor.create({
        //   country,
        //   totalVisits: 0,
        //   device: '',
        // });
      }

      return response;
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
