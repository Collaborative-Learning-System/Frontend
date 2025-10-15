// Background images for workspace cards and headers
export const backgroundImages = [
  "https://e0.pxfuel.com/wallpapers/558/975/desktop-wallpaper-macbook-aesthetic-aesthetic-clouds-mac.jpg",
  "https://wallpapercave.com/wp/wp5406285.jpg",
  "https://wallpapers.com/images/hd/macbook-default-wjin3six05daljfh.jpg",
  "https://plus.unsplash.com/premium_photo-1673240367277-e1d394465b56?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG1hYyUyMHdhbGxwYXBlcnxlbnwwfHwwfHx8MA%3D%3D",
  "https://wallpapers.com/images/hd/4k-landscape-montana-state-america-t870yy4rc9jgyvk5.jpg",
];

// Function to get a consistent random background image based on a seed
export const getRandomBackground = (seed: string | number): string => {
  // Convert seed to string for better hash distribution
  const seedStr = String(seed);
  
  // Create a better hash function for more uniform distribution
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    const char = seedStr.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Use additional operations to improve randomness
  hash = Math.abs(hash);
  hash = hash * 16807; // Multiplier from Park and Miller RNG
  hash = hash % 2147483647; // Large prime number
  
  const index = hash % backgroundImages.length;
  return backgroundImages[index];
};