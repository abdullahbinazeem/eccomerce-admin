import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string; galleryId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { images } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!images) {
      return new NextResponse("Images not found", { status: 404 });
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

    const gallery = await prismadb.gallery.create({
      data: {
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
        storeId: params.storeId,
      },
    });

    return NextResponse.json(gallery);
  } catch (error) {
    console.log("[IMAGES_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { images, data } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!images.images) {
      return new NextResponse("Images not found", { status: 404 });
    }

    if (!data) {
      return new NextResponse("Gallery not found", { status: 404 });
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

    await prismadb.gallery.update({
      where: {
        id: data.id,
      },
      data: {
        images: {
          deleteMany: {},
        },
      },
    });

    const gallery = await prismadb.gallery.update({
      where: {
        id: data.id,
      },
      data: {
        images: {
          createMany: {
            data: [...images.images.map((image: { url: string }) => image)],
          },
        },
      },
    });

    return NextResponse.json(gallery);
  } catch (error) {
    console.log("[IMAGE_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse("Store Id is required", { status: 400 });
    }

    const products = await prismadb.gallery.findFirst({
      where: {
        storeId: params.storeId,
      },
      include: {
        images: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.log("[IMAGES_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
