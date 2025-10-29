import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import AdmZip from "adm-zip";

// POST /api/admin/plugin-upload/analyze - Analyze ZIP file to extract version and changelog
export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    // Check if user is super admin (role 5)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (!currentUser || currentUser.role !== 5) {
      return NextResponse.json(
        { error: "Forbidden - Super admin access required" },
        { status: 403 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert file to buffer for ZIP processing
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let version = "";
    let description = "";
    let changelog = "";

    try {
      // Extract version and changelog from ZIP
      const zip = new AdmZip(buffer);
      const zipEntries = zip.getEntries();

      // Find main plugin file (typically has Plugin Name header)
      let pluginFileContent = "";
      let readmeContent = "";

      for (const entry of zipEntries) {
        const fileName = entry.entryName.toLowerCase();

        // Look for main plugin PHP file (usually in root or one level deep)
        if (
          fileName.endsWith(".php") &&
          !fileName.includes("/vendor/") &&
          !fileName.includes("/node_modules/")
        ) {
          const content = entry.getData().toString("utf8");

          // Check if this is the main plugin file (has Plugin Name header)
          if (content.includes("Plugin Name:")) {
            pluginFileContent = content;
            break; // Found the main file
          }
        }
      }

      // Second pass for readme/changelog
      for (const entry of zipEntries) {
        const fileName = entry.entryName.toLowerCase();

        // Look for readme or changelog files
        if (fileName.includes("readme.txt") || fileName.includes("readme.md")) {
          readmeContent = entry.getData().toString("utf8");
          break;
        } else if (
          fileName.includes("changelog") &&
          (fileName.endsWith(".txt") || fileName.endsWith(".md"))
        ) {
          readmeContent = entry.getData().toString("utf8");
        }
      }

      // Extract version from plugin header
      if (pluginFileContent) {
        const versionMatch = pluginFileContent.match(/Version:\s*([\d.]+)/i);
        if (versionMatch) {
          version = versionMatch[1];
        }

        // Extract description from plugin header (short description)
        const descMatch = pluginFileContent.match(/Description:\s*([^\n]+)/i);
        if (descMatch) {
          description = descMatch[1].trim();
        }
      }

      // Extract changelog from readme
      if (readmeContent) {
        // Try to extract the latest version's changelog
        const changelogSection = readmeContent.match(
          /== Changelog ==\s*([\s\S]*?)(?:\n==|$)/i
        );
        if (changelogSection) {
          const fullChangelog = changelogSection[1].trim();

          // Get just the latest version's changes (first section up to next version)
          const lines = fullChangelog.split("\n");
          const changelogLines = [];
          let foundVersion = false;

          for (const line of lines) {
            // Stop at next version header
            if (line.match(/^=\s*\d+\.\d+/) && foundVersion) {
              break;
            }

            if (line.match(/^=\s*\d+\.\d+/)) {
              foundVersion = true;
              continue; // Skip the version header line
            }

            if (foundVersion && line.trim()) {
              changelogLines.push(line);
            }
          }

          if (changelogLines.length > 0) {
            changelog = changelogLines.join("\n").trim();
          }
        }
      }

      return NextResponse.json({
        success: true,
        version: version || null,
        description: description || null,
        changelog: changelog || null,
      });
    } catch (zipError) {
      console.error("Error parsing ZIP file:", zipError);
      return NextResponse.json(
        {
          error:
            "Failed to parse ZIP file. Ensure it's a valid WordPress plugin.",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Plugin analysis error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
