import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

/**
 * Server-side guard:
 * - Si no hay usuario → redirige
 * - Si hay usuario → retorna userId seguro
 */
export async function requireUserOrRedirect(
  redirectTo: string = "/",
): Promise<string> {
  const { userId } = await auth();

  if (!userId) {
    redirect(redirectTo);
  }

  return userId;
}
