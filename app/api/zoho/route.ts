import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const response = await fetch("http://4.213.48.68/resources/cart", {
      method: "POST",
      headers: {
        Authorization: "1234567890",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        crm_user: {
          id: "899101000000352001",
          name: null,
        },
        bill_to_account: {
          id: "899101000001728001",
          name: null,
        },
        gifted_to: {
          id: "899101000001728001",
          name: null,
        },
        cart_data: {
          "899101000000356518": {
            quantity: 30,
            discount: 0,
          },
        },
      }),
    });

    // ✅ check if response body is empty
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (!response.ok) {
      console.error("Cart creation failed:", data);
      return NextResponse.json({ error: data }, { status: response.status });
    }
    console.log(data,'CART')

    return NextResponse.json({ message: "Cart created", data });
  } catch (err) {
    console.error("Cart creation error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
