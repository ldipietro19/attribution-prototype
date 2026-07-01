import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { taxonomy } from "@/lib/taxonomy";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const category = formData.get("category") as string;
    const description = formData.get("description") as string;
    const imageFile = formData.get("image") as File | null;

    if (!category || !taxonomy[category]) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    const cat = taxonomy[category];
    const fields = cat.fields.map((f) => ({
      key: f.key,
      label: f.label,
      options: f.options,
    }));

    const fieldSpec = fields
      .map((f) =>
        f.options
          ? `- ${f.key} (${f.label}): one of [${f.options.join(", ")}]`
          : `- ${f.key} (${f.label}): free text`
      )
      .join("\n");

    const systemPrompt = `You are a retail merchandising assistant that attributes fashion products.
Given product information, return a JSON object with attribute values for each field.
Only use the allowed options for select fields. If you cannot determine a value, use null.
Return ONLY valid JSON, no explanation.`;

    const userPrompt = `Category: ${cat.name}

Product description: ${description || "No description provided"}

Populate these attributes:
${fieldSpec}

Return a JSON object with keys matching the field names above.`;

    const messages: Anthropic.MessageParam[] = [];

    if (imageFile) {
      const arrayBuffer = await imageFile.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString("base64");
      const mediaType = imageFile.type as "image/jpeg" | "image/png" | "image/gif" | "image/webp";

      messages.push({
        role: "user",
        content: [
          {
            type: "image",
            source: { type: "base64", media_type: mediaType, data: base64 },
          },
          { type: "text", text: userPrompt },
        ],
      });
    } else {
      messages.push({ role: "user", content: userPrompt });
    }

    const response = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 1024,
      system: systemPrompt,
      messages,
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "Failed to parse response" }, { status: 500 });
    }

    const attributes = JSON.parse(jsonMatch[0]);
    return NextResponse.json({ attributes, fields: cat.fields });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
