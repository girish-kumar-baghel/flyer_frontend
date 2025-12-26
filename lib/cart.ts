import { AddToCartData } from '@/stores/CartStore'

export interface FlyerFormDetails {
  eventDetails?: {
    presenting?: string;
    mainTitle?: string;
    date?: Date | null;
    flyerInfo?: string;
    addressAndPhone?: string;
    venueLogo?: File | null;
    venueText?: string;
  };
  extras?: {
    storySizeVersion?: boolean;
    customFlyer?: boolean;
    animatedFlyer?: boolean;
    instagramPostSize?: boolean;
  };
  djsOrArtists?: Array<{ name: string; image?: File | null }>;
  host?: Array<{ name: string; image?: File | null }> | null;
  sponsors?: {
    sponsor1?: File | null;
    sponsor2?: File | null;
    sponsor3?: File | null;
  };
  customNotes?: string;
}

export interface CartPayloadOptions {
  flyerId?: string;
  categoryId?: string;
  totalPrice?: string;
  subtotal?: string;
  imageUrl?: string;
  deliveryTime?: string;
  webUserId?: string;
}

/**
 * Creates FormData for adding to cart API request
 * Matches the exact structure from your Postman example
 */
export const createCartFormData = (
  data: FlyerFormDetails,
  options: CartPayloadOptions = {}
): FormData => {
  const formData = new FormData();

  const extras = data?.extras ?? {
    storySizeVersion: false,
    customFlyer: false,
    animatedFlyer: false,
    instagramPostSize: true
  };

  const djs = data?.djsOrArtists ?? [];
  const hosts = Array.isArray(data?.host) ? data.host : [];
  const sponsors = data?.sponsors ?? {};

  // Basic event information
  formData.append('presenting', data?.eventDetails?.presenting || 'Presenting Event');
  formData.append('event_title', data?.eventDetails?.mainTitle || 'Event Title');
  formData.append('event_date', data?.eventDetails?.date
    ? new Date(data.eventDetails.date).toISOString().split('T')[0]
    : new Date().toISOString().split('T')[0]);
  formData.append('flyer_info', data?.eventDetails?.flyerInfo || 'Event Information');
  formData.append('address_phone', data?.eventDetails?.addressAndPhone || 'Address and Phone');

  // Options/Extras
  formData.append('story_size_version', String(extras.storySizeVersion));
  formData.append('custom_flyer', String(extras.customFlyer));
  formData.append('animated_flyer', String(extras.animatedFlyer));
  formData.append('instagram_post_size', String(extras.instagramPostSize));

  // Additional information
  formData.append('custom_notes', data?.customNotes || '');

  // Product information
  formData.append('flyer_is', options.flyerId || '26');
  formData.append('category_id', options.categoryId || '9');

  // User information (will be set by the calling component)
  formData.append('user_id', '');
  formData.append('web_user_id', options.webUserId || '');

  // Pricing
  formData.append('delivery_time', options.deliveryTime || '1 Hour');
  formData.append('total_price', options.totalPrice || '10');
  formData.append('subtotal', options.subtotal || '10');

  // Images
  if (options.imageUrl) {
    formData.append('image_url', options.imageUrl);
  }
  
  // Venue logo
  if (data?.eventDetails?.venueLogo) {
    formData.append('venue_logo', data.eventDetails.venueLogo);
  }

  // Host files
  hosts.forEach((h, index) => {
    if (h.image) {
      if (index === 0) {
        formData.append('host_file', h.image);
      } else {
        formData.append(`host_file_${index}`, h.image);
      }
    }
  });

  // DJ files (up to 2)
  djs.forEach((dj, index) => {
    if (dj?.image && index <= 1) {
      formData.append(`dj_${index}`, dj.image);
    }
  });

  // Sponsor files (up to 3) - Handle object structure
  if (sponsors.sponsor1) {
    formData.append('sponsor_0 ', sponsors.sponsor1);
  }
  if (sponsors.sponsor2) {
    formData.append('sponsor_1', sponsors.sponsor2);
  }
  if (sponsors.sponsor3) {
    formData.append('sponsor_2', sponsors.sponsor3);
  }

  // JSON data for DJs, Host, and Sponsors (simplified to reduce length)
  const djData = djs.slice(0, 2).map(dj => ({ name: dj.name || '' }));
  const sponsorData = [
    { name: "" },
    { name: "" },
    { name: "" }
  ];

  formData.append('djs', JSON.stringify(djData));
  formData.append('host', JSON.stringify(hosts.map(h => ({ name: h.name || '' }))));
  formData.append('sponsors', JSON.stringify(sponsorData));

  // Duplicate total_price field (as seen in Postman)
  formData.append(' total_price', options.totalPrice || '10');

  return formData;
};

/**
 * Sets the user ID in FormData and returns it
 */
export const setUserIdInFormData = (formData: FormData, userId: string): FormData => {
  // Create a new FormData to avoid mutation issues
  const newFormData = new FormData();
  
  // Copy all existing entries
  for (const [key, value] of formData.entries()) {
    if (key === 'user_id') {
      newFormData.append(key, userId);
    } else {
      newFormData.append(key, value);
    }
  }
  
  return newFormData;
};
