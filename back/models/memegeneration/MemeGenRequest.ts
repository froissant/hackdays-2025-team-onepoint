export interface MemeGenRequest {
  template_id: string;
  style?: string[];
  text: string[];
  layout?: string;
  font?: string;
  extension?: string;
  redirect?: boolean;
}