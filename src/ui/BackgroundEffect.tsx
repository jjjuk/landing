'use client'
import React, { useRef, useEffect, useCallback } from 'react'

// Color palettes for waves - moved outside component
const palettes = {
  light: [
    '#faebd7',
    '#f5e3ce',
    '#f3e0c7',
    '#f7e8d6',
    '#f1dbc0',
    '#f8e6d2',
    '#f6e2c9',
    '#f2d7b8',
  ],
  dark: [
    '#2c2320',
    '#3a2e29',
    '#44342e',
    '#382a25',
    '#211a17',
    '#33251f',
    '#3d2c27',
    '#1a1412',
  ],
}

// Physics constants for realistic wave behavior
const PHYSICS_CONFIG = {
  // X-axis movement (leftward acceleration)
  BASE_LEFTWARD_ACCELERATION: 0.001337, // Constant leftward acceleration
  MAX_X_ACCELERATION: 0.15, // Cap for very fast mouse movements
  X_FRICTION: 0.98, // Natural deceleration when mouse stops
  X_RETURN_FORCE: 0.005, // Pull back to base speed
  X_SENSITIVITY: 0.3, // How responsive to mouse X movement

  // Y-axis stretching (amplitude modulation)
  MAX_Y_STRETCH: 0.5, // Cap for very fast Y movements
  Y_FRICTION: 0.92, // Stretch decay rate
  Y_SENSITIVITY: 0.3, // How responsive to mouse Y movement

  // Wave weight and momentum
  WAVE_MASS: 0.85, // Heavier waves feel more realistic
  MOMENTUM_TRANSFER: 0.25, // How much mouse movement transfers to waves
}

// Calming morphing waves background effect with realistic physics
export function BackgroundEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)
  const mouse = useRef({ x: 0.5, y: 0.5 })
  const lastMouse = useRef({ x: 0.5, y: 0.5 })
  const mouseVelocity = useRef({ x: 0, y: 0 })

  // Physics state for realistic wave behavior
  const waveVelocity = useRef(0) // Current leftward velocity
  const waveAcceleration = useRef(0) // Current acceleration
  const stretchVelocity = useRef(0) // Current Y-axis stretch velocity
  const stretchAmount = useRef(0) // Current stretch amount
  const waveXOffset = useRef(0) // Accumulated X-axis offset for horizontal movement

  const rectRef = useRef<DOMRect | null>(null)
  const lastFrameTime = useRef(0)

  // Move updateRect to component level so both useEffects can access it
  const updateRect = useCallback(() => {
    if (canvasRef.current) {
      rectRef.current = canvasRef.current.getBoundingClientRect()
    }
  }, [])

  useEffect(() => {
    let rafId: number | null = null

    function handleMove(e: MouseEvent) {
      if (rafId) return // Skip if already scheduled

      rafId = requestAnimationFrame(() => {
        if (!canvasRef.current || !rectRef.current) return

        const rect = rectRef.current
        const newX = (e.clientX - rect.left) / rect.width
        const newY = (e.clientY - rect.top) / rect.height

        // Calculate mouse velocity with time-based smoothing
        const currentTime = performance.now()
        const deltaTime =
          Math.max(currentTime - lastFrameTime.current, 1) / 16.67 // Normalize to 60fps
        lastFrameTime.current = currentTime

        const dx = (newX - mouse.current.x) / deltaTime
        const dy = (newY - mouse.current.y) / deltaTime

        // Smooth velocity calculation with momentum
        mouseVelocity.current.x = mouseVelocity.current.x * 0.7 + dx * 0.3
        mouseVelocity.current.y = mouseVelocity.current.y * 0.7 + dy * 0.3

        // Update mouse position
        lastMouse.current.x = mouse.current.x
        lastMouse.current.y = mouse.current.y
        mouse.current.x = newX
        mouse.current.y = newY

        // Apply X-axis acceleration (leftward movement)
        // Any X mouse movement should accelerate waves leftward
        const xImpulse =
          -Math.abs(mouseVelocity.current.x) * PHYSICS_CONFIG.X_SENSITIVITY
        const cappedXImpulse = Math.max(
          xImpulse,
          -PHYSICS_CONFIG.MAX_X_ACCELERATION
        )
        waveAcceleration.current +=
          cappedXImpulse * PHYSICS_CONFIG.MOMENTUM_TRANSFER

        // Apply Y-axis stretch (both directions)
        const yImpulse = mouseVelocity.current.y * PHYSICS_CONFIG.Y_SENSITIVITY
        const cappedYImpulse = Math.max(
          -PHYSICS_CONFIG.MAX_Y_STRETCH,
          Math.min(PHYSICS_CONFIG.MAX_Y_STRETCH, yImpulse)
        )
        stretchVelocity.current +=
          cappedYImpulse * PHYSICS_CONFIG.MOMENTUM_TRANSFER

        rafId = null
      })
    }

    updateRect()
    window.addEventListener('mousemove', handleMove)
    window.addEventListener('resize', updateRect)

    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('resize', updateRect)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [updateRect])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    let width = window.innerWidth
    let height = window.innerHeight
    let isVisible = true

    function handleVisibilityChange() {
      isVisible = !document.hidden
      if (isVisible && !animationRef.current) {
        animate()
      }
    }

    function resize() {
      if (!canvas) return
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = '100vw'
      canvas.style.height = '100vh'
      canvas.style.left = '0'
      canvas.style.top = '0'
      canvas.style.position = 'fixed'
      if (ctx) {
        ctx.setTransform(1, 0, 0, 1, 0, 0) // reset
        ctx.scale(dpr, dpr)
      }
      updateRect()
    }

    resize()
    window.addEventListener('resize', resize)

    let isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    let palette = isDark ? palettes.dark : palettes.light
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    mql.addEventListener('change', (e) => {
      isDark = e.matches
      palette = isDark ? palettes.dark : palettes.light
    })

    // Wave parameters
    const waveCount = palette.length
    const baseAmplitude = () => (isDark ? 35 : 42)
    const baseSpeed = () => (isDark ? 0.3 : 0.22)
    const baseYOffset = () => (isDark ? 0.2 : 0.25)

    function drawWave(
      color: string,
      i: number,
      t: number,
      wavePhaseSpeed: number,
      stretchFactor: number,
      xOffset: number
    ) {
      if (!ctx) return

      ctx.save()
      ctx.beginPath()

      // Calculate wave properties with physics-based modifications
      const baseAmp = baseAmplitude()
      const amplitude =
        baseAmp +
        i * 18 +
        Math.sin(t / 2.5 + i) * 10 +
        Math.abs(stretchFactor) * (60 - i * 3) // Y-stretch affects amplitude

      const waveSpeed = wavePhaseSpeed + i * 0.08
      const yOffset =
        height * (baseYOffset() + i * 0.12) +
        Math.sin(t / 3 + i) * 12 +
        stretchFactor * (40 - i * 2) // Y-stretch affects vertical position

      // Mouse Y influence for additional stretch
      const mouseYInfluence = (mouse.current.y - 0.5) * 60 * (1 + i * 0.15)

      // Diagonal slope for natural wave flow
      const slope = (0.4 * height) / width

      const points = 24 // Slightly more points for smoother curves
      const step = width / points

      for (let j = 0; j <= points; j++) {
        const x = j * step
        const px = x / width

        // Enhanced phase calculation with realistic wave physics and X-offset
        const phase =
          t * waveSpeed - i * 1.5 + px * 5 + Math.sin(t / 4 + i * 2.2) * 0.8 + 
          xOffset * (1 + i * 0.1) // Apply X-offset with slight variation per wave layer

        const y =
          yOffset +
          Math.sin(phase + px * 7 + Math.cos(t / 2.8 + i)) * amplitude +
          mouseYInfluence * Math.sin(px * Math.PI * 1.2) +
          px * slope * width // diagonal flow

        if (j === 0) {
          ctx.moveTo(x, y)
        } else if (j === 1) {
          ctx.lineTo(x, y)
        } else {
          // Smooth curves using quadratic bezier
          const prevX = (j - 1) * step
          const cpX = (prevX + x) / 2
          const cpY = y + Math.sin(phase * 0.5) * (amplitude * 0.1) // Slight curve variation
          ctx.quadraticCurveTo(cpX, cpY, x, y)
        }
      }

      // Close the wave shape
      ctx.lineTo(width, height)
      ctx.lineTo(0, height)
      ctx.closePath()

      // Enhanced visual styling
      ctx.fillStyle = color
      const baseAlpha = isDark ? 0.25 : 0.2
      // const alphaVariation = 0.8 + 0.2 * Math.cos(i + t * 0.1)
      ctx.globalAlpha = baseAlpha /* * alphaVariation */
      ctx.fill()
      ctx.globalAlpha = 1
      ctx.restore()
    }

    function animate() {
      if (!canvas || !isVisible) return

      ctx!.clearRect(0, 0, canvas.width, canvas.height)

      // Fill background
      ctx!.fillStyle = palette[0]
      ctx!.fillRect(0, 0, canvas.width, canvas.height)

      const t = performance.now() / 1400 // Slightly slower for more calming effect

      // Physics simulation for realistic wave behavior

      // Add constant leftward acceleration for continuous movement
      waveAcceleration.current -= PHYSICS_CONFIG.BASE_LEFTWARD_ACCELERATION

      // X-axis physics (leftward movement with weight)
      waveVelocity.current += waveAcceleration.current
      waveVelocity.current *= PHYSICS_CONFIG.X_FRICTION // Natural friction
      waveAcceleration.current *= PHYSICS_CONFIG.WAVE_MASS // Wave mass affects acceleration decay

      // Return force to base speed (like a spring)
      const baseSpeedTarget = baseSpeed()
      const returnForce =
        (baseSpeedTarget - waveVelocity.current) * PHYSICS_CONFIG.X_RETURN_FORCE
      waveVelocity.current += returnForce

      // Y-axis physics (stretching with momentum)
      stretchAmount.current += stretchVelocity.current
      stretchVelocity.current *= PHYSICS_CONFIG.Y_FRICTION // Stretch decay
      stretchAmount.current *= 0.95 // Gradual return to neutral

      // Update X-axis offset for horizontal movement
      waveXOffset.current += waveVelocity.current * 0.016 // Convert to frame-based movement

      // Calculate final wave parameters
      const finalPhaseSpeed = Math.max(0.1, waveVelocity.current) // Prevent negative/zero speed
      const finalStretch = stretchAmount.current
      const finalXOffset = waveXOffset.current

      // Draw all waves with physics-based parameters
      for (let i = 0; i < waveCount; i++) {
        drawWave(palette[i], i, t, finalPhaseSpeed, finalStretch, finalXOffset)
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    animate()

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('resize', resize)
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [updateRect])

  return (
    <canvas
      ref={canvasRef}
      style={{
        pointerEvents: 'none',
        position: 'fixed',
        left: 0,
        top: 0,
        width: '100vw',
        height: '100vh',
        minWidth: '100vw',
        minHeight: '100vh',
        zIndex: -10,
        display: 'block',
        background: 'transparent',
      }}
      aria-hidden
    />
  )
}