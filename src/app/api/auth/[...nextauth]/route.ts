// NextAuth temporarily disabled for deployment
export async function GET() {
  return new Response('Auth temporarily disabled', { status: 200 });
}

export async function POST() {
  return new Response('Auth temporarily disabled', { status: 200 });
}