import * as twgl from 'twgl.js';

export default function createUnitQuad2D(gl: WebGLRenderingContext) {
    return twgl.createBufferInfoFromArrays(gl, {
        position: {
            data: [-1, -1, -1, 1, 1, -1, 1, 1],
            numComponents: 2,
        },
    });
}
