export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed"
    });
  }

  try {

    const { imageUrl, scale = 4, model = "General - v3" } = req.body;

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        error: "imageUrl kosong"
      });
    }

    const replicate = await fetch(
      "https://api.replicate.com/v1/predictions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
          "Content-Type": "application/json",
          Prefer: "wait"
        },
        body: JSON.stringify({
          version: "1b976a4d456ed9e4d1a846597b7614e79eadad3032e9124fa63859db0fd59b56",
          input: {
            img: imageUrl,
            scale: Number(scale),
            version: model
          }
        })
      }
    );

    const result = await replicate.json();

    if (result.error) {
      return res.status(500).json({
        success: false,
        error: result.error
      });
    }

    return res.status(200).json({
      success: true,
      result
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      error: err.message
    });

  }

}
