#version 300 es
precision mediump float;
in vec2 position;
uniform float amplitude;
uniform float wavelength;
uniform float time;
uniform float speed;
uniform float canvas_width;
uniform float canvas_height;

float normalize_value(float a, float max) {
  return a / max * 2.0f - 1.0f;
}

void main() {
  // sin(k(x - vt))
  float k = 2.0f * 3.1415926535f / wavelength;
  float x = position.x;
  float y = amplitude * sin(k * (x - speed * time));

  // Center the wave vertically
  float centered_y = y + canvas_height / 2.0f;

  gl_Position = vec4(normalize_value(x, canvas_width), normalize_value(centered_y, canvas_height), 0.0f, 1.0f);
}