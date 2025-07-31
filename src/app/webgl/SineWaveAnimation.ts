import cloneDeep from 'lodash/cloneDeep';
import { createShader } from './webgl-utils';

import fragmentSine from './shaders/fragment_sine.glsl';
import vertexSine from './shaders/vertex_sine.glsl';

export type WaveConfig = {
    baseAmplitude: number;
    wavelength: number;
    baseSpeed: number;
};

export class SineWave {
    private waveConfig: WaveConfig;
    private vertices: number[];
    private speed: number;
    private amplitude: number;
    private program: WebGLProgram;
    private vertexBuffer: WebGLBuffer;

    private amplitudeLoc: WebGLUniformLocation;
    private wavelengthLoc: WebGLUniformLocation;
    private timeLoc: WebGLUniformLocation;
    private speedLoc: WebGLUniformLocation;

    private canvasWidthLoc: WebGLUniformLocation;
    private canvasHeightLoc: WebGLUniformLocation;
    private time = 0;

    constructor(
        private readonly ctx: WebGL2RenderingContext,
        private readonly canvas: HTMLCanvasElement,
        waveConfig: WaveConfig,
    ) {
        this.waveConfig = cloneDeep(waveConfig);

        const vertexShader = createShader(ctx, ctx.VERTEX_SHADER, vertexSine);
        const fragmentShader = createShader(ctx, ctx.FRAGMENT_SHADER, fragmentSine);

        this.program = ctx.createProgram()!;
        ctx.attachShader(this.program, vertexShader);
        ctx.attachShader(this.program, fragmentShader);
        ctx.linkProgram(this.program);

        if (!ctx.getProgramParameter(this.program, ctx.LINK_STATUS)) {
            throw new Error(`Program error: ${ctx.getProgramInfoLog(this.program)}`);
        }

        ctx.useProgram(this.program);

        // Create VAO for better vertex attribute management
        const vao = ctx.createVertexArray();
        ctx.bindVertexArray(vao);

        this.vertices = [];
        for (let x = 0; x < canvas.width; x++) {
            this.vertices.push(x, 0);
        }

        this.vertexBuffer = ctx.createBuffer()!;
        ctx.bindBuffer(ctx.ARRAY_BUFFER, this.vertexBuffer);
        ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array(this.vertices), ctx.STATIC_DRAW);

        const positionAttributeLocation = ctx.getAttribLocation(this.program, 'position');
        ctx.enableVertexAttribArray(positionAttributeLocation);
        ctx.vertexAttribPointer(positionAttributeLocation, 2, ctx.FLOAT, false, 0, 0);

        this.amplitudeLoc = ctx.getUniformLocation(this.program, 'amplitude')!;
        this.wavelengthLoc = ctx.getUniformLocation(this.program, 'wavelength')!;
        this.timeLoc = ctx.getUniformLocation(this.program, 'time')!;
        this.speedLoc = ctx.getUniformLocation(this.program, 'speed')!;

        this.canvasWidthLoc = ctx.getUniformLocation(this.program, 'canvas_width')!;
        this.canvasHeightLoc = ctx.getUniformLocation(this.program, 'canvas_height')!;

        this.speed = this.waveConfig.baseSpeed;
        this.amplitude = this.waveConfig.baseAmplitude;

        ctx.uniform1f(this.wavelengthLoc, this.waveConfig.wavelength);

        ctx.uniform1f(this.canvasWidthLoc, canvas.width);
        ctx.uniform1f(this.canvasHeightLoc, canvas.height);
    }

    public resize() {
        this.ctx.useProgram(this.program);
        this.ctx.uniform1f(this.canvasWidthLoc, this.canvas.width);
        this.ctx.uniform1f(this.canvasHeightLoc, this.canvas.height);

        // Regenerate vertices for new canvas width
        this.vertices = [];
        for (let x = 0; x < this.canvas.width; x++) {
            this.vertices.push(x, 0);
        }

        // Update existing vertex buffer with new data
        this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.vertexBuffer);
        this.ctx.bufferData(this.ctx.ARRAY_BUFFER, new Float32Array(this.vertices), this.ctx.STATIC_DRAW);

        const positionAttributeLocation = this.ctx.getAttribLocation(this.program, 'position');
        this.ctx.enableVertexAttribArray(positionAttributeLocation);
        this.ctx.vertexAttribPointer(positionAttributeLocation, 2, this.ctx.FLOAT, false, 0, 0);

        // Update WebGL viewport
        this.ctx.viewport(0, 0, this.canvas.width, this.canvas.height);
    }

    public changeSpeed(delta: number) {
        this.speed += delta;
    }

    public changeAmplitude(delta: number) {
        this.amplitude += delta;
    }

    public render(/* time: number */) {
        // Clear the canvas
        this.ctx.clearColor(0.0, 0.0, 0.0, 1.0); // Black background
        this.ctx.clear(this.ctx.COLOR_BUFFER_BIT);

        // Use the shader program
        this.ctx.useProgram(this.program);

        this.ctx.uniform1f(this.timeLoc, performance.now() * 0.001);
        this.ctx.uniform1f(this.speedLoc, this.speed);
        this.ctx.uniform1f(this.amplitudeLoc, this.amplitude);

        // Draw the wave
        this.ctx.drawArrays(this.ctx.LINE_STRIP, 0, this.vertices.length / 2);
    }
}
