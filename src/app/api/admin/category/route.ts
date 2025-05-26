import { NextApiRequest, NextApiResponse } from "next";
import {connect} from "@/db";
import Category from "@/models/category.model";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connect();

  if (req.method === "POST") {
    const { name } = req.body;
    try {
      const category = await Category.create({ name });
      res.status(201).json({ success: true, data: category });
    } catch (error) {
      res.status(400).json({ success: false, error });
    }
  } else if (req.method === "GET") {
    const categories = await Category.find();
    res.status(200).json({ success: true, data: categories });
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
