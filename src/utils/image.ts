export function fileObjToData(file: File): Promise<string> {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => resolve(e.target.result as string);
        reader.readAsDataURL(file);
    });
}

export function scaleCanvas(canvas: HTMLCanvasElement, scale: number) {
    const scaledCanvas = document.createElement('canvas');
    scaledCanvas.width = canvas.width * scale;
    scaledCanvas.height = canvas.height * scale;
    scaledCanvas.getContext('2d').drawImage(canvas, 0, 0, scaledCanvas.width, scaledCanvas.height);
    return scaledCanvas;
}

export async function containImage(srcData: string, width: number, height: number) {
    let canvas = document.createElement('canvas');
    const img = document.createElement('img');

    img.src = srcData;
    await new Promise((resolve) => {
        img.onload = resolve;
    });

    console.log('src dimensions: ', img.width, img.height);
    canvas.width = img.width;
    canvas.height = img.height;
    canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);

    while (canvas.width >= 2 * width) {
        canvas = scaleCanvas(canvas, 0.5);
    }

    if (canvas.width > width) {
        canvas = scaleCanvas(canvas, width / canvas.width);
    }

    if (canvas.height > height) {
        canvas = scaleCanvas(canvas, height / canvas.height);
    }

    return canvas;
}
