import * as twgl from 'twgl.js';

import createModuleProg from './createModuleProg';
import createUnitQuad2d from './createUnitQuad2D';

export const KERNELS = {
    normal: [0, 0, 0, 0, 1, 0, 0, 0, 0],
    gaussianBlur: [0.045, 0.122, 0.045, 0.122, 0.332, 0.122, 0.045, 0.122, 0.045],
    gaussianBlur2: [1, 2, 1, 2, 4, 2, 1, 2, 1],
    gaussianBlur3: [0, 1, 0, 1, 1, 1, 0, 1, 0],
    unsharpen: [-1, -1, -1, -1, 9, -1, -1, -1, -1],
    sharpness: [0, -1, 0, -1, 5, -1, 0, -1, 0],
    sharpen: [-1, -1, -1, -1, 16, -1, -1, -1, -1],
    edgeDetect: [-0.125, -0.125, -0.125, -0.125, 1, -0.125, -0.125, -0.125, -0.125],
    edgeDetect2: [-1, -1, -1, -1, 8, -1, -1, -1, -1],
    edgeDetect3: [-5, 0, 0, 0, 0, 0, 0, 0, 5],
    edgeDetect4: [-1, -1, -1, 0, 0, 0, 1, 1, 1],
    edgeDetect5: [-1, -1, -1, 2, 2, 2, -1, -1, -1],
    edgeDetect6: [-5, -5, -5, -5, 39, -5, -5, -5, -5],
    sobelHorizontal: [1, 2, 1, 0, 0, 0, -1, -2, -1],
    sobelVertical: [1, 0, -1, 2, 0, -2, 1, 0, -1],
    previtHorizontal: [1, 1, 1, 0, 0, 0, -1, -1, -1],
    previtVertical: [1, 0, -1, 1, 0, -1, 1, 0, -1],
    boxBlur: [0.111, 0.111, 0.111, 0.111, 0.111, 0.111, 0.111, 0.111, 0.111],
    triangleBlur: [0.0625, 0.125, 0.0625, 0.125, 0.25, 0.125, 0.0625, 0.125, 0.0625],
    emboss: [-2, -1, 0, -1, 1, 1, 0, 1, 2],
};

const vertShader = `#version 300 es
in vec4 position;
out vec2 uv;

void main() {
   gl_Position = position;
   uv = position.xy * 0.5 + 0.5;
}
`;

const fragShader = `#version 300 es
precision highp float;

in vec2 uv;
out vec4 fragColor;

uniform sampler2D image;
uniform float kernel[9];
uniform float kernelWeight;

void main() {
    vec2 onePixel = vec2(1) / vec2(textureSize(image, 0));

    vec4 colorSum =
        texture(image, uv + onePixel * vec2(-1, -1)) * kernel[0] +
        texture(image, uv + onePixel * vec2( 0, -1)) * kernel[1] +
        texture(image, uv + onePixel * vec2( 1, -1)) * kernel[2] +
        texture(image, uv + onePixel * vec2(-1,  0)) * kernel[3] +
        texture(image, uv + onePixel * vec2( 0,  0)) * kernel[4] +
        texture(image, uv + onePixel * vec2( 1,  0)) * kernel[5] +
        texture(image, uv + onePixel * vec2(-1,  1)) * kernel[6] +
        texture(image, uv + onePixel * vec2( 0,  1)) * kernel[7] +
        texture(image, uv + onePixel * vec2( 1,  1)) * kernel[8];

    fragColor = vec4((colorSum / kernelWeight).rgb, 1);
}
`;

const getProgramInfo = createModuleProg([vertShader, fragShader]);

export interface convolveImageOptions {
    image: WebGLTexture;
    quadBufferInfo?: twgl.BufferInfo;
    kernel: string | number[];
}

function getValidKernel(input: convolveImageOptions['kernel']) {
    if (typeof input === 'string') {
        if (!KERNELS[input]) {
            throw new Error('invalid kernel name');
        }

        return KERNELS[input];
    }

    if (Array.isArray(input)) {
        if (input.length !== 9) {
            throw new Error('invalid kernel: must be 3x3 matrix of length 9');
        }

        return input;
    }

    throw new Error('invalid kernel: must be name or matrix');
}

function computeKernelWeight(kernel) {
    const weight = kernel.reduce((prev, curr) => {
        return prev + curr;
    });
    return weight <= 0 ? 1 : weight;
}

export default function convolveImage(gl: WebGLRenderingContext, opt: convolveImageOptions) {
    const programInfo = getProgramInfo(gl);
    gl.useProgram(programInfo.program);

    const kernel = getValidKernel(opt.kernel);

    const bufferInfo = opt.quadBufferInfo || createUnitQuad2d(gl);
    twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
    twgl.setUniforms(programInfo, {
        image: opt.image,
        kernel,
        kernelWeight: computeKernelWeight(kernel),
    });
    twgl.drawBufferInfo(gl, bufferInfo, gl.TRIANGLE_STRIP);
}
