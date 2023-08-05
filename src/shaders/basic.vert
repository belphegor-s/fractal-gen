#version 300 es

in vec4 position;
out vec2 uv;

uniform vec2 resolution;

void main() {
    uv = position.xy * 0.5 + 0.5;
    uv.x *= resolution.x / resolution.y;
    gl_Position = position;
}
