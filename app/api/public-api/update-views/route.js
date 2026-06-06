import Page from '@/lib/models/Page';
import View from '@/lib/models/View';
import Visitor from '@/lib/models/Visitor';
import { formatZodErrors } from '@/lib/utils';
import { databaseConnection } from '@/lib/dbConfig';
import { NextResponse, userAgent } from 'next/server';
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

async function createNewVisitor(response, data) {
  const newVisitor = await Visitor.create(data);

  response.cookies.set('visitorId', newVisitor?._id, {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 365 * 100,
    sameSite: 'lax',
    secure: false,
  });
}

async function updateVisitor(visitor, totalVisits) {
  await Visitor.findByIdAndUpdate(
    visitor?._id,
    {
      $set: {
        totalVisits: totalVisits + 1,
      },
    },
    {
      new: true,
      runValidators: true,
    },
  );
}

export async function PATCH(request) {
  try {
    //
    const reqBody = await request.json();

    const { id } = reqBody;

    // Extract device information from the request
    const { device } = userAgent(request);
    const deviceType = device.type ?? 'desktop';

    const visitorId = request.cookies.get('visitorId')?.value || '';

    const country = request.headers.get('x-vercel-ip-country') || 'Unknown';

    const pageExists = await Page.findById(id);

    const data = {
      visitorId,
      country,
      totalVisits: 1,
      device: deviceType,
    };

    // page not found
    if (!pageExists) {
      const response = NextResponse.json(
        { message: 'page not found', headers: corsHeaders },
        { status: 404 },
      );

      if (!visitorId) {
        await createNewVisitor(response, data);
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
        await createNewVisitor(response, data);
      } else {
        const visitor = await Visitor.findById(visitorId);

        if (visitor) {
          await updateVisitor(visitor, visitor?.totalVisits);
        } else {
          await createNewVisitor(response, data);
        }
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
      return NextResponse.json(
        { message: error.message },
        { status: 500, headers: corsHeaders },
      );
    }
  }
}
