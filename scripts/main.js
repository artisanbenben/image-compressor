// 获取DOM元素
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const previewContainer = document.getElementById('previewContainer');
const controlPanel = document.getElementById('controlPanel');
const originalImage = document.getElementById('originalImage');
const compressedImage = document.getElementById('compressedImage');
const originalSize = document.getElementById('originalSize');
const compressedSize = document.getElementById('compressedSize');
const qualitySlider = document.getElementById('quality');
const qualityValue = document.getElementById('qualityValue');
const downloadBtn = document.getElementById('downloadBtn');

// 处理拖拽上传
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#0071e3';
});

uploadArea.addEventListener('dragleave', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#e5e5e5';
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#e5e5e5';
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        handleImage(file);
    }
});

// 处理点击上传
uploadArea.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        handleImage(file);
    }
});

// 处理图片压缩
function handleImage(file) {
    // 显示原图大小
    originalSize.textContent = formatFileSize(file.size);
    
    // 预览原图
    const reader = new FileReader();
    reader.onload = (e) => {
        originalImage.src = e.target.result;
        compressImage(e.target.result, qualitySlider.value / 100);
    };
    reader.readAsDataURL(file);

    // 显示预览和控制面板
    previewContainer.style.display = 'flex';
    controlPanel.style.display = 'block';
}

// 压缩图片
function compressImage(base64, quality) {
    const img = new Image();
    img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        compressedImage.src = compressedBase64;
        
        // 计算压缩后的大小
        const compressedBytes = atob(compressedBase64.split(',')[1]).length;
        compressedSize.textContent = formatFileSize(compressedBytes);
    };
    img.src = base64;
}

// 质量滑块变化时重新压缩
qualitySlider.addEventListener('input', (e) => {
    qualityValue.textContent = e.target.value + '%';
    if (originalImage.src) {
        compressImage(originalImage.src, e.target.value / 100);
    }
});

// 下载压缩后的图片
downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'compressed_image.jpg';
    link.href = compressedImage.src;
    link.click();
});

// 格式化文件大小
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
} 