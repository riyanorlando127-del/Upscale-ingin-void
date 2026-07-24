// =========================
// Rinvoid Upscaler
// script.js
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
// Upload Button
// =========================

uploadBtn.addEventListener("click", () => {
    imageInput.click();
});

// =========================
// Input File
// =========================

imageInput.addEventListener("change", () => {

    if (!imageInput.files.length) return;

    selectedFile = imageInput.files[0];

    preview();

});

// =========================
// Drag & Drop
// =========================

dropArea.addEventListener("dragover", (e) => {

    e.preventDefault();

    dropArea.style.borderColor = "#8f5fff";

});

dropArea.addEventListener("dragleave", () => {

    dropArea.style.borderColor = "";

});

dropArea.addEventListener("drop", (e) => {

    e.preventDefault();

    dropArea.style.borderColor = "";

    selectedFile = e.dataTransfer.files[0];

    preview();

});

// =========================
// Preview Image
// =========================

function preview() {

    if (!selectedFile) return;

    const reader = new FileReader();

    reader.onload = function(e){

        previewImage.src = e.target.result;

        resultImage.src = "";

    }

    reader.readAsDataURL(selectedFile);

}

// =========================
// Upscale
// =========================

upscaleBtn.addEventListener("click", async () => {

    if (!selectedFile){

        alert("Please select an image first.");

        return;

    }

    upscaleBtn.disabled = true;

    upscaleBtn.innerHTML = "Processing...";

    const form = new FormData();

    form.append("image", selectedFile);

    form.append("scale", scale.value);

    form.append("model", model.value);

    form.append("face", face.checked ? "true":"false");

    try{

        const response = await fetch("api.php",{

            method:"POST",

            body:form

        });

        const data = await response.json();

        if(data.success){

            resultImage.src = data.output;

        }else{

            alert(data.error || "Upscale failed.");

        }

    }catch(err){

        alert("Connection error.");

        console.error(err);

    }

    upscaleBtn.disabled = false;

    upscaleBtn.innerHTML = "Upscale Image";

});

// =========================
// Click Upload Area
// =========================

dropArea.addEventListener("click",()=>{

    imageInput.click();

});

// =========================
// Download Result
// =========================

resultImage.addEventListener("click",()=>{

    if(!resultImage.src) return;

    const a=document.createElement("a");

    a.href=resultImage.src;

    a.download="rinvoid-upscaled.png";

    a.click();

});