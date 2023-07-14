import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { shippingId: string } }
) {
  try {
    if (!params.shippingId) {
      return new NextResponse("Shipping id is required", { status: 400 });
    }

    const shipping = await prismadb.shipping.findUnique({
      where: {
        id: params.shippingId,
      },
    });

    return NextResponse.json(shipping);
  } catch (error) {
    console.log("[SHIPPING_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; shippingId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { isFixed, name, price, width, height, length, weight } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store Id is required", { status: 400 });
    }

    if (!params.shippingId) {
      return new NextResponse("Shipping id is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (isFixed == "fixed") {
      if (!price) {
        return new NextResponse("Price is required", { status: 400 });
      }

      const shipping = await prismadb.shipping.updateMany({
        where: {
          id: params.shippingId,
        },
        data: {
          name,
          price,
          isFixed: true,
          storeId: params.storeId,
        },
      });

      return NextResponse.json(shipping);
    }

    if (!width) {
      return new NextResponse("Price is required", { status: 400 });
    }

    if (!height) {
      return new NextResponse("Price is required", { status: 400 });
    }

    if (!length) {
      return new NextResponse("Price is required", { status: 400 });
    }

    if (!weight) {
      return new NextResponse("Weight is required", { status: 400 });
    }

    const shipping = await prismadb.shipping.updateMany({
      where: {
        id: params.shippingId,
      },
      data: {
        name,
        price: 0,
        isFixed: false,
        width,
        height,
        length,
        weight,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(shipping);
  } catch (error) {
    console.log("[SHIPPING_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; shippingId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.shippingId) {
      return new NextResponse("shipping id is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const shipping = await prismadb.shipping.deleteMany({
      where: {
        id: params.shippingId,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(shipping);
  } catch (error) {
    console.log("[SHIPPING_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
