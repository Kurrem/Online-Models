@echo off
echo Starting GLB optimization...

:: Create a new folder for the optimized files so we don't overwrite the originals
if not exist "optimized" mkdir "optimized"

:: Loop through every .glb file in the current folder
for %%F in (*.glb) do (
    echo.
    echo ------------------------------------------------
    echo Processing: %%F
    echo ------------------------------------------------
    
    :: Run the gltf-transform command and save into the optimized folder
    gltf-transform optimize "%%F" "optimized\%%~nxF" --texture-size 1024 --texture-compress webp --compress draco
)

echo.
echo ================================================
echo All done! Check the 'optimized' folder for your smaller files.
echo ================================================
pause