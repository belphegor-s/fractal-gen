import * as dat from 'dat.gui';
import * as twgl from 'twgl.js';

import createContext from './utils/createContext';
import createUnitQuad2D from './utils/createUnitQuad2D';

const basicVertShader = require('./shaders/basic.vert');
const marbleShader = require('./shaders/marble.frag');

/**
 * Initialize WebGL, buffer, and shader
 */
const gl: WebGLRenderingContext = createContext();
console.log('canvas dimensions:', gl.canvas.width, gl.canvas.height);
const programInfo = twgl.createProgramInfo(gl, [basicVertShader, marbleShader]);
const bufferInfo = createUnitQuad2D(gl);

const state = {
    animate: true,
    color1: [125, 19, 19],
    color2: [255, 255, 255],
    color3: [110, 110, 110],
    color4: [255, 255, 255],
    gain: 0.5,
    invert: false,
    lacunarity: 2.0,
    noiseMode: 'scale',
    octaves: 5,
    offsetAX: 0,
    offsetAY: 0,
    offsetBX: 4.2,
    offsetBY: 1.3,
    offsetCX: 1.7,
    offsetCY: 3.2,
    offsetDX: 4.3,
    offsetDY: 2.8,
    offsetX: 0,
    offsetY: 0,
    scale1: 3.0,
    scale2: 3.0,
    scaleByPrev: false,
    sharpen: true,
    timeScaleX: 0.4,
    timeScaleY: 0.3,
};

const gui = new dat.GUI();
gui.add(state, 'animate');
gui.add(state, 'noiseMode', ['mirror', 'scale']);
gui.add(state, 'invert');
gui.add(state, 'sharpen');
gui.add(state, 'scaleByPrev');
gui.add(state, 'gain', 0, 1);
gui.add(state, 'lacunarity', 0, 3);
gui.add(state, 'octaves', 1, 10, 1);
gui.add(state, 'scale1', 1, 4);
gui.add(state, 'scale2', 1, 4);
gui.add(state, 'timeScaleX', 0, 1);
gui.add(state, 'timeScaleY', 0, 1);

const color = gui.addFolder('color');
color.open();
color.addColor(state, 'color1');
color.addColor(state, 'color2');
color.addColor(state, 'color3');
color.addColor(state, 'color4');

const offsets = gui.addFolder('offsets');
offsets.add(state, 'offsetAX', 0, 8);
offsets.add(state, 'offsetAY', 0, 8);
offsets.add(state, 'offsetBX', 0, 8);
offsets.add(state, 'offsetBY', 0, 8);
offsets.add(state, 'offsetCX', 0, 8);
offsets.add(state, 'offsetCY', 0, 8);
offsets.add(state, 'offsetDX', 0, 8);
offsets.add(state, 'offsetDY', 0, 8);
offsets.add(state, 'offsetX', 0, 8);
offsets.add(state, 'offsetY', 0, 8);

function render(time: number) {
    twgl.resizeCanvasToDisplaySize(gl.canvas as HTMLCanvasElement);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    const uniforms = {
        animate: state.animate,
        color1: state.color1.map(c => c / 255),
        color2: state.color2.map(c => c / 255),
        color3: state.color3.map(c => c / 255),
        color4: state.color4.map(c => c / 255),
        gain: state.gain,
        invert: state.invert,
        lacunarity: state.lacunarity,
        noiseMode: state.noiseMode === 'scale' ? 0 : 1,
        octaves: state.octaves,
        offset: [state.offsetX, state.offsetY],
        offsetA: [state.offsetAX, state.offsetAY],
        offsetB: [state.offsetBX, state.offsetBY],
        offsetC: [state.offsetCX, state.offsetCY],
        offsetD: [state.offsetDX, state.offsetDY],
        resolution: [gl.canvas.width, gl.canvas.height],
        scale1: state.scale1,
        scale2: state.scale2,
        scaleByPrev: state.scaleByPrev,
        sharpen: state.sharpen,
        time: time * 0.001,
        timeScale: [state.timeScaleX, state.timeScaleY],
    };

    gl.useProgram(programInfo.program);
    twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
    twgl.setUniforms(programInfo, uniforms);
    twgl.drawBufferInfo(gl, bufferInfo, gl.TRIANGLE_STRIP);

    requestAnimationFrame(render);
}

requestAnimationFrame(render);
