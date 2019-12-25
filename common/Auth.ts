export interface Credentials {
  navigator: {
    readonly languages: ReadonlyArray<string>;
    readonly userAgent: string;
  };
  screen: {
    readonly availHeight: number;
    readonly availWidth: number;
    readonly height: number;
    readonly width: number;
  };
}
