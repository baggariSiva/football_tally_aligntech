export interface Team {
  name: string;
  mp: number;
  w: number;
  l: number;
  p: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
