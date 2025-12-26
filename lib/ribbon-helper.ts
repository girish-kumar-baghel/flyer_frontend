// Ribbon Helper - Determines which ribbon to display based on flyer properties

export type RibbonType = 'PREMIUM' | 'PHOTO' | 'IMAGE_AND_PREMIUM' | 'BIRTHDAY' | null;

export interface RibbonConfig {
  type: RibbonType;
  imagePath: string | null;
  text: string | null;
}

/**
 * Determines which ribbon to display based on flyer form_type and price
 * 
 * Rules:
 * - $40 or Premium form_type => PREMIUM.png
 * - form_type "With Photo" => PHOTO.png  
 * - $40 + "With Photo" => IMAGE & PREMIUM.png
 * - form_type "Birthday" => BIRTHDAY.png
 */
export function getRibbonConfig(flyer: any): RibbonConfig {
  if (!flyer) {
    return { type: null, imagePath: null, text: null };
  }

  const price = typeof flyer.price === 'string' 
    ? parseFloat(flyer.price.replace('$', '')) 
    : flyer.price;
  
  const formType = flyer.form_type?.toLowerCase() || '';
  const isPremium = price >= 40 || formType.includes('premium');
  const isPhoto = formType.includes('photo') || formType === 'with photo';
  const isBirthday = formType.includes('birthday');

  // Priority order:
  // 1. Birthday
  if (isBirthday) {
    return {
      type: 'BIRTHDAY',
      imagePath: '/ribbons/BIRTHDAY.png',
      text: 'BIRTHDAY'
    };
  }

  // 2. Premium + Photo (both)
  if (isPremium && isPhoto) {
    return {
      type: 'IMAGE_AND_PREMIUM',
      imagePath: '/ribbons/IMAGE & PREMIUM.png',
      text: 'IMAGE & PREMIUM'
    };
  }

  // 3. Premium only
  if (isPremium) {
    return {
      type: 'PREMIUM',
      imagePath: '/ribbons/PREMIUM.png',
      text: 'PREMIUM'
    };
  }

  // 4. Photo only
  if (isPhoto) {
    return {
      type: 'PHOTO',
      imagePath: '/ribbons/PHOTO.png',
      text: 'PHOTO'
    };
  }

  // No ribbon
  return { type: null, imagePath: null, text: null };
}
