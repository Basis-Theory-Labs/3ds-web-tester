import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { sessionId } = await req.json();

  const authenticateRequest = {
    sessionId,
    authentication_category: "payment",
    authentication_type: "payment-transaction",
    purchase_info: {
      amount: "80000",
      currency: "826",
      exponent: "2",
      date: "20240109141010",
    },
    requestor_info: {
      id: "example-3ds-merchant",
      name: "Example 3DS Merchant",
      url: "https://www.ravelin.com/example-merchant",
    },
    merchant_info: {
      mid: "9876543210001",
      acquirer_bin: "000000999",
      name: "Example 3DS Merchant",
      category_code: "7922",
      country_code: "826",
    },
    cardholder_info: {
      name: "Basis Theory",
      email: "engineering@basistheory.com",
    },
  };

  const response = await fetch(
    `${process.env.API_HOST}/3ds/sessions/${sessionId}/authenticate`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "BT-API-KEY": process.env.PVT_API_KEY ?? "",
      },
      body: JSON.stringify(authenticateRequest),
    }
  );

  return NextResponse.json(await response.json());
}
