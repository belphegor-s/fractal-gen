import * as twgl from 'twgl.js';

export default function createModuleProg(shaders: string[]) {
    let programInfo: twgl.ProgramInfo | undefined;

    return (gl: WebGLRenderingContext) => {
        if (!programInfo) {
            programInfo = twgl.createProgramInfo(gl, shaders);
        }

        return programInfo;
    };
}
