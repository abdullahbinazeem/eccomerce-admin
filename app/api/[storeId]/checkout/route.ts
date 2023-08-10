import Stripe from "stripe";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  const { productIds, variantIndexes } = await req.json();

  if (!productIds || productIds.length === 0) {
    return new NextResponse("Product ids are required", { status: 400 });
  }

  const products = await prismadb.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
    include: {
      shipping: true,
      images: true,
      colors: true,
    },
  });

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  products.forEach((product, index) => {
    line_items.push({
      quantity: 1,
      price_data: {
        currency: "CAD",
        product_data: {
          name: product.name,
          description: `Color (${
            product.colors[variantIndexes[index]].name
          }) and Size (${product.size})`,
          images: [product.images[0].url],
        },
        unit_amount: product.price.toNumber() * 100,
      },
    });
  });

  const shippingPrice = products.reduce((total, item) => {
    return total + item.shipping.price.toNumber() * 100;
  }, 0);

  const order = await prismadb.order.create({
    data: {
      storeId: params.storeId,
      isPaid: false,
      orderItems: {
        create: productIds.map((productId: string) => ({
          product: {
            connect: {
              id: productId,
            },
          },
        })),
      },
    },
  });

  const session = await stripe.checkout.sessions.create({
    shipping_address_collection: {
      allowed_countries: ["US", "CA"],
    },
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: 0,
            currency: "CAD",
          },
          display_name: "Local Pickup @ Turnstone 3388",
          delivery_estimate: {
            minimum: {
              unit: "business_day",
              value: 1,
            },
            maximum: {
              unit: "business_day",
              value: 1,
            },
          },
        },
      },
      {
        shipping_rate_data: {
          type: `fixed_amount`,
          fixed_amount: {
            amount: Math.round(shippingPrice),
            currency: "CAD",
          },
          display_name: "Canada and US wide shipping",
          delivery_estimate: {
            minimum: {
              unit: "business_day",
              value: 4,
            },
            maximum: {
              unit: "business_day",
              value: 14,
            },
          },
        },
      },
    ],
    line_items,
    automatic_tax: {
      enabled: true,
    },
    mode: "payment",
    billing_address_collection: "required",
    phone_number_collection: {
      enabled: true,
    },
    success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
    cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
    metadata: {
      orderId: order.id,
    },
  });

  return NextResponse.json(
    { url: session.url },
    {
      headers: corsHeaders,
    }
  );
}
