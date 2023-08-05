interface buildTextureOptions {
    internalFormat?: number;
    format?: number;
    type?: number;
    width: number;
    height: number;
    src: any;
    wrapping?: number;
    filtering?: number;
}

/**
 * Builds a 2D texture based on the given options.
 * @param gl
 * @param texture
 * @param opt
 */
export default function buildTexture(
    gl: WebGLRenderingContext,
    texture: WebGLTexture,
    opt: buildTextureOptions
) {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        opt.internalFormat || (gl as any).RGBA32F, // why?
        opt.width,
        opt.height,
        0,
        opt.format || gl.RGBA,
        opt.type || gl.FLOAT,
        opt.src
    );
    const wrapping = opt.wrapping || gl.CLAMP_TO_EDGE;
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapping);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapping);
    const filtering = opt.wrapping || gl.LINEAR;
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filtering);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filtering);
}
