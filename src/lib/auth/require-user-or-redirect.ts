import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function requireUserOrRedirect(
  redirectTo: string = "/",
): Promise<string> {
  const { userId } = await auth();

  if (!userId) {
    redirect(redirectTo);
  }

  return userId;
}
