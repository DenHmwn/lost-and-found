import { NextResponse } from "next/server";

// DELETE user by id
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  // Validasi ID
  const id = Number(slug);
  if (isNaN(id)) {
    return NextResponse.json(
      {
        success: false,
        message: "ID tidak valid",
      },
      { status: 400 }
    );
  }
}
