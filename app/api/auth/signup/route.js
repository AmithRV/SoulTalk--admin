import { hash } from 'bcrypt';
import User from '@/lib/models/User';
import { NextResponse } from 'next/server';
import { formatZodErrors } from '@/lib/utils';
import { databaseConnection } from '@/lib/dbConfig';
import { registrationSchema } from '@/lib/schemas/auth';

await databaseConnection();

export async function POST(request) {
  try {
    const reqBody = await request.json();
    const { name, email, password } = registrationSchema.parse(reqBody);

    // Check if user exists
    const user = await User.findOne({ email });

    if (user) {
      return NextResponse.json(
        { message: 'User already exists.' },
        { status: 409 },
      );
    } else {
      const hashedPassword = await hash(password, 10); // Hash the password

      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
      });

      return NextResponse.json(
        {
          message: 'User added successfully',
          user: { id: newUser._id, email: newUser.email, name: newUser.name },
        },
        { status: 201 },
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
