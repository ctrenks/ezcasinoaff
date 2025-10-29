# WordPress Plugin Upload & Download System

**Last Updated:** October 28, 2025

---

## Overview

The Radium WordPress Plugin Upload & Download system allows super admins to upload new plugin versions and users to download the latest 10 versions with full changelog history.

---

## 🎯 Features

### For Super Admin (Role 5):

- **Upload Plugin Versions** - Upload ZIP files via web interface
- **Auto-Extract Version** - Automatically detects version from filename
- **Changelog Support** - Add changelog notes for each version
- **Version History** - View all uploaded versions with stats
- **Download Tracking** - Track how many times each version is downloaded

### For Users (All Logged In):

- **Download Latest** - Prominently displayed latest version
- **Version History** - Access to last 10 versions
- **Changelog Display** - See what's new in each version
- **Secure Downloads** - Authentication required
- **Download Counter** - See popularity of each version

---

## 📊 Database Schema

### PluginVersion Model

```prisma
model PluginVersion {
  id          String   @id @default(cuid())
  version     String   @unique
  fileName    String
  fileSize    Int
  filePath    String
  changelog   String?  @db.Text
  uploadedBy  String
  uploadedAt  DateTime @default(now())
  downloads   Int      @default(0)

  uploader    User     @relation(fields: [uploadedBy], references: [id])

  @@index([version])
  @@index([uploadedAt])
}
```

**Fields:**

- `version` - Semantic version (e.g., "1.2.3") - UNIQUE
- `fileName` - Original filename of uploaded ZIP
- `fileSize` - Size in bytes
- `filePath` - Vercel Blob storage URL
- `description` - Optional short summary (e.g., "Bug fix", "Major update")
- `changelog` - Optional release notes (Markdown supported)
- `uploadedBy` - Admin user ID who uploaded
- `uploadedAt` - Timestamp of upload
- `downloads` - Counter incremented on each download

---

## 🔧 Implementation

### 1. Admin Upload Page

**URL:** `/admin/plugin-upload`

**Access:** Super Admin (role 5) only

**Features:**

- Drag & drop ZIP file upload
- Auto-detect version from filename (e.g., `radium-sync-1.2.3.zip`)
- Manual version input with validation (X.Y.Z format)
- Optional description field (short summary)
- Optional changelog textarea (detailed notes)
- Recent uploads table showing last 10 uploads

**File:** `app/admin/plugin-upload/page.tsx`

```typescript
// Server component - fetches recent versions
const recentVersions = await prisma.pluginVersion.findMany({
  take: 10,
  orderBy: { uploadedAt: "desc" },
  include: {
    uploader: {
      select: { name: true, email: true },
    },
  },
});
```

### 2. Upload Form Component

**File:** `app/admin/plugin-upload/PluginUploadForm.tsx`

**Features:**

- File input with `.zip` filter
- Version format validation (X.Y.Z)
- Changelog textarea
- Progress feedback
- Auto-refresh on success

**Validation:**

```typescript
pattern = "d+.d+.d+"; // Enforces semantic versioning
```

### 3. Upload API Endpoint

**Endpoint:** `POST /api/admin/plugin-upload`

**Access:** Super Admin (role 5) only

**Process:**

1. Validate authentication and admin role
2. Extract form data (file, version, changelog)
3. Validate version format (X.Y.Z)
4. Check for duplicate version
5. Upload to Vercel Blob storage
6. Create database record
7. Return success response

**File:** `app/api/admin/plugin-upload/route.ts`

```typescript
// Upload to Vercel Blob
const blob = await put(`radium-plugin/${file.name}`, file, {
  access: "public",
  addRandomSuffix: false,
});

// Create database record
const pluginVersion = await prisma.pluginVersion.create({
  data: {
    version,
    fileName: file.name,
    fileSize: file.size,
    filePath: blob.url,
    changelog: changelog || null,
    uploadedBy: session.user.id,
  },
});
```

### 4. Download Page

**URL:** `/wp-plugin/download`

**Access:** All authenticated users

**Features:**

- Latest version highlighted with large download button
- Full changelog display for latest version
- List of all available versions (last 10)
- Download stats for each version
- Formatted dates and file sizes

**File:** `app/wp-plugin/download/page.tsx`

### 5. Download API Endpoint

**Endpoint:** `GET /api/plugin/download/[id]`

**Access:** All authenticated users

**Process:**

1. Verify user authentication
2. Find plugin version by ID
3. Increment download counter
4. Redirect to Vercel Blob URL

**File:** `app/api/plugin/download/[id]/route.ts`

```typescript
// Increment counter
await prisma.pluginVersion.update({
  where: { id },
  data: {
    downloads: { increment: 1 },
  },
});

// Redirect to blob for download
return redirect(version.filePath);
```

---

## 🚀 Usage Workflow

### Admin Upload Workflow:

1. **Go to Admin Dashboard** → `/admin`
2. **Click "Plugin Upload"** (🔌 icon)
3. **Drag & drop ZIP file** or click to browse
4. **Version auto-fills** from filename (e.g., `radium-sync-1.2.3.zip` → `1.2.3`)
5. **Add description** (optional): e.g., "Bug fix release", "Major update", "Security patch"
6. **Add changelog** (optional):
   ```
   - Added new feature X
   - Fixed bug in Y
   - Improved performance of Z
   ```
7. **Click "Upload Plugin"**
8. **View in recent uploads table**

### User Download Workflow:

1. **Navigate to** `/wp-plugin` or `/wp-plugin/download`
2. **See latest version** prominently displayed
3. **Review changelog** for what's new
4. **Click "Download Now"** or "Download" on any version
5. **File downloads** from Vercel Blob storage
6. **Install** on WordPress site

---

## 📍 Navigation Links

### Admin Dashboard

Added to `/admin` page:

```typescript
{
  title: "Plugin Upload",
  description: "Upload new Radium WordPress plugin versions",
  href: "/admin/plugin-upload",
  icon: "🔌",
  color: "bg-cyan-100 text-cyan-700 border-cyan-300",
}
```

### Main Navigation

Link to download page in main nav:

- **URL:** `/wp-plugin`
- **Button:** "WP Plugin" in header
- **Downloads:** Links to `/wp-plugin/download`

---

## 🎨 UI/UX Features

### Latest Version Card

```typescript
<div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-xl p-8 text-white">
  <p className="text-purple-200 text-sm font-medium mb-1">LATEST VERSION</p>
  <h2 className="text-3xl font-bold mb-2">
    Radium Sync v{versions[0].version}
  </h2>
  <p className="text-purple-100 text-sm">
    Released on {new Date(versions[0].uploadedAt).toLocaleDateString()}
  </p>
  <p className="text-purple-100 text-sm mt-1">
    {(versions[0].fileSize / 1024 / 1024).toFixed(2)} MB · Downloaded{" "}
    {versions[0].downloads} times
  </p>
  {/* Changelog */}
  {/* Download Button */}
</div>
```

### Version List Item

- Version number with date
- File name and size
- Download counter
- Changelog preview
- Download button

---

## 🔒 Security

### Access Control:

1. **Upload:** Super admin (role 5) only
2. **Download:** All authenticated users
3. **View:** All authenticated users

### Validation:

- ✅ File type restricted to `.zip`
- ✅ Version format validated (X.Y.Z)
- ✅ Duplicate version prevention
- ✅ File size display (prevents huge uploads)
- ✅ Authentication required for all operations

### Storage:

- **Vercel Blob** - Secure, scalable file storage
- **Public access** - Direct download URLs (but authentication required)
- **No random suffix** - Clean URLs for files

---

## 📈 Statistics & Tracking

### Download Analytics:

```sql
-- Most popular versions
SELECT version, downloads, uploadedAt
FROM PluginVersion
ORDER BY downloads DESC
LIMIT 10;

-- Total downloads
SELECT SUM(downloads) as total
FROM PluginVersion;

-- Downloads per day
SELECT DATE(uploadedAt) as date, COUNT(*) as uploads
FROM PluginVersion
GROUP BY DATE(uploadedAt);
```

### Admin View:

Recent uploads table shows:

- Version number
- File name
- File size (MB)
- Download count
- Upload date
- Uploaded by (admin name)

---

## 🔄 Version Management

### Naming Convention:

**Recommended filename format:**

```
radium-sync-1.2.3.zip
```

Where:

- `1` = Major version (breaking changes)
- `2` = Minor version (new features)
- `3` = Patch version (bug fixes)

### Changelog Format:

```markdown
**New Features:**

- Added casino filtering by provider
- Implemented auto-sync scheduling

**Improvements:**

- Faster API response times
- Better error handling

**Bug Fixes:**

- Fixed game thumbnail display issue
- Resolved bonus code expiration bug

**Breaking Changes:**

- Updated API endpoint structure (requires config update)
```

---

## 🛠 Environment Variables

### Required:

```env
# Vercel Blob Storage (for plugin uploads)
BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"
```

### Setup Vercel Blob:

1. Go to Vercel dashboard
2. Select your project
3. Go to Storage → Create Database → Blob
4. Copy the token
5. Add to `.env.local` and production

---

## 🚦 Migration Steps

### 1. Run Database Migration:

```bash
npx prisma migrate dev --name add_plugin_version_model
```

### 2. Generate Prisma Client:

```bash
npx prisma generate
```

### 3. Deploy to Production:

```bash
git push
```

Vercel will automatically run migrations on deployment.

---

## 💡 Future Enhancements

### Potential Features:

1. **Auto-Update Checker** - API endpoint for plugin to check updates
2. **Rollback System** - Mark versions as deprecated
3. **Beta Versions** - Support for pre-release versions
4. **Download Notifications** - Alert admins on high download activity
5. **Version Comparison** - Show diff between versions
6. **Auto-Changelog** - Extract from plugin header comments
7. **ZIP Validation** - Verify plugin structure before upload
8. **Multiple Plugins** - Support for different plugins
9. **Access Control** - Restrict certain versions to specific users
10. **API Integration** - WordPress plugin can check for updates automatically

---

## 📋 Checklist

### Before First Upload:

- [ ] Database migration completed
- [ ] Vercel Blob configured
- [ ] Super admin account created (role 5)
- [ ] Test upload with sample ZIP
- [ ] Verify download works
- [ ] Check download counter increments

### For Each Upload:

- [ ] Version number follows X.Y.Z format
- [ ] Version number is unique (not already used)
- [ ] ZIP file contains valid plugin
- [ ] Changelog includes meaningful notes
- [ ] File size is reasonable (< 50MB)
- [ ] Test download after upload

---

## 🎯 Success Metrics

### Track:

- Total plugin versions uploaded
- Total downloads across all versions
- Most popular versions
- Download trends over time
- User adoption (unique downloaders)

---

**All set!** Super admins can now upload plugin versions, and users can download them with full version history! 🔌
