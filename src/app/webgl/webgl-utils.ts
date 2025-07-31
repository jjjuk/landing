import { PathLike } from 'node:fs';

/**
 *
 * @param x number to normalize
 * @param max max in range
 * @param min min in range (default: 0)
 */
export const normalize = (x: number, max: number, min = 0) => ((x - min) / (max - min)) * 2 - 1;

/**
 *
 * @param ctx WebGl context
 * @param type shader type
 * @param source path to shader
 * @returns
 */
export function createShader(ctx: WebGL2RenderingContext, type: GLenum, source: string) {
    const shader = ctx.createShader(type)!;
    ctx.shaderSource(shader, source);
    ctx.compileShader(shader);
    if (!ctx.getShaderParameter(shader, ctx.COMPILE_STATUS)) {
        throw new Error(`Shader error: ${ctx.getShaderInfoLog(shader)}`);
    }
    return shader;
}
