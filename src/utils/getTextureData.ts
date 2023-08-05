/**
 * Read texture data from GPU to CPU
 * http://cs.boisestate.edu/~scutchin/cs464/textdata.html
 * @param gl
 * @param texture
 */
export default function getTextureData(
    gl: WebGLRenderingContext,
    texture: WebGLTexture,
    width: number,
    height: number
) {
    // configure the texture handle for use by the GPU
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

    // alocate the array for holding the RGBA pixel data
    const pixels = new Float32Array(4 * width * height);

    // here we use a framebuffer as an offscreen render object
    // draw the texture into it and then copy the pixel values into a local array.
    const framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE) {
        gl.readPixels(0, 0, width, height, gl.RGBA, gl.FLOAT, pixels);
    }

    // unbind this framebuffer so its memory can be reclaimed.
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    return pixels;
}
