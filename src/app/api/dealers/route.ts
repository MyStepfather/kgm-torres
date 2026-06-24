import { NextResponse } from "next/server";
import { getDealers } from "@/lib/dealers";

export async function GET() {
  const dealers = await getDealers();
  return NextResponse.json(dealers);
}
