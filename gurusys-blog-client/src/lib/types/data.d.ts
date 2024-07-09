type UserProfile = {
  _id: string;

  personal_info: {
    avatarUrl: string;
    email: string;
    username: string;
    bio: string;
    fullname?: string;
  };

  social_links: {
    youtube: string;
    instagram: string;
    facebook: string;
    twitter: string;
    github: string;
    website: string;
  };

  account_info: {
    total_posts: number;
    total_reads: number;
  };

  createdAt?: string | Date;
  updatedAt?: string | Date;
  joinedAt?: string | Date;
};

type ProfileData = { user: UserProfile };
