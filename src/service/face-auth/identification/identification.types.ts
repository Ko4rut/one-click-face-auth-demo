export type IdentificationRequest = {
  image: Blob;
};

export type IdentificationTimings = {
  detection_ms: number;
  validation_ms: number;
  alignment_ms: number;
  extraction_ms: number;
  total_ms: number;
};

export type IdentificationResponse = {
  is_valid_frame: boolean;
  matched_id: string | null;
  score: number;
  is_match: boolean;
  validation_code: string;
  validation_message: string;
  timings: IdentificationTimings;
};
