/**
 * uses the @metamast/logo package to provide the core code.
 * sometimes it's a bit sticky.
 * The underlying code does a bunch of raw DOM manipulation so makes React a bit funny.
 * see https://github.com/MetaMask/logo
 *
 * use <Fox followMouse slowDrift />
 */

import { useRef, useEffect, useMemo, useState } from 'react'
import makeFox from '@metamask/logo'
import foxModel from "./fox2.json"




const Fox = ({ pxNotRatio = true, width, height, followMouse, slowDrift = false, followMotion = false, position = { x: 100, y: 100 } }) => {
  const containerRef = useRef(null)

  const viewer = useMemo(() => makeFox({ meshJson: foxModel, verticalFieldOfView: Math.PI / 37.5, near: 100, far: 340, pxNotRatio, width, height, followMouse, slowDrift }), [
    pxNotRatio,
    width,
    height,
    followMouse,
    followMotion,
    slowDrift
  ])

  useEffect(() => {
    if (!containerRef.current) return

    containerRef.current.appendChild(viewer.container)
    viewer.lookAt({ x: 0.3, y: 0.5 })

    return () => {
      viewer.stopAnimation()
      containerRef.current.removeChild(viewer.container)
    }
  }, [viewer, containerRef])
  try {
    document.body.removeChild(viewer.container)

  } catch (e) {
    // console.log('ha?')    
  }

  useEffect(() => {
    viewer.lookAtAndRender(position);
  }, [position])
  return <div ref={containerRef} />
}

export default Fox