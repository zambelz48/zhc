#!/bin/bash

# Create a git tag with changelog as tag message
# Usage: ./scripts/tag.sh

set -e

echo "Creating tag from package.json version..."

# Get version from package.json
VERSION=$(node -p "require('./package.json').version" 2>/dev/null)

if [ -z "$VERSION" ] || [ "$VERSION" = "undefined" ]; then
    echo "Error: Could not read version from package.json"
    exit 1
fi

echo "Version: $VERSION"

# Check if tag already exists
if git tag -l | grep -q "^${VERSION}$"; then
    echo "Error: Tag $VERSION already exists"
    exit 1
fi

# Generate changelog to temporary file
TEMP_FILE=$(mktemp)
./scripts/changelog.sh "$TEMP_FILE"

# Extract just the changelog content (skip the header)
TAG_MESSAGE=$(tail -n +3 "$TEMP_FILE")

# Clean up temp file
rm "$TEMP_FILE"

# Create the tag with the changelog as message
git tag -a "$VERSION" -m "$TAG_MESSAGE"

echo "Tag $VERSION created successfully!"
echo ""
echo "Tag message:"
echo "========================================"
echo "$TAG_MESSAGE"
echo "========================================"
echo ""
echo "To push the tag to remote:"
echo "git push origin $VERSION"