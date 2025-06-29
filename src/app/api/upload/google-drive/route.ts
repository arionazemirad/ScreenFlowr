import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { error: "No authorization header" },
        { status: 401 }
      );
    }

    const accessToken = authHeader.replace("Bearer ", "");

    // Set up Google Drive API
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });

    const drive = google.drive({ version: "v3", auth });

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to Google Drive
    const response = await drive.files.create({
      requestBody: {
        name: file.name,
        parents: ["1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"], // Optional: specify folder ID
      },
      media: {
        mimeType: file.type,
        body: buffer,
      },
    });

    // Make file publicly accessible (optional)
    await drive.permissions.create({
      fileId: response.data.id!,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    const fileUrl = `https://drive.google.com/file/d/${response.data.id}/view`;

    return NextResponse.json({
      success: true,
      fileId: response.data.id,
      url: fileUrl,
      message: "File uploaded successfully to Google Drive",
    });
  } catch (error) {
    console.error("Google Drive upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload to Google Drive" },
      { status: 500 }
    );
  }
}
