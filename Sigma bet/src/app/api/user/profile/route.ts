import { NextRequest } from "next/server";
import { requireAuth, jsonSuccess, parseBody } from "@/lib/api";
import { errorResponse, AppError } from "@/lib/errors";
import { profileSchema } from "@/lib/validations";
import { requireActiveUser, updateProfile } from "@/services/user.service";

export async function PATCH(req: NextRequest) {
  try {
    const auth = await requireAuth(req);
    await requireActiveUser(auth.sub);
    const body = await parseBody(req);
    const parsed = profileSchema.safeParse(body);

    if (!parsed.success) {
      throw new AppError(parsed.error.errors[0].message, 400, "VALIDATION_ERROR");
    }

    const user = await updateProfile(auth.sub, parsed.data);
    return jsonSuccess({ user });
  } catch (error) {
    return errorResponse(error);
  }
}
