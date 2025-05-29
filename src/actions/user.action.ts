/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import User from "@/models/user.model";
import { connect } from "@/db";

export async function createUser(user: any) {
  try {
    await connect();
    const existingUser = await User.findOne({ clerkId: user.clerkId });

    if (existingUser) return existingUser; // Already exists, return it!

    const newUser = await User.create({
      ...user,
      role: user.role || 'user',
    });
    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    console.error(error);
  }
}

export async function updateUser(clerkId: string, updatedData: any) {
  try {
    await connect();
    const updatedUser = await User.findOneAndUpdate({ clerkId }, updatedData, { new: true });

    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {
    console.error(error);
  }
}

export async function deleteUser(clerkId: string) {
  try {
    await connect();
    await User.findOneAndDelete({ clerkId });
  } catch (error) {
    console.error(error);
  }
}
