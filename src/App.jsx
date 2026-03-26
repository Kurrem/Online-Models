import { useState, useEffect, useRef } from 'react'

const MODEL_DATA = {
  LogPiece01: {
    file: 'models/LogPiece01.glb',
    name: 'Log Piece 01',
    id: 'Pending...',
    species: 'Unknown',
    dimensions: 'Pending...',
    process: 'Pending...',
    status: 'Pending',
  },
    birch01: {
    file: 'models/birch01.glb',
    name: 'Birch 03',
    id: 'Pending...',
    species: 'Betula',
    dimensions: 'Pending...',
    process: 'Pending...',
    status: 'Pending',
  },
    birch02: {
    file: 'models/birch02.glb',
    name: 'Birch 03',
    id: 'Pending...',
    species: 'Betula',
    dimensions: 'Pending...',
    process: 'Pending...',
    status: 'Pending',
  },
  birch03: {
    file: 'models/birch03.glb',
    name: 'Birch 03',
    id: 'Pending...',
    species: 'Betula',
    dimensions: 'Pending...',
    process: 'Pending...',
    status: 'Pending',
  },
  birch04: {
    file: 'models/birch04.glb',
    name: 'Birch 04',
    id: 'B_1000328_0306_01',
    species: 'Betula',
    dimensions: '1000 x 32 x 8 mm',
    process: 'Steamed 30 min | Dried 72h',
    status: 'Success',
  },
  pine05: {
    file: 'models/pine05.glb',
    name: 'Pine 05',
    id: 'Pending...',
    species: 'Pinus',
    dimensions: 'Pending...',
    process: 'Pending...',
    status: 'Pending',
  },
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeModel, setActiveModel] = useState(null)
  const [currentSrc, setCurrentSrc] = useState('models/LogPiece01.glb')
  const viewerRef = useRef(null)

  function loadModel(modelKey) {
    const data = MODEL_DATA[modelKey]
    if (!data) return
    setCurrentSrc(data.file)
    setActiveModel(data)
    setSidebarOpen(false)
    window.location.hash = modelKey
  }

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
      <button id="menu-btn" onClick={() => setSidebarOpen(open => !open)}>☰</button>

      <div id="sidebar" className={sidebarOpen ? 'open' : ''}>
        {Object.keys(MODEL_DATA).map(key => (
          <a key={key} className="model-link" onClick={() => loadModel(key)}>
            {key}
          </a>
        ))}
      </div>

      <model-viewer
        ref={viewerRef}
        id="viewer"
        src={currentSrc}
        camera-controls=""
        auto-rotate=""
        shadow-intensity="1"
        ar=""
        ar-modes="webxr scene-viewer quick-look"
        ar-scale="auto"
      >
        <button slot="hotspot-x" className="dim-label" data-position="0 0 0">Width</button>
        <button slot="hotspot-y" className="dim-label" data-position="0 0 0">Height</button>
        <button slot="hotspot-z" className="dim-label" data-position="0 0 0">Depth</button>
      </model-viewer>

      {activeModel && (
        <div id="spec-card">
          <div className="spec-title">{activeModel.name}</div>
          <div className="spec-meta">ID: {activeModel.id}</div>
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
      )}
    </>
  )
}
