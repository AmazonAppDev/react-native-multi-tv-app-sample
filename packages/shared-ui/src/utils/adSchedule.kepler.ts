import type { UseVegaAdsOptions } from 'react-native-vega-ads';

/**
 * Client-side video ads (VAST 4 / VMAP 1) for the Vega player screen. Off by default (null).
 * To turn them on, set your ad server's VMAP URL, or VAST tags with their times:
 *
 *   export const AD_SCHEDULE: AdSchedule = {
 *     breaks: [
 *       { offset: 'start', vastUrl: 'https://ads.example.com/preroll.xml' },
 *       { offset: 60, vastUrl: 'https://ads.example.com/midroll.xml' },
 *     ],
 *   };
 *
 * GOOGLE_IMA_SAMPLE_VMAP (Google's public IMA sample) is for trying it out only.
 * Ads are played by react-native-vega-ads (https://github.com/kalenkou/react-native-vega-ads).
 * Ad media URLs must be HTTPS.
 */
export type AdSchedule = NonNullable<UseVegaAdsOptions['source']>;

export const GOOGLE_IMA_SAMPLE_VMAP: AdSchedule = {
  vmapUrl:
    'https://pubads.g.doubleclick.net/gampad/ads?iu=/21775744923/external/vmap_ad_samples&sz=640x480&cust_params=sample_ar%3Dpremidpost&ciu_szs=300x250&gdfp_req=1&ad_rule=1&output=vmap&unviewed_position_start=1&env=vp&impl=s&cmsid=496&vid=short_onecue&correlator=[CACHEBUSTING]',
};

export const AD_SCHEDULE: AdSchedule | null = null;
