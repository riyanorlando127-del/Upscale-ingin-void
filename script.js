upscaleBtn.addEventListener("click", async () => {

    if (!selectedFile) {
        alert("Pilih gambar terlebih dahulu.");
        return;
    }

    upscaleBtn.disabled = true;
    upscaleBtn.innerHTML = "Uploading...";

    try {

        // Upload ke Cloudinary
        const uploadData = new FormData();

        uploadData.append("file", selectedFile);
        uploadData.append("upload_preset", "rinvoid_unsigned");

        const upload = await fetch(
            "https://api.cloudinary.com/v1_1/rinvoid/image/upload",
            {
                method: "POST",
                body: uploadData
            }
        );

        const uploaded = await upload.json();

        if (!uploaded.secure_url) {
            throw new Error("Upload Cloudinary gagal");
        }

        upscaleBtn.innerHTML = "Upscaling...";

        // Kirim URL ke backend Vercel
        const response = await fetch("/api/upscale", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                imageUrl: uploaded.secure_url,
                scale: Number(scale.value),
                model: model.value
            })
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.error || "Upscale gagal");
        }

        // URL hasil dari Replicate
        let output = data.result?.output;

        if (Array.isArray(output)) {
            output = output[0];
        }

        if (!output) {
            throw new Error("Tidak ada hasil dari Replicate");
        }

        resultImage.src = output;

    } catch (err) {

        console.error(err);
        alert(err.message);

    }

    upscaleBtn.disabled = false;
    upscaleBtn.innerHTML = "Upscale Image";

});
