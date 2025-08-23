# Video Hero Section Setup

## 🎥 **Current Setup**

The hero section now includes a responsive video background with:
- ✅ Full-screen video background
- ✅ Text and CTA buttons overlaid on top
- ✅ Responsive design for all devices
- ✅ Video controls (play/pause functionality)
- ✅ Fallback background when video is not available
- ✅ Optimized for performance

## 📁 **Video Files**

### **Current Video**
- **File**: `/public/herovideo.mp4` (4.5MB)
- **Format**: MP4
- **Status**: ✅ Already configured

### **Adding Your Own Video**

1. **Place your video file** in the `/public/` folder
2. **Update the video source** in `components/sections/HeroSection.tsx`:

```tsx
<video
  ref={videoRef}
  className="absolute inset-0 w-full h-full object-cover"
  autoPlay
  muted
  loop
  playsInline
  poster="/placeholder.jpg"
>
  <source src="/your-video-name.mp4" type="video/mp4" />
  <source src="/your-video-name.webm" type="video/webm" />
  Your browser does not support the video tag.
</video>
```

## 🎨 **Customization Options**

### **Video Behavior**
- **AutoPlay**: Video starts automatically (muted for browser compliance)
- **Loop**: Video repeats continuously
- **Muted**: Required for autoplay to work
- **PlaysInline**: Prevents fullscreen on mobile devices

### **Text Styling**
- **White text** with drop shadows for readability over video
- **Gradient text effects** for the main heading
- **Responsive sizing** for all screen sizes

### **Button Styling**
- **Glass effect buttons** with backdrop blur
- **Hover animations** and transitions
- **Responsive layout** (stacked on mobile, inline on desktop)

### **Overlay Effects**
- **Gradient overlays** for better text readability
- **Reduced opacity floating elements** to not interfere with video
- **Mobile-optimized controls**

## 📱 **Responsive Features**

### **Mobile (< 768px)**
- Video controls in bottom-right corner
- Stacked button layout
- Optimized text sizing
- Touch-friendly interactions

### **Tablet (768px - 1024px)**
- Balanced layout
- Medium text sizing
- Inline button layout

### **Desktop (> 1024px)**
- Full layout
- Large text sizing
- All animations active

## ⚡ **Performance Optimizations**

### **Video Optimization**
- **Compressed video files** (recommended: < 10MB)
- **Multiple formats** (MP4 + WebM for better compatibility)
- **Poster image** for faster loading
- **Lazy loading** considerations

### **CSS Optimizations**
- **Hardware acceleration** for animations
- **Efficient backdrop filters**
- **Optimized text shadows**

## 🔧 **Advanced Customization**

### **Changing Video Behavior**
```tsx
// Disable autoplay
autoPlay={false}

// Disable loop
loop={false}

// Add controls
controls={true}
```

### **Custom Overlay Colors**
```css
/* In globals.css */
.video-overlay {
  background: linear-gradient(
    to bottom,
    rgba(181, 111, 118, 0.6) 0%,  /* Your custom color */
    rgba(181, 111, 118, 0.2) 50%,
    rgba(181, 111, 118, 0.4) 100%
  );
}
```

### **Custom Button Styles**
```css
/* In globals.css */
.btn-video-custom {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(12px);
  border: 2px solid rgba(255, 255, 255, 0.3);
}
```

## 🎯 **Best Practices**

### **Video Content**
- **Keep it short** (10-30 seconds for loops)
- **High quality** but optimized file size
- **Relevant content** that matches your brand
- **Subtle movement** to not distract from text

### **Text Content**
- **High contrast** against video background
- **Clear hierarchy** with different text sizes
- **Concise messaging** for quick reading

### **Performance**
- **Compress videos** using tools like HandBrake
- **Use WebM format** for better compression
- **Test on different devices** and connections
- **Monitor loading times**

## 🐛 **Troubleshooting**

### **Video Not Playing**
- Check file path in video source
- Ensure video format is supported
- Verify file is in `/public/` folder
- Check browser console for errors

### **Text Not Readable**
- Adjust overlay opacity in CSS
- Increase text shadow intensity
- Use higher contrast colors
- Test on different video backgrounds

### **Mobile Issues**
- Ensure `playsInline` attribute is set
- Test touch interactions
- Check video controls positioning
- Verify responsive breakpoints

## 📞 **Support**

If you need help with:
- Video optimization
- Custom styling
- Performance issues
- Browser compatibility

Check the console for any errors and ensure all files are properly placed in the correct directories. 