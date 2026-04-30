export default async function handler(req, res) {

  try {

    console.log("KEY EXISTS:", !!process.env.OPENAI_API_KEY);

    const { description } = req.body;

    const prompt = `
Create a photorealistic image based ONLY on the explicit details in this description.

Do not invent extra objects, scenery, atmosphere, emotions, lighting, symbolism, decorations, or cinematic effects.

If the description is vague, the image should remain simple and vague.

Description:
${description}
`;

    const response = await fetch(
      "https://api.openai.com/v1/images/generations",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-image-1",
          prompt: prompt,
          size: "1024x1024"
        })
      }
    );

    const data = await response.json();

    console.log("OPENAI RESPONSE:", data);

    if (data.error) {
      return res.status(500).json({
        error: data.error
      });
    }

    const imageBase64 = data.data[0].b64_json;

    const imageUrl = `data:image/png;base64,${imageBase64}`;

    return res.status(200).json({
      image: imageUrl
    });

  } catch (error) {

    console.log("SERVER ERROR:", error);

    return res.status(500).json({
      error: error.message
    });

  }

}
