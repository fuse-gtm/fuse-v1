import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    { error: 'Partner applications are handled by the Fuse app.' },
    { status: 410 },
  );
}
