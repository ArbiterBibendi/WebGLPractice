const URL = "http://localhost:5500";

const triangleVerticesPosition = [-0.5, 0.5, -1, -0.5, 0, -0.5];
const triangleVerticesPosition2 = [0.5, 0.5, 0, -0.5, 1, -0.5];
const triangleVerticesColor = [1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1];
const triangleVerticesColor2 = [1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1];

const main = async () => {
  const canvas = document.querySelector("#glcanvas");
  const gl = canvas.getContext("webgl2");

  if (gl === null) {
    console.error("Unable to initialize WebGL");
    return;
  }
  resizeCanvasIfNeeded(canvas);

  const program = await initializeDefaultShaderProgram(gl);
  const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  const colorAttributeLocation = gl.getAttribLocation(program, "a_color");

  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.enableVertexAttribArray(colorAttributeLocation);
  gl.vertexAttribPointer(colorAttributeLocation, 4, gl.FLOAT, false, 0, 0);

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  drawTriangle(
    gl,
    positionBuffer,
    colorBuffer,
    triangleVerticesPosition,
    triangleVerticesColor,
    program
  );
  drawTriangle(
    gl,
    positionBuffer,
    colorBuffer,
    triangleVerticesPosition2,
    triangleVerticesColor2,
    program
  );
};
const createShader = (gl, type, source) => {
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
const createProgram = (gl, vertexShader, fragmentShader) => {
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
const getVertexShaderSource = async () => {
  const response = await fetch(`${URL}/vertexshader.glsl`);
  if (response.ok) {
    return await response.text();
  }
  console.error("Couldn't get vertex shader source");
};
const getFragmentShaderSource = async () => {
  const response = await fetch(`${URL}/fragmentshader.glsl`);
  if (response.ok) {
    return await response.text();
  }
  console.error("Couldn't get fragment shader source");
};
const initializeDefaultShaderProgram = async (gl) => {
  const vertexShaderSource = await getVertexShaderSource();
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);

  const fragmentShaderSource = await getFragmentShaderSource();
  const fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource
  );

  const program = createProgram(gl, vertexShader, fragmentShader);
  if (program) {
    return program;
  }
  console.error("Error initializing default shader program");
};
const resizeCanvasIfNeeded = (canvas) => {
  const displayWidth = canvas.clientWidth;
  const displayHeight = canvas.clientHeight;
  const needResize =
    displayWidth !== canvas.width || displayHeight !== canvas.height;
  if (needResize) {
    canvas.width = displayWidth;
    canvas.height = displayHeight;
  }
};
const drawTriangle = (
  gl,
  positionBuffer,
  colorBuffer,
  vertices,
  color,
  program
) => {
  gl.useProgram(program);

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color), gl.STATIC_DRAW);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
};
main();
