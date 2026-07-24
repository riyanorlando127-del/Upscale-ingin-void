// =========================
// Rinvoid Upscaler
// =========================

const dropArea = document.getElementById("dropArea");
const uploadBtn = document.getElementById("uploadBtn");
const imageInput = document.getElementById("imageInput");

const previewImage = document.getElementById("previewImage");
const resultImage = document.getElementById("resultImage");

const upscaleBtn = document.getElementById("upscaleBtn");

const scale = document.getElementById("scale");
const model = document.getElementById("model");
const face = document.getElementById("face");

let selectedFile = null;

// =========================
// Upload
// =========================

uploadBtn.onclick = () => imageInput.click();
dropArea.onclick = () => imageInput.click();

imageInput.onchange = () => {
    if (!imageInput.files.length) return;
    selectedFile = imageInput.files[0];
    preview();
};

dropArea.addEventListener("dragover", e => {
    e.preventDefault();
});

dropArea.addEventListener("drop", e => {
    e.preventDefault();
    selectedFile = e.dataTransfer.files[0];
    preview();
});

// =========================
// Preview
// =========================

function preview() {

    const reader = new FileReader();

    reader.onload = e => {
        previewImage.src = e.target.result;
        resultImage.src = "";
    };

    reader.readAsDataURL(selectedFile);

}

// =========================
// Upscale
// =========================

upscaleBtn.onclick = async () => {

    if (!selectedFile) {
        alert("Pilih gambar dulu.");
        return;
    }

    upscaleBtn.disabled = true;
    upscaleBtn.innerHTML = "Processing...";

    try {

// =========================
// Upload ke Cloudinary
// =========================

const uploadForm = new FormData();

uploadForm.append("file", selectedFile);
uploadForm.append("upload_preset", "rinvoid");

const cloud = await fetch(
    "https://api.cloudinary.com/v1_1/cq3dinj5/image/upload",
    {
        method: "POST",
        body: uploadForm
    }
);

const cloudData = await cloud.json();

console.log(cloudData);

if (!cloudData.secure_url) {
    alert(JSON.stringify(cloudData));
    throw new Error("Upload Cloudinary gagal");
}

        // =========================
        // Kirim URL ke API
        // =========================

        const api = await fetch("/api/upscale", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                imageUrl: cloudData.secure_url,

                scale: Number(scale.value),

                model: model.value,

                face: face.checked

            })

        });

        const data = await api.json();

        console.log(data);

        if (data.result && data.result.output) {

            if (Array.isArray(data.result.output)) {

                resultImage.src = data.result.output[0];

            } else {

                resultImage.src = data.result.output;

            }

        } else {

            alert(JSON.stringify(data));

        }

    } catch (err) {

        console.error(err);

        alert(err.message);

    }

    upscaleBtn.disabled = false;
    upscaleBtn.innerHTML = "Upscale Image";

};

// =========================
// Download
// =========================

resultImage.onclick = () => {

    if (!resultImage.src) return;

    const a = document.createElement("a");

    a.href = resultImage.src;

    a.download = "rinvoid-upscaled.png";

    a.click();

};