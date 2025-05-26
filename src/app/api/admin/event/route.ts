import { NextApiRequest, NextApiResponse } from "next";
import {connect} from "@/db";
import Event from "@/models/event.model";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connect();

  if (req.method === "POST") {
    const { title, description, date, location, image, category } = req.body;
    try {
      const event = await Event.create({ title, description, date, location, image, category });
      res.status(201).json({ success: true, data: event });
    } catch (error) {
      res.status(400).json({ success: false, error });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
