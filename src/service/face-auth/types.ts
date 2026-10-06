export type FaceEnrollRequest = {
  user_id: string;
  frames: string[];
};

export type FaceEnrollResponse = {
  user_id: string;
  is_enrolled: boolean;
  accepted_samples: number;
  rejected_samples: number;
  required_samples: number;
  rejection_codes: string[];
};

export type FaceIdentifyRequest = {
  image: string;
};

export type FaceIdentifyResponse = {
  is_valid_frame: boolean;
  matched_id: string | null;
  score: number;
  is_match: boolean;
  validation_code: string;
  validation_message: string;
  timings?: Record<string, number>;
};

export type FaceHealthResponse = {
  status: string;
  service?: string;
};
