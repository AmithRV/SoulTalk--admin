import Page from '@/lib/models/Page';
import Category from '@/lib/models/Category';
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

export async function GET() {
  try {
    const pages = await Page.find().sort({ createdAt: -1 });

    const mostViewd = await Page.find().sort({ views: -1 }).limit(3);

    // 1. Fetch all pages, populate category details, and pre-sort by views (highest first)
    const allPages = await Page.find()
      .populate('categories') // Change to 'categories' if using your old schema
      .sort({ views: -1 });

    // 2. Group the pages by Category using a Map
    const groupedMap = new Map();

    allPages.forEach((page) => {
      // Safely handle pages in case they have a missing or deleted category
      const categoryId = page.categories?._id?.toString() || 'uncategorized';
      const categoryName = page.categories?.name || 'Uncategorized';

      // If this category isn't in our Map yet, add it
      if (!groupedMap.has(categoryId)) {
        groupedMap.set(categoryId, {
          categoryId: categoryId,
          categoryName: categoryName,
          pages: [],
        });
      }

      // Push the page into the correct category array
      // Since allPages is already sorted by views, these pushes maintain that order
      groupedMap.get(categoryId).pages.push(page);
    });

    // 3. Convert the Map values back into a standard array for the JSON response
    const groupedPages = Array.from(groupedMap.values());

    return NextResponse.json(
      {
        message: 'pages',
        data: { mostViewd, groupedPages },
      },
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    console.log('error : ', error);

    if (error.name === 'ZodError') {
      const message = formatZodErrors(error);
      return NextResponse.json({ message }, { status: 422 });
    } else {
      console.log('error : ', error);

      return NextResponse.json({ message: error.message }, { status: 500 });
    }
  }
}
