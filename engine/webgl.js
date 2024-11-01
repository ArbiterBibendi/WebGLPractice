const URL = "http://localhost:5500";

let gl = null;
let positionBuffer = null;
let colorBuffer = null;

export const init = async () => {
  const canvas = document.querySelector("#glcanvas");
  gl = canvas.getContext("webgl2");

  if (gl === null) {
    console.error("Unable to initialize WebGL");
    return;
  }
  _resizeCanvasIfNeeded(canvas);

  const program = await _initializeDefaultShaderProgram(gl);
  const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  const colorAttributeLocation = gl.getAttribLocation(program, "a_color");
  const translationLocation = gl.getUniformLocation(program, "u_translation");


  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

  colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.enableVertexAttribArray(colorAttributeLocation);
  gl.vertexAttribPointer(colorAttributeLocation, 4, gl.FLOAT, false, 0, 0);

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.useProgram(program);
};
const _createShader = (gl, type, source) => {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }

  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
};
const _createProgram = (gl, vertexShader, fragmentShader) => {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
};
const _getVertexShaderSource = async () => {
  const response = await fetch(`${URL}/engine/shaders/vertexshader.glsl`);
  if (response.ok) {
    return await response.text();
  }
  console.error("Couldn't get vertex shader source");
};
const _getFragmentShaderSource = async () => {
  const response = await fetch(`${URL}/engine/shaders/fragmentshader.glsl`);
  if (response.ok) {
    return await response.text();
  }
  console.error("Couldn't get fragment shader source");
};
const _initializeDefaultShaderProgram = async (gl) => {
  const vertexShaderSource = await _getVertexShaderSource();
  const vertexShader = _createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);

  const fragmentShaderSource = await _getFragmentShaderSource();
  const fragmentShader = _createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource
  );

  const program = _createProgram(gl, vertexShader, fragmentShader);
  if (program) {
    return program;
  }
  console.error("Error initializing default shader program");
};
const _resizeCanvasIfNeeded = (canvas) => {
  const displayWidth = canvas.clientWidth;
  const displayHeight = canvas.clientHeight;
  const needResize =
    displayWidth !== canvas.width || displayHeight !== canvas.height;
  if (needResize) {
    canvas.width = displayWidth;
    canvas.height = displayHeight;
  }
};
export const DrawTriangle = (
  vertices,
  color = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
) => {
  if (gl === null || positionBuffer === null || colorBuffer === null) {
    console.log(`gl: ${gl}`);
    console.log(`positionBuffer: ${positionBuffer}`);
    console.log(`colorBuffer: ${colorBuffer}`);
    console.error("GL is null, is the engine initialized?");
    return;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color), gl.STATIC_DRAW);

  gl.drawArrays(gl.TRIANGLES, 0, 3);
};
 
