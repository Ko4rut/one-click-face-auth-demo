export type EnrollmentRequest = {
  userId: string;
  images: Blob[];
};

export type EnrollmentResponse = {
  user_id: string;
  is_enrolled: boolean;
  accepted_samples: number;
  rejected_samples: number;
  required_samples: number;
  rejection_codes: string[];
};
