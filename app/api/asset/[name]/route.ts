import { NextResponse } from "next/server";
import { getDriveClient } from "@/lib/google";
import { ASSETS_FOLDER_ID } from "@/lib/config";

export const dynamic = "force-dynamic";

const TYPES: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
  svg: "image/svg+xml",
};

export async function GET(
  _req: Request,
  { params }: { params: { name: string } },
) {
  const name = decodeURIComponent(params.name);
  try {
    const drive = getDriveClient();
    const list = await drive.files.list({
      q: `name = '${name.replace(/'/g, "\\'")}' and '${ASSETS_FOLDER_ID}' in parents and trashed = false`,
      fields: "files(id, mimeType, md5Checksum, modifiedTime)",
      orderBy: "modifiedTime desc",
      pageSize: 1,
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
    });
    const file = list.data.files?.[0];
    if (!file?.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const media = await drive.files.get(
      { fileId: file.id, alt: "media", supportsAllDrives: true },
      { responseType: "arraybuffer" },
    );
    const ext = name.split(".").pop()?.toLowerCase() ?? "";
    const contentType =
      file.mimeType || TYPES[ext] || "application/octet-stream";
    // The ETag follows the Drive file, so a replaced upload shows up on the
    // next load instead of after a cache window.
    const etag = `"${file.md5Checksum ?? file.modifiedTime ?? file.id}"`;
    if (_req.headers.get("if-none-match") === etag) {
      return new NextResponse(null, { status: 304, headers: { ETag: etag } });
    }
    return new NextResponse(Buffer.from(media.data as ArrayBuffer), {
      headers: {
        "Content-Type": contentType,
        ETag: etag,
        "Cache-Control": "private, no-cache",
      },
    });
  } catch (err) {
    console.error("asset fetch failed:", err);
    return NextResponse.json({ error: "Unavailable" }, { status: 502 });
  }
}
