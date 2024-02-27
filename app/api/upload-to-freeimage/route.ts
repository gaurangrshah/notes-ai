export async function uploadToFreeImage(image_url: string, name: string) {
  try {
    const response = await fetch(image_url);
    const buffer = await response.arrayBuffer();
    const file_name = name.replace(" ", "") + Date.now + ".jpeg";

    // @SEE: https://freeimage.host/page/api?lang=en
    const result = await fetch(
      "https://freeimage.host/api/1/upload/?format=json",
      {
        method: "POST",
        body: JSON.stringify({
          key: file_name,
          source: "file",
          file: buffer,
        }),
      }
    );

    const data = await result.json();
    console.log("🚀 | data:", data);
    return data.image.url;
  } catch (error) {
    console.error(error);
  }
}
