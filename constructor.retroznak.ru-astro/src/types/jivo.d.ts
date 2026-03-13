/**
 * Jivo Chat Widget API Type Definitions
 * @see https://www.jivochat.com/docs/widget/
 */

export interface JivoApiOpenParams {
  /** Widget state to open: 'call' | 'menu' | 'chat' */
  start?: "call" | "menu" | "chat";
}

export interface JivoApiResult {
  result: "ok" | "fail";
  reason?: string;
  error?: string;
}

export interface JivoContactInfo {
  client_name: string | null;
  email: string | null;
  phone: string | null;
  description: string | null;
}

export interface JivoApi {
  /** Opens the chat widget */
  open: (params?: JivoApiOpenParams) => JivoApiResult;

  /** Closes/minimizes the chat widget */
  close: () => JivoApiResult;

  /** Returns current widget mode: 'online' | 'offline' */
  chatMode: () => "online" | "offline";

  /** Returns contact information */
  getContactInfo: () => JivoContactInfo;

  /** Returns number of unread messages */
  getUnreadMessagesCount: () => number;

  /** Clears chat history */
  clearHistory: () => void;
}

declare global {
  interface Window {
    jivo_api?: JivoApi;
    jivo_init?: () => void;
    jivo_destroy?: () => void;
    jivo_onLoadCallback?: () => void;
    jivo_onOpen?: () => void;
    jivo_onClose?: () => void;
  }
}

export {};
