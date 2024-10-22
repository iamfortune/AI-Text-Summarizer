export interface FullResponse<T, U extends number> {
  'statusCode': U;
  'headers': object;
  'body': T;
}

export type PromptRequest = {
  'prompt': string;
  'chatHistory'?: Array<{ 'prompt': string; 'response': string }>;
}

export type PromptResponseOK = {
  'response': string;
}
export type PromptdefaultResponse = {
  'code'?: string;
  'message': string;
}
export type PromptResponses =
  PromptResponseOK
  | PromptdefaultResponse

export type StreamRequest = {
  'prompt': string;
  'chatHistory'?: Array<{ 'prompt': string; 'response': string }>;
}

export type StreamResponseOK = unknown
export type StreamResponses =
  FullResponse<StreamResponseOK, 200>



export interface Summary {
  setBaseUrl(newUrl: string) : void;
  setDefaultHeaders(headers: Object) : void;
  prompt(req?: PromptRequest): Promise<PromptResponses>;
  stream(req?: StreamRequest): Promise<StreamResponses>;
}
type PlatformaticFrontendClient = Omit<Summary, 'setBaseUrl'>
type BuildOptions = {
  headers?: Object
}
export default function build(url: string, options?: BuildOptions): PlatformaticFrontendClient
