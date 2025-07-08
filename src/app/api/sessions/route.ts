import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { tokenId } = await req.json();

  const createSessionRequest = {
    token_id: tokenId,
    type: "customer",
    device: "browser",
    authentication_request: {
        authentication_category: "payment",
        authentication_type: "payment-transaction",
        challenge_preference: "no-preference",
        purchase_info: {
            amount: "80000",
            currency: "826",
            exponent: "2",
            date: "20240109141010"
        },
        merchant_info: {
            mid: "9876543210001",
            acquirer_bin: "000000999",
            name: "Example 3DS Merchant",
            category_code: "7922",
            country_code: "826",
            url: "https://basistheory.com",
        },
        cardholder_info: {
            name: "John Doe",
            email: "john@example.com"
        }
    },
    callback_urls: {
        success: "http://localhost:3000/success",
        failure: "http://localhost:3000/failure"
    }
}
  
  const response = await fetch(
    `${process.env.API_HOST}/3ds/sessions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "BT-API-KEY": process.env.NEXT_PUBLIC_PUB_API_KEY ?? "",
      },
      body: JSON.stringify(createSessionRequest),
    }
  );

  return NextResponse.json(await response.json());
} 