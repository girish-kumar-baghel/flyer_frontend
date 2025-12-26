import React from 'react';
import { getRibbonConfig } from '@/lib/ribbon-helper';

interface FlyerRibbonProps {
    flyer: any;
}

/**
 * Displays the appropriate ribbon image based on flyer properties
 * Ribbons: PREMIUM, PHOTO, IMAGE & PREMIUM, BIRTHDAY
 */
export const FlyerRibbon: React.FC<FlyerRibbonProps> = ({ flyer }) => {
    const ribbonConfig = getRibbonConfig(flyer);

    if (!ribbonConfig.type || !ribbonConfig.imagePath) {
        return null;
    }

    return (
        <div className="absolute top-0 left-0 w-10 h-10 overflow-visible pointer-events-none z-20">
            <img
                src={ribbonConfig.imagePath}
                alt={ribbonConfig.text || 'Ribbon'}
                className="w-full h-full object-contain"
            />
        </div>
    );
};
