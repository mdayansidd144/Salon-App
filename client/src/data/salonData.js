export const salonData = {
  name: "Cut For You",
  tagline: "We Make Your Hair Look Great, Perfect!",
  description: "Established with a passion for the art of barbering, we take great pride in our craft and strive to create an atmosphere that feels like home. From the moment you walk through our doors, you'll be greeted by friendly smiles and a warm ambiance that instantly puts you at ease.",
  aboutText: "More than just a haircut, it's an experience. We blend traditional barbering techniques with modern styling to ensure every client walks out with confidence.",
  contact: {
    address: "BBD Opposite Goel Complex, Second Floor, 1st Shop",
    umarPhone: "9519159639",
    arishPhone: "6393790278",
    email: "hello@cutforyou.com", 
  },
  hours: "Mon - Sun: 10 AM - 10 PM",
  images: {
    hero: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2074&auto=format&fit=crop",
    about: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=2070&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1593702288056-7927b442d0fa?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?q=80&w=800&auto=format&fit=crop"
    ]
  },
  processSteps: [
    { step: "01", title: "Consultation", desc: "We start by understanding your hair type, lifestyle, and the exact look you want to achieve." },
    { step: "02", title: "The Cut", desc: "Our master barbers use precise techniques, from classic scissor cuts to modern fades." },
    { step: "03", title: "The Finish", desc: "We finish with premium styling products and a hot towel treatment for a clean, sharp result." }
  ],
  features: [
    { title: "Master Barbers", desc: "Highly trained professionals with years of experience in classic and modern styling." },
    { title: "Premium Products", desc: "We only use top-tier organic grooming products that nourish your hair and skin." },
    { title: "Relaxing Ambience", desc: "Step into a space designed for relaxation. Enjoy a complimentary beverage while you wait." },
    { title: "Precision Focused", desc: "Every line, every fade, and every trim is executed with meticulous attention to detail." }
  ],
  stylists: [
    {
      id: 1,
      name: "Mohd Umar",
      role: "Master Groomer",
      experience: "6+ Years Experience",
      image: "/images/barbers/umar.png", 
      expertise: ["Haircutting", "Beard Styling", "Facial", "Personal Customization", "Hair Spa", "Head Massage", "Bridal Grooming"],
      description: "Mohd Umar is a master groomer with over 6 years of experience in the industry. He specializes in classic cuts, fades, and modern hairstyles. Known for his precision and attention to detail, Umar ensures every client leaves looking their absolute best.",
      quote: "Every haircut tells a story, I make sure it's a great one.",
      rating: 4.9,
      reviews: 245
    },
    {
      id: 2,
      name: "Mohd Arish",
      role: "Senior Stylist",
      experience: "4+ Years Experience",
      image: "/images/barbers/arish.png", 
      expertise: ["Hair Cutting", "Full Grooming", "Beard Shaping", "Hair Spa", "Facial", "Personal Customization", "Threading", "Bridal Grooming"],
      description: "Mohd Arish is a senior stylist with 4+ years of experience, bringing creativity and precision to every service. He is an expert in beard sculpting, hot towel shaves, and complete grooming packages. Arish specializes in helping clients transform their look with confidence.",
      quote: "A well-groomed man is a confident man. I bring out the best in you.",
      rating: 4.8,
      reviews: 189
    }
  ]
};