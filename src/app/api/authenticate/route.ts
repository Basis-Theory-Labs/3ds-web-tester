import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { sessionId } = await req.json();

  const authenticateRequest = {
    sessionId,
    authentication_category: "payment",
    authentication_type: "payment-transaction",
    challenge_preference: "no-challenge",
    purchase_info: {
      amount: "80000",
      currency: "826",
      exponent: "2",
      date: "20240109141010",
    },
    requestor_info: {
      amex_requestor_type: "MER",
      cb_siret_number: "12412412412"
    },
    merchant_info: {
      mid: "9876543210001",
      acquirer_bin: "000000999",
      name: "Example 3DS Merchant",
      category_code: "7922",
      country_code: "826",
      url: 'https://basistheory.com',
    },
    cardholder_info: {
      name: "Basis Theory",
      email: "engineering@basistheory.com",
      billing_address: {
        country_code: "840",
        state_code: "CA",
        line1: "203 Flamingo Rd",
        line2: "Suite 350",
      },
      shipping_address: {
        country_code: "840",
        state_code: "CA",
        line1: "203 Flamingo Rd",
        line2: "Suite 350",
      }
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
