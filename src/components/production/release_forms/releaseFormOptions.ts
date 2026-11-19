import { ReleaseFormItem } from '../../../types';

export interface ReleaseFormOption {
  type: ReleaseFormItem['formType'];
  pillLabel: string;
  title: string;
  hint: string;
}

export const RELEASE_FORM_OPTIONS: ReleaseFormOption[] = [
  {
    type: 'TALENT',
    pillLabel: 'Actor Release',
    title: 'Actor & Cast Release',
    hint: 'On-camera performance, voice, and likeness rights',
  },
  {
    type: 'MINOR',
    pillLabel: 'Minor (Parental)',
    title: 'Minor Parental Consent',
    hint: 'Parent or legal guardian permission for under-18 cast',
  },
  {
    type: 'LOCATION',
    pillLabel: 'Location Agreement',
    title: 'Location Access Release',
    hint: 'Property owner permission to film on site',
  },
  {
    type: 'EXTRA',
    pillLabel: 'Background Extra',
    title: 'Background Extra Release',
    hint: 'Quick consent form for walk-ons and supporting crowd',
  },
  {
    type: 'MATERIALS',
    pillLabel: 'Artwork / Props',
    title: 'Artwork, Props & Materials',
    hint: 'Clearance for paintings, brands, signage, or bespoke props',
  },
  {
    type: 'MUSIC',
    pillLabel: 'Music Clearance',
    title: 'Music Sync & Master Licence',
    hint: 'Composer and recording rights for songs or score',
  },
  {
    type: 'CROWD_NOTICE',
    pillLabel: 'Crowd Notice Poster',
    title: 'Public Filming Notice',
    hint: 'Printable doorway or street poster for public locations',
  },
];
