import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest
): Promise<Response> {
  return NextResponse.json({
    success: true,
  });
}

export async function POST(
  request: NextRequest
): Promise<Response> {
  const body = await request.json();

  return NextResponse.json({
    success: true,
    received: body,
  });
}
