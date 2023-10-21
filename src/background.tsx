import {Component, onMount, onCleanup} from "solid-js";

import {MPF, scroll} from "./util";

import styles from "./background.module.css";

import VERT_SRC from "./shader/bg.vert?raw";
import FRAG_SRC from "./shader/bg.frag?raw";

const TARGET_SIZE = [1920, 1024];
const VERTICES = new Float32Array([
  -1.0, 1.0,
  -1.0, -1.0,
  1.0, 1.0,
  1.0, -1.0
]);

export const Background: Component = () => {
  let canvas: HTMLCanvasElement | undefined = undefined;
  let gl: WebGL2RenderingContext;
  let prog: WebGLProgram;
  let buf: WebGLBuffer;

  const resize = () => {
    canvas!.width = window.innerWidth;
    canvas!.height = window.innerHeight;
  };

  onMount(() => {
    resize();
    window.addEventListener("resize", resize);

    gl = canvas!.getContext("webgl2")!;
    prog = createProgram();
    buf = createVertexBuffer();

    handle = requestAnimationFrame(frame);
  });

  onCleanup(() => {
    cancelAnimationFrame(handle);
    window.removeEventListener("resize", resize);
  });

  let handle: number;
  let time = 0;
  let acc = 0;
  function frame(timestamp: number) {
    const delta = timestamp - time;
    acc += delta;
    time = timestamp;
    if (acc > MPF) {
      acc -= MPF;
      render(MPF);
    }

    handle = requestAnimationFrame(frame);
  }
  function render(_delta: number) {
    gl.viewport(0, 0, canvas!.width, canvas!.height);
    gl.useProgram(prog);

    const uTime = gl.getUniformLocation(prog, "time");
    const uScroll = gl.getUniformLocation(prog, "scroll");
    const uScreen = gl.getUniformLocation(prog, "screen");
    gl.uniform1f(uTime, time);
    gl.uniform1f(uScroll, scroll());
    gl.uniform2fv(uScreen, [
      canvas!.width / TARGET_SIZE[0],
      canvas!.height / TARGET_SIZE[1]
    ]);

    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    const aVBuf = gl.getAttribLocation(prog, "pos");
    gl.enableVertexAttribArray(aVBuf);
    gl.vertexAttribPointer(
      aVBuf,
      2,
      gl.FLOAT,
      false,
      0,
      0
    );

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, VERTICES.length / 2);
  }

  function createProgram(): WebGLProgram {
    const prog = gl.createProgram()!;

    const vert = compileShader(gl.VERTEX_SHADER, VERT_SRC);
    const frag = compileShader(gl.FRAGMENT_SHADER, FRAG_SRC);

    gl.attachShader(prog, vert);
    gl.attachShader(prog, frag);
    gl.linkProgram(prog);

    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      const msg = `Error linking program: ${gl.getProgramInfoLog(prog)}`;
      gl.deleteProgram(prog);
      throw new Error(msg);
    }

    return prog;
  }

  function compileShader(type: number, src: string): WebGLShader {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, src);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const type_str = type === gl.VERTEX_SHADER ? "vertex" : "fragment";
      const msg = `Error compiling ${type_str} shader: ${gl.getShaderInfoLog(shader)}`;
      gl.deleteShader(shader);
      throw new Error(msg);
    }

    return shader;
  }

  function createVertexBuffer(): WebGLBuffer {
    const buf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, VERTICES, gl.STATIC_DRAW);
    return buf;
  }

  return <div class={styles.background}>
    <canvas ref={canvas}/>
  </div>;
};
