import { useState, useEffect, useRef, useCallback } from 'react'
import { GridHelper } from 'three'

const MODEL_DATA = {
  LogPiece01: {
    file: 'models/LogPiece01.glb',
    name: 'Log Piece 01',
    id: 'unkown',
    species: 'Betula',
    dimensions: 'Large',
    process: 'Pending...',
    status: 'Stock',
  },
    birch01: {
    file: 'models/birch01.glb',
    name: 'Birch01',
    id: 'Pending...',
    species: 'Betula',
    dimensions: '1000x32x8',
    process: 'Pending...',
    status: 'Pending',
  },
    birch02: {
    file: 'models/birch02.glb',
    name: 'Birch02',
    id: 'Pending...',
    species: 'Betula',
    dimensions: 'Pending...',
    process: 'Pending...',
    status: 'Pending',
  },
  birch03: {
    file: 'models/birch03.glb',
    name: 'Birch03',
    id: 'Pending...',
    species: 'Betula',
    dimensions: 'Pending...',
    process: 'Pending...',
    status: 'Success',
  },
  birch04: {
    file: 'models/birch04.glb',
    name: 'Birch04',
    id: 'B_1000328_0306_01',
    species: 'Betula',
    dimensions: '1000 x 32 x 8 mm',
    process: 'Steamed 30 min | Dried 72h',
    status: 'Success',
  },
  birch05: {
    file: 'models/birch05.glb',
    name: 'Birch05',
    id: 'B_1000328_0306_01',
    species: 'Betula',
    dimensions: '1000 x 32 x 8 mm',
    process: 'Steamed 30 min | Dried 72h',
    status: 'Success',
  },
  birch06: {
    file: 'models/birch06.glb',
    name: 'Birch06',
    id: 'B_1000328_0306_01',
    species: 'Betula',
    dimensions: '1000 x 32 x 8 mm',
    process: 'Steamed 30 min | Dried 72h',
    status: 'Success',
  },
  birch07: {
    file: 'models/birch07.glb',
    name: 'Birch07',
    id: 'B_1000328_0306_01',
    species: 'Betula',
    dimensions: '1000 x 32 x 8 mm',
    process: 'Steamed 30 min | Dried 72h',
    status: 'Success',
  },
  pine01: {
    file: 'models/pine01.glb',
    name: 'Pine01',
    id: 'Pending...',
    species: 'Pinus',
    dimensions: '1000 x 21 x 21 mm',
    process: 'Steamed 60 min | Dried 2h',
    status: 'Failed',
  },
  pine02: {
    file: 'models/pine02.glb',
    name: 'Pine02',
    id: 'Pending...',
    species: 'Pinus',
    dimensions: '1000 x 69 x 8 mm',
    process: 'Steamed 30 min | Dried 24h',
    status: 'Success',
  },
  pine03: {
    file: 'models/pine03.glb',
    name: 'Pine03',
    id: 'Pending...',
    species: 'Pinus',
    dimensions: '1000 x 69 x 8 mm',
    process: 'Steamed 30 min | Dried 24h',
    status: 'Success',
  },
  pine04: {
    file: 'models/pine04.glb',
    name: 'Pine04',
    id: 'Pending...',
    species: 'Pinus',
    dimensions: '1000 x 32 x 8 mm',
    process: 'Steamed 30 min | Dried 24h',
    status: 'Success',
  },
  pine05: {
    file: 'models/pine05.glb',
    name: 'Pine05',
    id: 'Pending...',
    species: 'Pinus',
    dimensions: 'Pending...',
    process: 'Pending...',
    status: 'Failed',
  },
  pine06: {
    file: 'models/pine06.glb',
    name: 'Pine06',
    id: 'Pending...',
    species: 'Pinus',
    dimensions: 'Pending...',
    process: 'Pending...',
    status: 'Succeess',
  },
  pine07: {
    file: 'models/pine07.glb',
    name: 'Pine07',
    id: 'Pending...',
    species: 'Pinus',
    dimensions: 'Pending...',
    process: 'Pending...',
    status: 'Succeess',
  },
  pine08: {
    file: 'models/pine08.glb',
    name: 'Pine08',
    id: 'Pending...',
    species: 'Pinus',
    dimensions: 'Pending...',
    process: 'Pending...',
    status: 'Succeess',
  },
  pine09: {
    file: 'models/pine09.glb',
    name: 'Pine09',
    id: 'Pending...',
    species: 'Pinus',
    dimensions: 'Pending...',
    process: 'Pending...',
    status: 'Succeess',
  }
}

const MODEL_KEYS = Object.keys(MODEL_DATA)
const TRIPLE_KEYS = [...MODEL_KEYS, ...MODEL_KEYS, ...MODEL_KEYS]

export default function App() {
  const [activeModel, setActiveModel] = useState(null)
  const [currentSrc, setCurrentSrc] = useState('models/LogPiece01.glb')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [specExpanded, setSpecExpanded] = useState(false)
  const viewerRef = useRef(null)
  const listRef = useRef(null)
  const drag = useRef({ active: false, startY: 0, scrollTop: 0, moved: false })

  function loadModel(modelKey) {
    const data = MODEL_DATA[modelKey]
    if (!data) return
    setCurrentSrc(data.file)
    setActiveModel(data)
    setDrawerOpen(false)
    window.location.hash = modelKey
  }

  // Infinite loop: start in the middle copy, silently jump when near edges
  useEffect(() => {
    const el = listRef.current
    if (!el) return
    const oneThird = el.scrollHeight / 3
    el.scrollTop = oneThird

    function handleScroll() {
      const h = el.scrollHeight / 3
      if (el.scrollTop < h * 0.5) el.scrollTop += h
      else if (el.scrollTop >= h * 2) el.scrollTop -= h
    }
    el.addEventListener('scroll', handleScroll)
    return () => el.removeEventListener('scroll', handleScroll)
  }, [])

  const onMouseDown = useCallback((e) => {
    drag.current = { active: true, startY: e.clientY, scrollTop: listRef.current.scrollTop, moved: false }
    listRef.current.style.cursor = 'grabbing'
    e.preventDefault()
  }, [])

  const onMouseMove = useCallback((e) => {
    if (!drag.current.active) return
    const dy = e.clientY - drag.current.startY
    if (Math.abs(dy) > 4) drag.current.moved = true
    listRef.current.scrollTop = drag.current.scrollTop - dy
  }, [])

  const onMouseUp = useCallback(() => {
    drag.current.active = false
    if (listRef.current) listRef.current.style.cursor = 'grab'
  }, [])

  // Auto-load model from URL hash (QR code deep-link support)
  useEffect(() => {
    const hash = window.location.hash.substring(1)
    if (hash && MODEL_DATA[hash]) loadModel(hash)
  }, [])

  // Dimension hotspot calculator — re-attaches on every model load event
  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer) return

    function handleLoad() {
      const center = viewer.getBoundingBoxCenter()
      const size = viewer.getDimensions()

      // Inject a Three.js GridHelper into the ModelScene.
      // model-viewer offsets the model via target.position so its bounding-box
      // centre lands at world (0,0,0). Grid lives in world space.
      const sceneSymbol = Object.getOwnPropertySymbols(viewer)
        .find(s => s.description === 'scene')
      const modelScene = sceneSymbol ? viewer[sceneSymbol] : null
      if (modelScene) {
        // model-viewer sets camera.far = 2 * farRadius() based on the model bounding sphere.
        // For small models this is only a few metres, clipping the grid almost immediately.
        // Override farRadius() on this scene instance to enforce a large minimum.
        const GRID_FAR_RADIUS = 200
        if (!modelScene._gridFarPatched) {
          const _origFarRadius = modelScene.farRadius.bind(modelScene)
          modelScene.farRadius = () => Math.max(_origFarRadius(), GRID_FAR_RADIUS)
          modelScene._gridFarPatched = true
        }
        // Force camera far plane update immediately — otherwise it only recalculates
        // on the next orbit interaction, leaving the first load with the old small value.
        modelScene.camera.far = GRID_FAR_RADIUS * 2
        modelScene.camera.updateProjectionMatrix()

        const old = modelScene.getObjectByName('floor-grid')
        if (old) modelScene.remove(old)
        const cellSize = Math.max(size.x, size.z) / 5  // ~5 cells per model length
        const span = GRID_FAR_RADIUS * 4                // fill the full far distance
        const divisions = Math.round(span / cellSize)
        const grid = new GridHelper(span, divisions, 0xaaaaaa, 0xdddddd)
        grid.name = 'floor-grid'
        grid.position.y = -size.y / 2   // place at model base in world space
        grid.raycast = () => {}          // prevent grid from intercepting orbit-control raycasts
        modelScene.add(grid)
      }

      const pad = 0.15

      viewer.querySelector('[slot="hotspot-x"]').textContent = `W: ${size.x.toFixed(2)}m`
      viewer.querySelector('[slot="hotspot-y"]').textContent = `H: ${size.y.toFixed(2)}m`
      viewer.querySelector('[slot="hotspot-z"]').textContent = `D: ${size.z.toFixed(2)}m`

      viewer.updateHotspot({
        name: 'hotspot-x',
        position: `${center.x} ${center.y - size.y / 2 - pad} ${center.z + size.z / 2 + pad}`,
      })
      viewer.updateHotspot({
        name: 'hotspot-y',
        position: `${center.x + size.x / 2 + pad} ${center.y} ${center.z + size.z / 2 + pad}`,
      })
      viewer.updateHotspot({
        name: 'hotspot-z',
        position: `${center.x + size.x / 2 + pad} ${center.y - size.y / 2} ${center.z - pad}`,
      })
    }

    viewer.addEventListener('load', handleLoad)
    return () => viewer.removeEventListener('load', handleLoad)
  }, [])

  return (
    <>
      <div id="sidebar" className={drawerOpen ? 'drawer-open' : ''}>
        <div id="sidebar-header" onClick={() => setDrawerOpen(o => !o)}>Models</div>
        <div
          id="sidebar-list"
          ref={listRef}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
        >
          {TRIPLE_KEYS.map((key, i) => (
            <a key={i} className="model-link" onClick={(e) => { if (drag.current.moved) { e.preventDefault(); return } loadModel(key) }}>
              <img className="model-thumb" src={`thumbnails/${key}.png`} alt="" onError={(e) => { e.target.style.display = 'none' }} />
              {MODEL_DATA[key].name}
            </a>
          ))}
        </div>
      </div>

      <model-viewer
        ref={viewerRef}
        id="viewer"
        src={currentSrc}
        camera-controls=""
        auto-rotate=""
        shadow-intensity="0"
        ar=""
        ar-modes="webxr scene-viewer quick-look"
        ar-scale="auto"
      >
        <button slot="hotspot-x" className="dim-label" data-position="0 0 0">Width</button>
        <button slot="hotspot-y" className="dim-label" data-position="0 0 0">Height</button>
        <button slot="hotspot-z" className="dim-label" data-position="0 0 0">Depth</button>
      </model-viewer>

      {activeModel && (
        <div
          id="spec-card"
          className={specExpanded ? '' : 'spec-collapsed'}
          onClick={() => setSpecExpanded(e => !e)}
        >
          <div className="spec-title">{activeModel.name}</div>
          <div className="spec-meta">ID: {activeModel.id}</div>
          <div className="spec-details">
            <div className="spec-detail"><b>Species:</b> <span>{activeModel.species}</span></div>
            <div className="spec-detail"><b>Stock Dim:</b> <span>{activeModel.dimensions}</span></div>
            <div className="spec-detail"><b>Process:</b> <span>{activeModel.process}</span></div>
            <div className="spec-detail">
              <b>Result:</b>{' '}
              <span className={activeModel.status === 'Success' ? 'spec-success' : ''}>
                {activeModel.status}
              </span>
            </div>
          </div>
          <div className="spec-chevron" />
        </div>
      )}
    </>
  )
}
