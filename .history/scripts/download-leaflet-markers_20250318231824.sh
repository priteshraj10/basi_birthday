#!/bin/bash

# Create directories if they don't exist
mkdir -p public

# Download Leaflet marker icons
curl -o public/marker-icon.png https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png
curl -o public/marker-shadow.png https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png
curl -o public/marker-icon-2x.png https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png

echo "Leaflet marker icons downloaded successfully!" 