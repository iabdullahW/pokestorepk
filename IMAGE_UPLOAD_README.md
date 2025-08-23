# Image Upload Feature

## Overview
The ProductManagement component now supports image uploads directly from your device, in addition to the existing URL input method.

## Features

### 🖼️ Image Upload from Device
- **File Selection**: Click "Choose Image" to select an image file from your device
- **Supported Formats**: JPEG, JPG, PNG, WebP
- **File Size Limit**: Maximum 5MB per image
- **Preview**: See a preview of the selected image before uploading
- **Upload Progress**: Visual feedback during upload process

### 🔗 URL Input (Fallback)
- Still supports entering image URLs directly
- Useful for images already hosted elsewhere

## How to Use

### Adding a New Product with Image Upload

1. **Click "Add Product"** in the ProductManagement interface
2. **Fill in product details** (name, price, category, description)
3. **Upload Image**:
   - Click "Choose Image" to select a file from your device
   - Review the file info (name, size)
   - See the preview
   - Click "Upload Image" to upload to Firebase Storage
   - Wait for upload confirmation
4. **Save Product**: Click "Add Product" to save with the uploaded image

### Editing a Product

1. **Click the edit icon** on any product
2. **Modify product details** as needed
3. **Update Image** (optional):
   - Upload a new image to replace the existing one
   - The old image will be automatically deleted from storage
4. **Save Changes**: Click "Update Product"

## Technical Details

### Storage Location
- Images are stored in Firebase Storage under the `products/` folder
- Each image gets a unique filename with timestamp: `products/{timestamp}_{filename}`
- Images are publicly accessible via Firebase Storage URLs

### Automatic Cleanup
- When a product is deleted, its associated image is automatically removed from storage
- When a product image is replaced, the old image is automatically deleted

### Error Handling
- File type validation (only images allowed)
- File size validation (max 5MB)
- Upload progress feedback
- Error messages for failed uploads
- Graceful fallback to URL input

## Firebase Configuration

The feature requires Firebase Storage to be properly configured:

1. **Storage Rules**: Located in `storage.rules`
2. **Firebase Config**: Storage bucket configured in `lib/firebase.ts`
3. **Deployment**: Use `firebase deploy --only storage` to deploy storage rules

## Security Notes

⚠️ **Current Configuration**: Storage rules allow public write access for development
- **Production**: Implement proper authentication before deploying to production
- **Admin Access**: Restrict upload access to authenticated admin users only

## Troubleshooting

### Upload Fails
- Check file size (must be under 5MB)
- Verify file format (JPEG, PNG, WebP only)
- Ensure Firebase Storage is properly configured
- Check browser console for detailed error messages

### Image Not Displaying
- Verify the image URL is accessible
- Check if the image was uploaded successfully
- Ensure Firebase Storage rules allow public read access

### Performance
- Large images are automatically compressed by Firebase Storage
- Consider optimizing images before upload for better performance 