import { connectDB } from "@/lib/mongodb";
import Registration from "@/models/Registration";

const PHONE_RE = /^[6-9]\d{9}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      employeeId,
      employeeName,
      channelPartnerName,
      email,
      mobileNumber,
      whatsappNumber,
      firmName,
      officeLocation,
      place,
    } = body;

    // Server-side validation
    if (
      !employeeId ||
      !employeeName ||
      !channelPartnerName ||
      !email ||
      !mobileNumber ||
      !whatsappNumber ||
      !firmName ||
      !officeLocation ||
      !place
    ) {
      return Response.json(
        { success: false, message: "All fields are required." },
        { status: 400 }
      );
    }

    if (!PHONE_RE.test(mobileNumber)) {
      return Response.json(
        { success: false, message: "Invalid mobile number." },
        { status: 400 }
      );
    }

    if (!PHONE_RE.test(whatsappNumber)) {
      return Response.json(
        { success: false, message: "Invalid WhatsApp number." },
        { status: 400 }
      );
    }

    if (!EMAIL_RE.test(email)) {
      return Response.json(
        { success: false, message: "Invalid email address." },
        { status: 400 }
      );
    }

    await connectDB();

    await Registration.create({
      employeeId,
      employeeName,
      channelPartnerName,
      email,
      mobileNumber,
      whatsappNumber,
      firmName,
      officeLocation,
      place,
    });

    return Response.json(
      { success: true, message: "Registered successfully" },
      { status: 201 }
    );
  } catch (err) {
    console.error("[/api/register]", err);
    return Response.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
