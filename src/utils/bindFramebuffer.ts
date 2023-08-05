/**
 * Binds a framebuffer to the drawing context
 * @param gl
 * @param framebuffer
 * @param width
 * @param height
 */
export default function bindFramebuffer(
    gl: WebGLRenderingContext,
    framebuffer: WebGLFramebuffer,
    width: number,
    height: number
) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.viewport(0, 0, width, height);
}

/**
 * bind framebuffer for drawing with a given color texture to draw to
 * @param gl
 * @param framebuffer
 * @param width
 * @param height
 * @param texture
 */
export function bindFramebufferWithTexture(
    gl: WebGLRenderingContext,
    framebuffer: WebGLFramebuffer,
    width: number,
    height: number,
    texture: WebGLTexture
) {
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    bindFramebuffer(gl, framebuffer, width, height);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
}
