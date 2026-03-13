/**
 * Типы для конструктора ретрознаков
 */

// Типы знаков
export type SignTypeId = "len" | "pet" | "mini";

// Материалы
export type MaterialType = "regular" | "galvanized" | "stainless";

// Параметры кругового текста
export interface CircularTextConfig {
  baseFontSize: number;
  maxAngle: number;
  radius: number;
  yOffset: number;
  letterSpacing: number;
  reliefSpacingBonus: number;
}

// Параметры центрального номера
export interface CentralTextConfig {
  fontSize: number;
  yOffset: number;
  maxWidth: number;
}

// Параметры номера в окнах
export interface WindowsTextConfig {
  xOffset: number;
  yOffset: number;
  fontSize: number;
  maxWidth: number;
  skewY: number;
  scaleX: number;
  scaleY: number;
}

// Позиция SVG элемента
export interface PositionConfig {
  translateY: number;
  translateX: number;
  scale?: number;
}

// Конфигурация типа знака
export interface SignTypeConfig {
  id: SignTypeId;
  name: string;
  size: string;
  basePrice: number;
  backgroundImage: string;
  lightEffectImage: string;
  circular: CircularTextConfig;
  central: CentralTextConfig;
  windows: WindowsTextConfig;
  roof: PositionConfig;
  plate: PositionConfig;
  photoRelay: PositionConfig;
}

// RAL цвет
export interface RALColor {
  code: string;
  overlay: "multiply" | "soft-light";
  color: string;
  colorInfo: string;
  colorStroke: string;
}

// Состояние конструктора
export interface ConstructorState {
  signType: SignTypeId;
  street: string;
  houseNumber: string;
  material: MaterialType;
  roofColor: string;
  plateColor: string;
  hasRelief: boolean;
  hasBacklight: boolean;
  hasPhotoRelay: boolean;
}

// Конфигурация цен
export interface PriceConfig {
  base: Record<SignTypeId, number>;
  options: {
    backlight: number;
    photoRelay: number;
    reliefSymbols: number;
  };
  colorSurcharge: {
    oneColor: number;
    twoColors: number;
  };
  material: {
    galvanized: Record<SignTypeId, number>;
    stainless: Record<SignTypeId, number>;
  };
}

// Параметры рендеринга
export interface RenderingConfig {
  lightEffect: {
    firstLayer: {
      operation: GlobalCompositeOperation;
      alpha: number;
    };
    secondLayer: {
      operation: GlobalCompositeOperation;
      alpha: number;
    };
  };
  relief: {
    shadowColor: string;
    shadowBlur: number;
    strokeWidth: number;
  };
  panelFonts: {
    label: string;
    value: string;
    smallValue: string;
  };
  colors: {
    lightText: string;
    darkText: string;
    canvasBackground: string;
    swatchStroke: string;
  };
  photoRelayIcon: {
    scale: number;
    rotation: number;
  };
  textAdaptation: {
    minFontSize: number;
    shrinkFactor: number;
    prefixSizeRatio: number;
    prefixSpacingRatio: number;
    textRadiusOffset: number;
    centralTextYOffset: number;
    windowsTextYOffset: number;
  };
  infoPanel: {
    leftMargin: number;
    rightMargin: number;
    swatchWidth: number;
    swatchHeight: number;
    ralTextOffset: number;
  };
}

// Размеры Canvas
export interface CanvasDimensions {
  width: number;
  height: number;
}

// Лимиты полей ввода
export interface InputLimits {
  streetMaxLength: number;
  houseMaxLength: number;
}

// Action types для reducer
export type ConstructorAction =
  | { type: "SET_SIGN_TYPE"; payload: SignTypeId }
  | { type: "SET_STREET"; payload: string }
  | { type: "SET_HOUSE_NUMBER"; payload: string }
  | { type: "SET_MATERIAL"; payload: MaterialType }
  | { type: "SET_ROOF_COLOR"; payload: string }
  | { type: "SET_PLATE_COLOR"; payload: string }
  | { type: "TOGGLE_RELIEF" }
  | { type: "TOGGLE_BACKLIGHT" }
  | { type: "TOGGLE_PHOTO_RELAY" }
  | { type: "RESET" };

// Данные для заказа
export interface ConstructorOrderData {
  // Контактные данные
  phone: string;
  email?: string;
  comment?: string;
  consent: boolean;

  // Конфигурация знака
  signType: SignTypeId;
  signTypeName: string;
  street: string;
  houseNumber: string;
  material: MaterialType;
  materialName: string;
  roofColor: string;
  plateColor: string;
  hasRelief: boolean;
  hasBacklight: boolean;
  hasPhotoRelay: boolean;

  // Цена
  totalPrice: number;

  // Эскиз (base64)
  sketchImage?: string;
}
