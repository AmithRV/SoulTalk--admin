import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import User from '@/lib/models/User';
import { NextResponse } from 'next/server';
import { formatZodErrors } from '@/lib/utils';
import { loginSchema } from '@/lib/schemas/auth';
import { databaseConnection } from '@/lib/dbConfig';

await databaseConnection();

export async function POST(request) {
  try {
    const reqBody = await request.json();

    const { email, password } = loginSchema.parse(reqBody);

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid email or password.' },
        { status: 401 },
      );
    } else {
      //check if password is correct
      const response = compare(password, user.password).then((valid) => {
        if (valid) {
          // Create token data
          const tokenData = {
            id: user._id,
            email: user.email,
          };

          //Create token
          const token = sign(tokenData, process.env.TOKEN_SECRET, {
            expiresIn: '1d',
          });

          //Create response
          const response = NextResponse.json({
            message: 'Login successful',
            user: {
              id: user._id,
              name: user.name,
              email: user.email,
              type: user.type,
              tenantId: user.tenantId,
              isSuperAdmin: user.isSuperAdmin,
            },
          });

          response.cookies.set('token', token, { httpOnly: true });

          return response;
        } else {
          return NextResponse.json(
            { message: 'Invalid password' },
            { status: 401 },
          );
        }
      });

      return response;
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
