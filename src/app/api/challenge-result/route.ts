import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const sessionId = searchParams.get("sessionId");

  const response = await fetch(
    `${process.env.API_HOST}/3ds/sessions/${sessionId}/challenge-result`,
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
