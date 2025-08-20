# Release Process

This document outlines the release process for ZHC maintainers.

## Prerequisites

- Write access to the repository
- NPM publish permissions
- Node.js 20+ and pnpm 10+ installed locally

## Release Workflow

### Option A: Quick Release (Recommended)

For most releases, use the convenient npm scripts:

1. **Ensure main branch is up to date**
   ```bash
   git checkout main
   git pull origin main
   ```

2. **Verify everything is working**
   ```bash
   pnpm install
   pnpm build
   
   # Test CLI functionality
   node dist/index.js --version
   node dist/index.js --help
   ```

3. **Release with single command**
   ```bash
   # For patch releases (bug fixes)
   pnpm release:patch
   
   # For minor releases (new features)
   pnpm release:minor
   
   # For major releases (breaking changes)
   pnpm release:major
   ```
   
   This command will:
   - Bump version in `package.json`
   - Commit the change with proper message
   - Push to main branch

4. **Create and push tag**
   ```bash
   # Create tag with changelog and push to trigger release
   pnpm release:push
   ```

### Option B: Manual Release (Step by Step)

For more control over the process:

1. **Ensure main branch is up to date**
   ```bash
   git checkout main
   git pull origin main
   ```

2. **Verify everything is working**
   ```bash
   pnpm install
   pnpm build
   
   # Test CLI functionality
   node dist/index.js --version
   node dist/index.js --help
   ```

3. **Update version in package.json**
   ```bash
   # For patch releases (bug fixes)
   pnpm version patch --no-git-tag-version
   
   # For minor releases (new features)
   pnpm version minor --no-git-tag-version
   
   # For major releases (breaking changes)
   pnpm version major --no-git-tag-version
   ```

4. **Commit the version change**
   ```bash
   git add package.json
   git commit -m "chore: bump version to X.Y.Z"
   git push origin main
   ```

5. **Create and push tag**
   ```bash
   # Create tag with changelog and push to trigger release
   pnpm release:push
   ```

## Available npm Scripts

- `pnpm changelog` - Generate changelog to `release_notes.md`
- `pnpm tag` - Create git tag with changelog message
- `pnpm release:patch` - Bump patch version, commit, and push
- `pnpm release:minor` - Bump minor version, commit, and push
- `pnpm release:major` - Bump major version, commit, and push
- `pnpm release:push` - Create tag with changelog and push to remote

## Automated Release Process

Once the tag is pushed, GitHub Actions will automatically:

1. **Build and test** the project
2. **Generate release notes** from the tag changelog
3. **Publish to NPM** with public access
4. **Create GitHub release** with generated notes

### 4. Post-Release Verification

1. **Verify NPM publication**
   ```bash
   npm view @zambelz/zhc@X.Y.Z
   ```

2. **Test installation**
   ```bash
   npm install -g @zambelz/zhc@X.Y.Z
   zhc --version
   ```

3. **Check GitHub release**
   - Visit [GitHub Releases](https://github.com/zambelz48/zhc/releases)
   - Verify the release was created with proper changelog

## Scripts Reference

### `pnpm changelog`
Generates changelog from git commits since the last tag.
- Reads version from `package.json`
- Compares against latest git tag
- Outputs markdown formatted changelog to `release_notes.md`

**Usage:**
```bash
pnpm changelog
```

### `pnpm tag`
Creates an annotated git tag with changelog as the message.
- Reads version from `package.json`
- Calls `changelog.sh` to generate content
- Creates git tag with changelog content
- Includes safety checks for existing tags

**Usage:**
```bash
pnpm tag
```

### `pnpm release:*`
Complete release workflow commands that bump version, commit, and push:
- `pnpm release:patch` - For bug fixes (1.0.0 → 1.0.1)
- `pnpm release:minor` - For new features (1.0.0 → 1.1.0)  
- `pnpm release:major` - For breaking changes (1.0.0 → 2.0.0)

**What they do:**
1. Bump version in package.json
2. Commit with formatted message
3. Push to main branch

### Raw Scripts (Alternative)

### `scripts/changelog.sh`
Generates changelog from git commits since the last tag.
- Reads version from `package.json`
- Compares against latest git tag
- Outputs markdown formatted changelog

**Usage:**
```bash
./scripts/changelog.sh [output_file]
```

### `scripts/tag.sh`
Creates an annotated git tag with changelog as the message.
- Reads version from `package.json`
- Calls `changelog.sh` to generate content
- Creates git tag with changelog content
- Includes safety checks for existing tags

**Usage:**
```bash
./scripts/tag.sh
```

## Version Guidelines

Follow [Semantic Versioning](https://semver.org/):

- **PATCH** (1.0.1): Bug fixes, documentation updates
- **MINOR** (1.1.0): New features, backward compatible changes
- **MAJOR** (2.0.0): Breaking changes, API changes

## Hotfix Releases

For urgent bug fixes:

1. Create hotfix branch from the latest tag
2. Apply minimal fix
3. Follow the same release process
4. Merge back to main after release

## Rollback Process

If a release has critical issues:

1. **Deprecate NPM version**
   ```bash
   npm deprecate @zambelz/zhc@X.Y.Z "Critical bug, use X.Y.W instead"
   ```

2. **Create patch release** with fix
3. **Update documentation** as needed

## Release Checklist

- [ ] Main branch is up to date
- [ ] All CI checks passing
- [ ] Version bumped in package.json
- [ ] Version change committed and pushed
- [ ] Tag created with `pnpm tag`
- [ ] Tag pushed to remote
- [ ] GitHub Actions completed successfully
- [ ] NPM package published
- [ ] GitHub release created
- [ ] Installation verified
- [ ] Release announced (if needed)

## Troubleshooting

### GitHub Actions Failed
- Check workflow logs in GitHub Actions tab
- Common issues: NPM token, permission errors
- Re-run failed jobs if transient failure

### NPM Publish Failed
- Verify NPM_TOKEN secret is valid
- Check package name conflicts
- Ensure version doesn't already exist

### Tag Already Exists
```bash
# Delete local tag
git tag -d X.Y.Z

# Delete remote tag (if needed)
git push origin :refs/tags/X.Y.Z

# Recreate tag
pnpm tag
```

---

For questions about the release process, create an issue or contact maintainers.