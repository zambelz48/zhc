#!/bin/bash

# Generate changelog from git commits since last tag
# Usage: ./scripts/changelog.sh [output_file]

set -e

OUTPUT_FILE=${1:-"release_notes.md"}

# Function to get the latest tag
get_latest_tag() {
    # Get version from package.json
    local current_version=$(node -p "require('./package.json').version" 2>/dev/null || echo "")
    
    if [ -n "$current_version" ]; then
        # Get the tag before the current version
        git tag --sort=-version:refname | grep -v "^${current_version}$" | head -n 1
    else
        # Fallback: get the latest tag
        git tag --sort=-version:refname | head -n 1
    fi
}

# Function to format commit messages
format_commits() {
    local since_ref=${1:-""}

    if [ -z "$since_ref" ]; then
        echo "What's new:"
        git log --oneline --pretty=format:"* (%h) %s"
    else
        echo "What's new:"
        git log ${since_ref}..HEAD --oneline --pretty=format:"* (%h) %s"
    fi
}

# Main logic
main() {
    echo "Generating changelog..."

    # Get version from package.json
    VERSION=$(node -p "require('./package.json').version" 2>/dev/null || echo "UNKNOWN")

    echo "Version: $VERSION"

    # Get the latest tag
    LATEST_TAG=$(get_latest_tag)

    echo "Comparing against tag: ${LATEST_TAG:-"(no previous tag)"}"

    # Generate the changelog
    cat > "$OUTPUT_FILE" << EOF
## Changes in $VERSION

$(format_commits "$LATEST_TAG")
EOF

    echo "Changelog generated: $OUTPUT_FILE"
    echo ""
    echo "Preview:"
    echo "========================================"
    cat "$OUTPUT_FILE"
    echo "========================================"
}

# Help function
show_help() {
    cat << EOF
Generate changelog from git commits since last tag

Usage: $0 [OUTPUT_FILE]

Arguments:
    OUTPUT_FILE  Output file path (default: release_notes.md)

Examples:
    $0                           # Auto-detect version from package.json, output to release_notes.md
    $0 CHANGELOG.md              # Auto-detect version from package.json, output to CHANGELOG.md

EOF
}

# Parse command line arguments
case ${1:-""} in
    -h|--help)
        show_help
        exit 0
        ;;
    *)
        main "$@"
        ;;
esac
