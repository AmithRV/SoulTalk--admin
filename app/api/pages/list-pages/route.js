/* eslint-disable @typescript-eslint/no-unused-vars */
import Page from '@/lib/models/Page';
import { NextResponse } from 'next/server';
import Category from '@/lib/models/Category';
import { formatZodErrors } from '@/lib/utils';
import { databaseConnection } from '@/lib/dbConfig';

await databaseConnection();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // If an 'id' is provided, filter by it. Otherwise, return an empty object to fetch all.
    const query = id ? { categories: id } : {};

    const pages = await Page.find(query)
      .populate('categories') // Category details
      .sort({ createdAt: -1 });

    return NextResponse.json({ data: pages }, { status: 200 });
  } catch (error) {
    if (error.name === 'ZodError') {
      const message = formatZodErrors(error);
      return NextResponse.json({ message }, { status: 422 });
    } else {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
  }
}
