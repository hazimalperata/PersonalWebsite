import { NextRequest } from "next/server";
import { PersonalLogo } from "@/components/icons";
import { ImageResponse } from "next/og";
import qs from "qs";

export const runtime = "edge";

async function loadGoogleFont(font: string, weight = 400) {
  const url = `https://fonts.googleapis.com/css2?family=${font}:wght@${weight}`;
  const css = await (await fetch(url)).text();
  const resource = css.match(
    /src: url\((.+)\) format\('(opentype|truetype)'\)/,
  );

  if (resource) {
    const response = await fetch(resource[1]);
    if (response.status == 200) {
      return await response.arrayBuffer();
    }
  }

  throw new Error("failed to load font data");
}

const key = crypto.subtle.importKey(
  "raw",
  new TextEncoder().encode("my_secret"),
  { name: "HMAC", hash: { name: "SHA-256" } },
  false,
  ["sign"],
);

function toHex(arrayBuffer: ArrayBuffer) {
  return Array.prototype.map
    .call(new Uint8Array(arrayBuffer), (n) => n.toString(16).padStart(2, "0"))
    .join("");
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const token = searchParams.get("token");

    const verifyToken = toHex(
      await crypto.subtle.sign(
        "HMAC",
        await key,
        new TextEncoder().encode(JSON.stringify({ id })),
      ),
    );

    if (token !== verifyToken) {
      return new Response("Invalid token.", { status: 401 });
    }

    const title = searchParams.get("title") ?? "Default Title";
    const description = searchParams.get("description") ?? "No description";
    const image = searchParams.get("image") ?? "No Image";

    return new ImageResponse(
      (
        <div
          tw="flex flex-col justify-between w-full h-full p-10"
          style={{
            fontFamily: "Roboto",
            backgroundSize: "100% 100%",
            backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0) 90%), url(${image})`,
          }}
        >
          <div
            style={{ background: "#1B2022" }}
            tw="max-w-[500px] my-auto h-auto max-h-full mx-0 p-5 shadow rounded-xl flex flex-col items-start"
          >
            <h2
              style={{
                fontFamily: "RobotoBold",
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
              tw="text-5xl text-white w-full"
            >
              {title}
            </h2>
            <span tw="border-b border-white w-full" />
            <p
              style={{
                display: "block",
                lineClamp: 8,
              }}
              tw="text-3xl text-white/80 w-full"
            >
              {description}
            </p>
          </div>
          <div
            style={{
              background: "#1B2022",
              gap: 16,
            }}
            tw="absolute text-white p-2 rounded-lg right-5 bottom-5 flex items-center"
          >
            <PersonalLogo />
            <div style={{ fontFamily: "RobotoBold" }} tw="text-2xl">
              hazimalperata.com
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: "Roboto",
            data: await loadGoogleFont("Roboto"),
          },
          {
            name: "RobotoBold",
            data: await loadGoogleFont("Roboto", 500),
          },
        ],
      },
    );
  } catch (error) {
    console.error("OG Image Generation Error:", error);
    return new Response("Failed to generate image", { status: 500 });
  }
}
