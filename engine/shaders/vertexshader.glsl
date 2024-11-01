#version 300 es

in vec4 a_position;
in vec4 a_color;
out vec4 v_color;

uniform vec4 u_translation;

void main() {
    gl_Position = a_position + u_translation;
    v_color = a_color;
}