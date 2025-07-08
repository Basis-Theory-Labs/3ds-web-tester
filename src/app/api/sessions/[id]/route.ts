import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const response = await fetch(
    `${process.env.API_HOST}/3ds/sessions/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "BT-API-KEY": process.env.PVT_API_KEY ?? "",
      },
    }
  );

  return NextResponse.json(await response.json());
} 