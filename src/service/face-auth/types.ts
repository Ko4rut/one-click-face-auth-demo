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
