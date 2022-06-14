export type ProjectType = typeof projectTypes[number];

// prettier-ignore
export enum ProjectCategory {
  FANTASY        = 1,
  ACTION         = 2,
  DRAMA          = 3,
  SPORT          = 5,
  'SCI-FI'       = 7,
  COMEDY         = 8,
  SLICE_OF_LIFE  = 9,
  ROMANCE        = 10,
  ADVENTURE      = 13,
  YAOI           = 23,
  SEINEN         = 49,
  TRAP           = 25,
  GENDER_BLENDER = 26,
  SECOND_LIFE    = 45,
  ISEKAI         = 44,
  SCHOOL_LIFE    = 43,
  MYSTERY        = 32,
  ONE_SHOT       = 48,
  HORROR         = 47,
  DOUJINSHI      = 37,
  SHOUNEN        = 46,
  SHOUJO         = 42,
  YURI           = 24,
  GOURMET        = 41,
  HAREM          = 50,
  REINCANATE     = 51,
}

export const projectTypes = ['manga', 'novel', 'comic', 'fiction'] as const;
