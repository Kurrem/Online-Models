const sidebar = document.getElementById('sidebar');
const menuBtn = document.getElementById('menu-btn');
const viewer = document.getElementById('viewer');
const specCard = document.getElementById('spec-card');

// 1. Open/Close the sidebar
menuBtn.addEventListener('click', () => {
    sidebar.classList.toggle('open');
});

// 2. The Upgraded Model Database (File + Catalogue Data)
        const modelData = {
            'LogPiece01': {
                file: 'models/LogPiece01.glb', // <-- Updated path!
                name: 'Log Piece 01',
                id: 'Pending...', species: 'Unknown', dimensions: 'Pending...', process: 'Pending...', status: 'Pending'
            },
            'birch03': {
                file: 'models/birch03.glb', // <-- Updated path!
                name: 'Birch 03',
                id: 'Pending...', species: 'Betula', dimensions: 'Pending...', process: 'Pending...', status: 'Pending'
            },
            'birch04': {
                file: 'models/birch04.glb', // <-- Updated path!
                name: 'Birch 04',
                id: 'B_1000328_0306_01', 
                species: 'Betula', 
                dimensions: '1000 x 32 x 8 mm', 
                process: 'Steamed 30 min | Dried 72h', 
                status: 'Success'
            },
            'pine05': {
                file: 'models/pine05.glb', // <-- Updated path!
                name: 'Pine 05',
                id: 'Pending...', species: 'Pinus', dimensions: 'Pending...', process: 'Pending...', status: 'Pending'
            }
        };

// 3. The Upgraded Load Function
function loadModel(modelKey) {
    const data = modelData[modelKey];
    
    if (data) {
        // Switch the 3D file and update the URL
        viewer.src = data.file;
        window.location.hash = modelKey;
        sidebar.classList.remove('open');
        
        // Populate the Spec Card with the catalogue data
        document.querySelector('#card-name').textContent = data.name;
        document.querySelector('#card-id').textContent = `ID: ${data.id}`;
        document.querySelector('#card-species span').textContent = data.species;
        document.querySelector('#card-dims span').textContent = data.dimensions;
        document.querySelector('#card-process span').textContent = data.process;
        
        // Color the status text green if successful
        const statusEl = document.querySelector('#card-status span');
        statusEl.textContent = data.status;
        statusEl.className = data.status === 'Success' ? 'spec-success' : '';

        // Show the card
        specCard.style.display = 'block';
    }
}

// 4. Cleaned Up QR Code Auto-Loader
window.addEventListener('DOMContentLoaded', () => {
    if (window.location.hash) {
        const targetModel = window.location.hash.substring(1);
        
        // Note: We check modelData now, instead of modelFiles
        if (modelData[targetModel]) {
            loadModel(targetModel); 
        }
    }
});

// 5. The Dimension Auto-Calculator (Unchanged)
viewer.addEventListener('load', () => {
    const center = viewer.getBoundingBoxCenter();
    const size = viewer.getDimensions();
    
    const pad = 0.15; 

    viewer.querySelector('[slot="hotspot-x"]').textContent = `W: ${(size.x).toFixed(2)}m`;
    viewer.querySelector('[slot="hotspot-y"]').textContent = `H: ${(size.y).toFixed(2)}m`;
    viewer.querySelector('[slot="hotspot-z"]').textContent = `D: ${(size.z).toFixed(2)}m`;

    viewer.updateHotspot({
        name: 'hotspot-x',
        position: `${center.x} ${center.y - (size.y / 2) - pad} ${center.z + (size.z / 2) + pad}`
    });

    viewer.updateHotspot({
        name: 'hotspot-y',
        position: `${center.x + (size.x / 2) + pad} ${center.y} ${center.z + (size.z / 2) + pad}`
    });

    viewer.updateHotspot({
        name: 'hotspot-z',
        position: `${center.x + (size.x / 2) + pad} ${center.y - (size.y / 2)} ${center.z - pad}`
    });
});