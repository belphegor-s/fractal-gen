export default function getResolution(gl: WebGLRenderingContext, res: number) {
    let aspectRatio = gl.drawingBufferWidth / gl.drawingBufferHeight;
    if (aspectRatio < 1) {
        aspectRatio = 1 / aspectRatio;
    }

    const min = Math.round(res);
    const max = Math.round(res * aspectRatio);

    if (gl.drawingBufferWidth > gl.drawingBufferHeight) {
        return [max, min];
    }

    return [min, max];
}
