# Adding a New Physical Model to the Digital Catalogue
**Last Updated:** Phase 2 (Vite + React migration, GitHub Pages deploy)

## Step 1: Export the 3D Model (Rhino)
1. Ensure the photogrammetry scan is scaled to real-world **meters** in Rhino.
2. Check that the texture is applied using a **Physically Based (PBR)** material (Roughness high, Metallic 0).
3. Select the model and go to **File > Export Selected**.
4. Choose the native **glTF binary file (*.glb)** option (do *not* use the ShapeDiver one).
5. Save the file with a clear short-code name (e.g., `pine07.glb`).

## Step 2: Add it to the Web Folder (VS Code)
1. Open the `Online Models` project in VS Code.
2. Drag and drop the new `.glb` file directly into the **`public/models/`** folder.

## Step 3: Update the Database (`src/App.jsx`)
1. Open `src/App.jsx`.
2. Find the `modelData` array/object.
3. Copy an existing block, paste it at the bottom, and fill in the details from the physical thesis catalogue. *(Don't forget the comma after the previous block!)*

**Data Block Template:**
    'pine07': {
        file: 'models/pine07.glb',
        name: 'Pine 07',
        id: 'P_1000400_0310_02',
        species: 'Pinus',
        dimensions: '1000 x 40 x 10 mm',
        process: 'Steamed 45 min | Dried 48h',
        status: 'Failure - Snapped'
    }

## Step 4: Save and Preview Locally (Optional)
Run the local dev server to check everything looks correct before publishing:
```
npm run dev
```
This opens the site at `http://localhost:5173`. Changes are hot-reloaded as you edit. **This does NOT update the live website.**

## Step 5: Save Your Work to Git (main branch)
1. In VS Code, go to the Source Control tab.
2. Type a commit message (e.g., "Added Pine 07 model").
3. Click **Commit**, then click **Sync Changes**.

> This saves your source code to the `main` branch. **The live GitHub Pages website is NOT updated yet.**

## Step 6: Publish to the Live Website
When you are ready to update the public website, run:
```
npm run deploy
```
This builds the site and pushes the compiled output to the `gh-pages` branch, which GitHub Pages serves publicly. Wait ~60 seconds for GitHub to finish deploying.

> **Summary:**
> | Action | Command |
> |---|---|
> | Preview locally | `npm run dev` |
> | Save source code | `git push` (via VS Code Sync) |
> | Update live website | `npm run deploy` |

## Step 7: Create the QR Code (For the Physical Book)
1. Wait ~60 seconds after running `npm run deploy` for GitHub Pages to update.
2. Go to a static QR code generator.
3. Type in the base website link, followed by a `#` and the short-code ID:
   `https://[yourusername].github.io/Online-Models/#pine07`
4. Download the QR code and drop it into the InDesign/Word document next to the physical log entry.