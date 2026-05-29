export interface DatasetItem {
  text: string;
  label: 'positive' | 'negative';
  source: 'imdb' | 'twitter' | 'amazon';
}

export const TRAINING_DATASET: DatasetItem[] = [
  // IMDB Movie Reviews
  { text: "This is one of the best movies I have seen this year! The acting was perfect and the script was incredibly smart.", label: 'positive', source: 'imdb' },
  { text: "Absolute masterpiece. Beautiful cinematography, stellar cast, and a brilliant score.", label: 'positive', source: 'imdb' },
  { text: "A slow, boring, completely useless movie. The actors looked tired and the ending made absolutely no sense.", label: 'negative', source: 'imdb' },
  { text: "Terrible disaster. I hate how they ruined a perfectly good book. Waste of time and money.", label: 'negative', source: 'imdb' },
  { text: "A stunning and delightful piece of art. Highly recommend to everyone who loves great cinema.", label: 'positive', source: 'imdb' },
  { text: "Horrible film. CGI was weak, writing was poor, and the characters were completely unlikable.", label: 'negative', source: 'imdb' },
  { text: "Brilliant storytelling. An incredible achievement that will be remembered for years.", label: 'positive', source: 'imdb' },
  { text: "I fell asleep. The plot was slow, uninspiring, and painful to watch. Worst movie ever.", label: 'negative', source: 'imdb' },
  { text: "Fantastic performance by the lead cast. A clean, smooth, and delightfully heartwarming adventure.", label: 'positive', source: 'imdb' },
  { text: "Awful. Plot holes everywhere. Avoid this scam at all costs. I left the theatre furious.", label: 'negative', source: 'imdb' },

  // Twitter/Tweets
  { text: "So happy that the new version is fast and clean! Amazing upgrade, congrats team! 🎉", label: 'positive', source: 'twitter' },
  { text: "This software is buggy and disappointing. Constantly crashes. Worst error of my life to buy this.", label: 'negative', source: 'twitter' },
  { text: "Outstanding support from the staff. Friendly, helpful, and very speedy resolution of my issues.", label: 'positive', source: 'twitter' },
  { text: "Hate dealing with rude agents and slow apps. Seriously thinking of canceling my account.", label: 'negative', source: 'twitter' },
  { text: "Great vibes at the conference today! Stunned by the innovative designs shown. Smart!", label: 'positive', source: 'twitter' },
  { text: "Annoyed. Another server outage during peak hours. This service is a joke.", label: 'negative', source: 'twitter' },
  { text: "Superb product! Easy to use, extremely cheap, and saved me hours of difficult code.", label: 'positive', source: 'twitter' },
  { text: "Terrible update. Features are broken, UI is ugly, and it ruins the experience completely.", label: 'negative', source: 'twitter' },
  { text: "Celebrating a successful launch tonight! Everyone is glad and highly satisfied.", label: 'positive', source: 'twitter' },
  { text: "This is a frustrating mess. Regret upgrading. Buggy, complicated, and useless features.", label: 'negative', source: 'twitter' },

  // Amazon Product Reviews
  { text: "Perfect size, perfect fit! Outstanding build quality. Definitely worth every penny.", label: 'positive', source: 'amazon' },
  { text: "Absolute garbage. Broken on arrival. Poor craftsmanship, cheap materials, do not buy.", label: 'negative', source: 'amazon' },
  { text: "Extremely fast shipping. The battery life is spectacular, highly recommended product! 😄", label: 'positive', source: 'amazon' },
  { text: "Useless cheap plastic. Already cracked within two days of normal use. Disappointed.", label: 'negative', source: 'amazon' },
  { text: "Beautiful design, simple interface, very lightweight. An amazing purchase.", label: 'positive', source: 'amazon' },
  { text: "Awful sound quality. Bass is nonexistent and the cable is fragile. Worst headset I own.", label: 'negative', source: 'amazon' },
  { text: "Brilliant vacuum cleaner. Cleaned my entire house in fifteen minutes. So easy!", label: 'positive', source: 'amazon' },
  { text: "Waste of money. Does not clean anything. Unhappy with the seller, rude return policy.", label: 'negative', source: 'amazon' },
  { text: "The product was perfect, arrived in gorgeous packaging and operates flawlessly.", label: 'positive', source: 'amazon' },
  { text: "Failed after 1 week. Painful setup, noisy engine, worst customer experience ever.", label: 'negative', source: 'amazon' },
];
