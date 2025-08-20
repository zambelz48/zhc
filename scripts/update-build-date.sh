#!/bin/bash

# Script to update releaseBuildDate in package.json
# Usage: ./scripts/update-build-date.sh

set -e

# Get current UTC date in the same format as the existing one
BUILD_DATE=$(date -u +"%d %b %Y, %H:%M:%S")

# Update package.json using sed
if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS uses different sed syntax
  sed -i '' "s/\"releaseBuildDate\": \".*\"/\"releaseBuildDate\": \"$BUILD_DATE\"/" package.json
else
  # Linux
  sed -i "s/\"releaseBuildDate\": \".*\"/\"releaseBuildDate\": \"$BUILD_DATE\"/" package.json
fi

echo "✅ Updated releaseBuildDate to: $BUILD_DATE"