/** @typedef {{ id: string; title: string; brand: string; description: string; tags: string[]; imageUrl: string; link: string }} StoryCarouselCard */

/** @type {StoryCarouselCard[]} */
export const defaultStoryCarouselCards = [
  {
    id: 'story-1',
    title: 'Active Wear Innovation',
    brand: 'Nike',
    description:
      'Integrating flexible sensors into performance gear to monitor muscle fatigue and heart rate in real-time.',
    tags: ['Sports', 'Health', 'IoT'],
    imageUrl:
      'https://images.unsplash.com/photo-1515243061678-14fc18b93935?q=80&w=2940&auto=format&fit=crop',
    link: '#',
  },
  {
    id: 'story-2',
    title: 'Smart Ergonomics',
    brand: 'Herman Miller',
    description:
      'Pressure-sensitive fabrics in office chairs that analyze posture and suggest adjustments for optimal health.',
    tags: ['Office', 'Health', 'Furniture'],
    imageUrl:
      'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?q=80&w=2938&auto=format&fit=crop',
    link: '#',
  },
  {
    id: 'story-3',
    title: 'Automotive Comfort',
    brand: 'Tesla',
    description:
      'Intelligent car seats that adapt to passenger position and monitor vital signs for enhanced safety.',
    tags: ['Auto', 'Safety', 'Smart'],
    imageUrl:
      'https://images.unsplash.com/photo-1561580125-028ce3bfcb25?q=80&w=2940&auto=format&fit=crop',
    link: '#',
  },
]

/** @type {{ autoRotate: boolean; rotateInterval: number }} */
export const defaultStoryCarouselSettings = {
  autoRotate: true,
  rotateInterval: 4000,
}
