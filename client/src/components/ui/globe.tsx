"use client"

import { useEffect, useRef, useState } from "react"
import { useSpring } from "react-spring"
import createGlobe from "cobe"
import clsx from "clsx"

function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)

  return [r / 255, g / 255, b / 255]
}

interface Marker {
  location: [number, number]
  size: number
}

interface GlobeProps {
  className?: string
  scale?: number
  dark?: boolean
  baseColor?: string
  glowColor?: string
  markerColor?: string
  offsetX?: number
  offsetY?: number
  speed?: number
  opacity?: number
  brightness?: number
  markers?: Marker[]
}

export function Globe({
  className,
  scale = 1,
  dark = false,
  baseColor = "#FFFFFF",
  glowColor = "#FFFFFF",
  markerColor = "#00FFFF",
  offsetX = 0,
  offsetY = 0,
  speed = 0.0025,
  opacity = 1,
  brightness = 1,
  markers = [
    { location: [40.7128, -74.006], size: 0.05 },
    { location: [34.052235, -118.243683], size: 0.05 },
    { location: [59.9375, 30.308611], size: 0.05 },
    { location: [37.773972, -122.431297], size: 0.05 },
    { location: [51.509865, -0.118092], size: 0.05 },
  ],
}: GlobeProps) {
  let phi = 0
  let width = 0

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const pointerInteracting = useRef<number | null>(null)
  const pointerInteractionMovement = useRef(0)

  const [{ r }, api] = useSpring(() => ({
    r: 0,
    config: {
      mass: 1,
      tension: 280,
      friction: 40,
      precision: 0.001,
    },
  }))

  const [isGrabbing, setIsGrabbing] = useState(false)

  function onPointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    pointerInteracting.current = e.clientX - pointerInteractionMovement.current
    setIsGrabbing(true)
  }

  function onPointerUp() {
    pointerInteracting.current = null
    setIsGrabbing(false)
  }

  function onPointerOut() {
    pointerInteracting.current = null
    setIsGrabbing(false)
  }

  function onMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    if (pointerInteracting.current !== null) {
      const delta = e.clientX - pointerInteracting.current

      pointerInteractionMovement.current = delta
      api.start({ r: delta / 200 })
    }
  }

  function onTouchMove(e: React.TouchEvent<HTMLCanvasElement>) {
    if (pointerInteracting.current !== null && e.touches[0]) {
      const delta = e.touches[0].clientX - pointerInteracting.current

      pointerInteractionMovement.current = delta
      api.set({ r: delta / 100 })
    }
  }

  const setWidth = () => {
    if (canvasRef.current) {
      width = canvasRef.current.offsetWidth
    }
  }

  useEffect(() => {
    window.addEventListener("resize", setWidth)
    setWidth()

    const globe = createGlobe(canvasRef.current!, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      scale: scale,
      mapBrightness: brightness,
      dark: dark as any,
      baseColor: hexToRgb(baseColor),
      markerColor: hexToRgb(markerColor),
      glowColor: hexToRgb(glowColor),
      opacity: opacity,
      offset: [offsetX, offsetY],
      markers: markers,
      phi: 0,
      theta: 0.3,
      diffuse: 0.4,
      mapSamples: 16000,
      onRender: (state) => {
        if (!pointerInteracting.current) {
          phi += speed
        }

        state.phi = phi + r.get()
        state.width = width * 2
        state.height = width * 2
      },
    })

    return () => globe.destroy()
  }, [scale, brightness, dark, baseColor, markerColor, glowColor, opacity, offsetX, offsetY, markers, speed, r])

  return (
    <div className={clsx("absolute inset-0 aspect-square", className)}>
      <canvas
        className={clsx("h-full w-full", isGrabbing ? "cursor-grabbing" : "cursor-grab")}
        ref={canvasRef}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerOut={onPointerOut}
        onMouseMove={onMouseMove}
        onTouchMove={onTouchMove}
      />
    </div>
  )
}
