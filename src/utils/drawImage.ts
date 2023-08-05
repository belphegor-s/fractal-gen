import * as twgl from 'twgl.js';

import createModuleProg from './createModuleProg';
import createUnitQuad2d from './createUnitQuad2D';

const drawImageVert = `#version 300 es
in vec4 position;
out vec2 uv;
uniform mat4 matrix;

void main() {
   gl_Position = matrix * position;
   uv = position.xy * 0.5 + 0.5;
}
`;

const drawImageFrag = `#version 300 es
precision highp float;
in vec2 uv;
out vec4 fragColor;
uniform sampler2D image;

void main() {
    fragColor = texture(image, uv);
}
`;

const getProgramInfo = createModuleProg([drawImageVert, drawImageFrag]);

export interface drawImageOptions {
    image: WebGLTexture;
    x: number;
    y: number;
    width: number;
    height: number;
    destWidth: number;
    destHeight: number;
    quadBufferInfo?: twgl.BufferInfo;
}

export default function drawImage(gl: WebGLRenderingContext, opt: drawImageOptions) {
    const programInfo = getProgramInfo(gl);
    gl.useProgram(programInfo.program);

    // this matrix will convert from pixels to clip space
    let matrix = twgl.m4.ortho(0, opt.destWidth, opt.destHeight, 0, -1, 1);
    matrix = twgl.m4.translate(matrix, twgl.v3.create(opt.x, opt.y, 0));
    matrix = twgl.m4.scale(matrix, twgl.v3.create(opt.width, opt.height, 1));

    const bufferInfo = opt.quadBufferInfo || createUnitQuad2d(gl);
    twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
    twgl.setUniforms(programInfo, { image: opt.image, matrix });
    twgl.drawBufferInfo(gl, bufferInfo, gl.TRIANGLE_STRIP);
}
