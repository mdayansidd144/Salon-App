export const servicesData = {
  haircut: {
    title: "Haircut Styles",
    description: "Professional haircuts tailored to your style",
    image: "/fade.jpg", 
    services: [
      { id: 'hair_1', name: 'Low Fade', price: 119, duration: 40, description: 'Clean fade starting low on the head', image: '/fade.jpg' },
      { id: 'hair_2', name: 'Quiff', price: 119, duration: 35, description: 'Voluminous and textured top styling', image: '/quiff.jpg' },
      { id: 'hair_3', name: 'Pompadour', price: 129, duration: 40, description: 'Classic voluminous style swept upwards', image: '/pompadour.jpg' },
      { id: 'hair_4', name: 'Executive Cut', price: 149, duration: 45, description: 'Sharp, professional business style', image: '/executive.jpg' },
      { id: 'hair_5', name: 'Textured Crop', price: 129, duration: 35, description: 'Modern, messy textured top', image: '/crop.jpg' },
      { id: 'hair_6', name: 'Buzz Cut', price: 99, duration: 20, description: 'Short, uniform, low-maintenance look', image: '/buzz.jpg' },
      { id: 'hair_7', name: 'Mullet', price: 129, duration: 40, description: 'Classic retro business in the front, party in the back', image: '/mullet.jpg' },
      { id: 'hair_8', name: 'High Fade', price: 119, duration: 35, description: 'Bold fade starting high on the sides', image: '/highfade.jpg' },
      { id: 'hair_9', name: 'Man Bun', price: 139, duration: 50, description: 'Stylish long hair tied neatly back', image: '/bun.jpg' }
    ]
  },
  beard: {
    title: "Beard Grooming",
    description: "Expert beard shaping and styling for the modern man",
    image: "/cleanshave.jpg", 
    services: [
      { id: 'beard_1', name: 'Clean Shave', price: 49, duration: 20, description: 'Smooth, close shave for a fresh look', image: '/cleanshave.jpg' },
      { id: 'beard_2', name: 'Goatee', price: 59, duration: 25, description: 'Classic goatee shaping and styling', image: '/goatee.jpg' },
      { id: 'beard_3', name: '2 Trim', price: 39, duration: 15, description: 'Medium length uniform beard trim', image: '/twotrim.jpg' },
      { id: 'beard_4', name: '1 Trim', price: 29, duration: 10, description: 'Light stubble trim for a rugged look', image: '/onetrim.jpg' },
      { id: 'beard_5', name: 'Heritage', price: 69, duration: 30, description: 'Full, well-groomed heritage beard styling', image: '/heritage.jpg' },
      { id: 'beard_6', name: 'French Cut', price: 59, duration: 25, description: 'Stylish French beard with sharp lines', image: '/frenchcut.jpg' },
      { id: 'beard_7', name: 'Patchy', price: 49, duration: 20, description: 'Evening out and blending patchy areas', image: '/patchy.jpg' },
      { id: 'beard_8', name: 'Ducktail', price: 69, duration: 30, description: 'Bold, extended ducktail beard shape', image: '/ducktail.jpg' }
    ]
  },
  spa: {
    title: "Hair Spa",
    description: "Rejuvenating hair and scalp treatments",
    image: "/detox.jpg", 
    services: [
      { id: 'spa_1', name: 'Deep Cleansing / Scalp Detox', price: 349, duration: 60, description: 'Deeply cleanses the scalp, removing build-up and impurities', image: '/detox.jpg' },
      { id: 'spa_2', name: 'Anti-Dandruff', price: 399, duration: 65, description: 'Targeted treatment to eliminate dandruff and soothe the scalp', image: '/dandruff.jpg' },
      { id: 'spa_3', name: 'Hairfall Control', price: 449, duration: 70, description: 'Strengthens roots and reduces hair fall with nourishing ingredients', image: '/hairfall.jpg' },
      { id: 'spa_4', name: 'Deep Repair', price: 499, duration: 75, description: 'Intensive repair for dry, damaged, and frizzy hair', image: '/deeprepair.jpg' },
      { id: 'spa_5', name: 'Traditional Spa', price: 599, duration: 90, description: 'Classic relaxing spa ritual with warm oils and massage', image: '/traditionalspa.jpg' }
    ]
  },
  facial: {
    title: "Men's Facial",
    description: "Advanced skincare and facial treatments for men",
    image: "/o3facial.jpg", 
    services: [
      { id: 'facial_1', name: 'O3 Facial', price: 599, duration: 70, description: 'Oxygen infusion therapy to rejuvenate and brighten the skin', image: '/o3facial.jpg' },
      { id: 'facial_2', name: 'Classic Facial', price: 299, duration: 45, description: 'Deep cleansing and exfoliation for a refreshed look', image: '/classicfacial.jpg' },
      { id: 'facial_3', name: 'Gold Facial', price: 499, duration: 60, description: 'Luxury gold therapy to promote glowing, youthful skin', image: '/goldfacial.jpg' },
      { id: 'facial_4', name: 'Fruit Facial', price: 349, duration: 50, description: 'Natural fruit extracts to hydrate and revitalize', image: '/fruitfacial.jpg' }
    ]
  },
  grooming: {
    title: "Full Grooming",
    description: "Complete men's makeover packages",
    image: "/groomhairbeard.jpg", 
    services: [
      { id: 'groom_1', name: 'Haircut and Beard Styling', price: 499, duration: 90, description: 'Complete refresh with a precision haircut and beard sculpting', image: '/groomhairbeard.jpg' },
      { id: 'groom_2', name: 'Facial and Deep Cleansing', price: 599, duration: 110, description: 'Advanced skincare treatment for a fresh, glowing complexion', image: '/groomfacial.jpg' },
      { id: 'groom_3', name: 'Bridal Makeover', price: 799, duration: 120, description: 'Ultimate groom package for your special day', image: '/groombridal.jpg' },
      { id: 'groom_4', name: 'Relaxation and Massage', price: 699, duration: 150, description: 'Unwind with our signature head and shoulder massage therapy', image: '/groommassage.jpg' }
    ]
  },
  headMassage: {
    title: "Head Massage",
    description: "Relaxing head and scalp massage for men",
    image: "/basicmassage.jpg", 
    services: [
      { id: 'massage_1', name: 'Basic Head Massage', price: 49, duration: 30, description: 'Relaxing scalp massage to relieve stress', image: '/basicmassage.jpg' },
      { id: 'massage_2', name: 'Hot Oil Massage', price: 199, duration: 50, description: 'Warm oil therapy to nourish the scalp and promote hair growth', image: '/hotmassage.jpg' },
      { id: 'massage_3', name: 'Deep Tissue Massage', price: 99, duration: 45, description: 'Deep pressure techniques for tension relief and deep relaxation', image: '/deepmassage.jpg' }
    ]
  }
};