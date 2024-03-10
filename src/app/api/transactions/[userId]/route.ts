import { PrismaClient } from "@prisma/client";
import { AzureKeyCredential } from "@azure/core-auth";
import { createClient } from "@azure/rest/ai-vision-image-analysis";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: params.userId,
      },
    });
    return Response.json(transactions);
  } catch (error) {
    console.error(error);
    return Response.error();
  }
}

export default async function handler(req, res) {
  // Load the .env file if it exists
  require("dotenv").config();

  const endpoint = process.env["VISION_ENDPOINT"];
  const key = process.env["VISION_KEY"];

  const credential = new AzureKeyCredential(key);
  const client = createClient(endpoint, credential);

  const features = ["Caption", "Read"];
  const imageUrl =
    "https://learn.microsoft.com/azure/ai-services/computer-vision/media/quickstarts/presentation.png";

  try {
    const result = await client.path("/imageanalysis:analyze").post({
      body: {
        url: imageUrl,
      },
      queryParameters: {
        features: features,
      },
      contentType: "application/json",
    });

    const iaResult = result.body;

    let responseText = "";

    if (iaResult.captionResult) {
      responseText += `Caption: ${iaResult.captionResult.text} (confidence: ${iaResult.captionResult.confidence})\n`;
    }
    if (iaResult.readResult) {
      iaResult.readResult.blocks.forEach(
        (block) => (responseText += `Text Block: ${JSON.stringify(block)}\n`)
      );
    }

    res.status(200).json({ text: responseText });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
