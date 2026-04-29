export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {

    const { description } = req.body;

    const prompt = `
Photorealistic image.

ONLY include details explicitly mentioned.

Do not add:
- extra objects
- decorations
- cinematic lighting
- rich textures
- extra scenery
- implied details

Keep the image minimal and literal.

Student description:
${description}
`;

    const response = await fetch(
      "https://api.openai.com/v1/images/generations",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",

          "Authorization":
            `Bearer ${process.env.OPENAI_API_KEY}`
        },

        body: JSON.stringify({
          model: "gpt-image-1",
          prompt,
          size: "1024x1024"
        })
      }
    );

    const data = await response.json();

    console.log(data);

const imageBase64 = data.data[0].b64_json;

const imageUrl =
  `data:image/png;base64,${imageBase64}`;

res.status(200).json({
  image: imageUrl
});

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
}
