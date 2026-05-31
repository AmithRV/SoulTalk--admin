import { NextResponse } from 'next/server';
import { databaseConnection } from '@/lib/dbConfig';

await databaseConnection();

export async function GET() {
  try {
    const response = NextResponse.json({
      message: 'Logout successful',
      success: true,
    });

    response.cookies.set('token', '', {
      httpOnly: true,
      expires: new Date(0),
    });

    return response;
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
