import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    '❌ Please define the MONGODB_URI environment variable in .env',
  );
}
async function databaseConnection() {
  try {
    await mongoose.connect(MONGODB_URI, {});

    const connection = mongoose.connection;

    connection.on('connected', () => {
      console.log('✅ Database connection successful.');
    });

    connection.on('error', (error) => {
      console.error('❌ Error while connecting to the database.');
      console.error('-------------------------------------');
      console.error(error);
      console.error('-------------------------------------');
      process.exit(1); // Use 1 for error exit
    });
  } catch (error) {
    console.error('❌ Something went wrong during DB connection.');
    console.error('-------------------------------------');
    console.error(error);
    console.error('-------------------------------------');
  }
}

export default databaseConnection;
