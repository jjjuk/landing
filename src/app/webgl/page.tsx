'use client';
import { useEffect, useRef, useState } from 'react';
import { SineWave } from './SineWaveAnimation';

const resizeCanvas = (canvas: HTMLCanvasElement) => {
    const dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
};

export default function WebGL() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('webgl2');

        if (!ctx) {
            console.error('WebGL2 not supported');
            return;
        }

        const wave = new SineWave(ctx, canvas, {
            baseSpeed: 200,
            baseAmplitude: 100,
            wavelength: 400,
        });

        const resize = () => {
            resizeCanvas(canvas);
            wave.resize();
        };

        resize();

        window.addEventListener('resize', resize);

        let animationId: number;
        const animate = () => {
            wave.render();
            animationId = requestAnimationFrame(animate);
        };
        animationId = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('resize', resize);
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                display: 'block',
                zIndex: 1,
            }}
        />
    );
}
