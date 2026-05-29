import { auth } from "@clerk/nextjs/server";
import { unauthorized } from "next/navigation";

export async function getAuthUser() {
  const { userId } = await auth();

  if (!userId) {
    unauthorized();
  }

  return {
    clerkId: userId,
  };
}
