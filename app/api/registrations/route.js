import { connectDB } from "@/lib/mongodb";
import Registration from "@/models/Registration";
import crypto from "crypto";

function checkAuth(request) {
  const token = request.headers.get("x-admin-token");
  const password = process.env.ADMIN_PASSWORD;
  if (!token || !password) return false;
  const a = Buffer.from(token);
  const b = Buffer.from(password);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export async function GET(request) {
  if (!checkAuth(request)) {
    return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const registrations = await Registration.find({})
      .sort({ createdAt: -1 })
      .lean();

    return Response.json({ success: true, data: registrations });
  } catch (err) {
    console.error("[/api/registrations]", err);
    return Response.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
