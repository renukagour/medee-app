import { NextRequest, NextResponse } from "next/server";
import {connect} from "@/db";
import Event from "@/models/event.model";

// Create Event
export async function POST(req: NextRequest) {
  try {
    await connect();
    const body = await req.json();
    const newEvent = await Event.create(body);
    return NextResponse.json({ success: true, data: newEvent });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error: "Error creating event" }, { status: 500 });
  }
}
