import { NextRequest, NextResponse } from "next/server";
import {connect} from "@/db";
import Category from "@/models/category.model";

// Create Category
export async function POST(req: NextRequest) {
  try {
    await connect();
    const { name } = await req.json();
    const category = await Category.create({ name });
    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error: "Error creating category" }, { status: 500 });
  }
}

// Fetch all categories
export async function GET() {
  try {
    await connect();
    const categories = await Category.find({});
    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error: "Error fetching categories" }, { status: 500 });
  }
}
