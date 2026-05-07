import { connectDB } from "@/lib/mongodb";
import Registration from "@/models/Registration";
import crypto from "crypto";
import * as XLSX from "xlsx";

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

    const rows = registrations.map((r, i) => ({
      "#": i + 1,
      "Employee ID": r.employeeId,
      "Employee Name": r.employeeName,
      "Channel Partner Name": r.channelPartnerName,
      Email: r.email,
      "Mobile Number": r.mobileNumber,
      "WhatsApp Number": r.whatsappNumber,
      "Firm Name": r.firmName,
      "Office Location": r.officeLocation,
      Place: r.place,
      "Event Date": r.eventDate,
      "Registered At": new Date(r.createdAt).toLocaleString("en-IN"),
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Registrations");

    const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    const today = new Date().toISOString().split("T")[0];
    const filename = `registrations_${today}.xlsx`;

    return new Response(buf, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    console.error("[/api/export]", err);
    return Response.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
