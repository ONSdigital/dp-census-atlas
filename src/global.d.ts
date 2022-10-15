export declare global {
  interface Window {
    // add dataLayer to window object for Google Tag Manager
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - `any` type is OK for this one property
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataLayer: any;
  }
}
