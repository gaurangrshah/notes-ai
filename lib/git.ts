"use server";

import { updateNote } from "./api/notes/mutations";
import { env } from "./env.mjs";

type uploadFileFromUrlToPublicRepoProps = {
  imageUrl: string;
  fileName: string;
  repoOwner?: string;
  repoName?: string;
  branch?: string;
};

export async function uploadFileFromUrlToPublicRepo({
  imageUrl,
  fileName,
  repoOwner = env.GITHUB_REPO_OWNER!,
  branch = env.GITHUB_REPO_BRANCH!,
  repoName = env.GITHUB_REPO_NAME!,
}: uploadFileFromUrlToPublicRepoProps): Promise<string | void> {
  // Construct the API endpoint URL
  const currentDir = env.GITHUB_REPO_PATH!;
  const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${currentDir}/${fileName}`;
  try {
    // Fetch the image data from the URL
    const imageResponse = await fetch(imageUrl);

    // Check for successful image download
    if (!imageResponse.ok) {
      throw new Error(`Failed to download image from URL: ${imageUrl}`);
    }

    // Convert image data to ArrayBuffer (adjust for different content types)
    const imageArrayBuffer = await imageResponse.arrayBuffer();

    if (!imageArrayBuffer) {
      throw new Error("Failed to convert image to ArrayBuffer");
    }

    // Encode the image data in base64
    const encodedContent = Buffer.from(imageArrayBuffer).toString("base64");

    // Prepare the request body (similar to previous version)
    const body = JSON.stringify({
      message: `Uploading image from URL: ${imageUrl}`,
      content: encodedContent,
      branch,
    });

    // Create request options and send the request (similar to previous version)
    const options = {
      method: "PUT",
      headers: {
        Authorization: `token ${env.GITHUB_IMAGE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body,
    };

    const response = await fetch(url, options);
    console.log("🚀 | response:", await response.json());

    if (!response.ok) {
      throw new Error(`Error uploading image: ${await response.text()}`);
    }

    // const data = await response.json();
    const cdnlink = `https://cdn.jsdelivr.net/gh/${repoOwner}/${repoName}@${branch}/${currentDir}/${fileName}`;

    console.log(
      `Image uploaded successfully to ${repoOwner}/${repoName}/${fileName}`,
      cdnlink
    );

    return cdnlink;
  } catch (error) {
    console.error("Error uploading image:", error);
  }
}
