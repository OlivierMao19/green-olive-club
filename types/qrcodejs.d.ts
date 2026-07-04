declare module "@/lib/qrcodejs/qrcode.js" {
  export interface QRCodeOptions {
    text: string;
    width?: number;
    height?: number;
    colorDark?: string;
    colorLight?: string;
    correctLevel?: number;
  }

  export interface QRCodeInstance {
    clear: () => void;
    makeCode: (text: string) => void;
  }

  export interface QRCodeConstructor {
    new (el: HTMLElement | string, options: QRCodeOptions | string): QRCodeInstance;
    CorrectLevel: {
      L: number;
      M: number;
      Q: number;
      H: number;
    };
  }

  const QRCode: QRCodeConstructor;
  export default QRCode;
}
