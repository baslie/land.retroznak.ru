"use client";

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import type {
  ConstructorState,
  ConstructorAction,
  SignTypeId,
  MaterialType,
} from "@/types/constructor";
import {
  initialConstructorState,
  priceConfig,
  defaultRoofColor,
  defaultPlateColor,
  signTypesConfig,
  materialNames,
} from "@/content/constructor-config";

// Reducer для управления состоянием
function constructorReducer(
  state: ConstructorState,
  action: ConstructorAction
): ConstructorState {
  switch (action.type) {
    case "SET_SIGN_TYPE":
      return { ...state, signType: action.payload };
    case "SET_STREET":
      return { ...state, street: action.payload };
    case "SET_HOUSE_NUMBER":
      return { ...state, houseNumber: action.payload };
    case "SET_MATERIAL":
      return { ...state, material: action.payload };
    case "SET_ROOF_COLOR":
      return { ...state, roofColor: action.payload };
    case "SET_PLATE_COLOR":
      return { ...state, plateColor: action.payload };
    case "TOGGLE_RELIEF":
      return { ...state, hasRelief: !state.hasRelief };
    case "TOGGLE_BACKLIGHT":
      return { ...state, hasBacklight: !state.hasBacklight };
    case "TOGGLE_PHOTO_RELAY":
      return { ...state, hasPhotoRelay: !state.hasPhotoRelay };
    case "RESET":
      return initialConstructorState;
    default:
      return state;
  }
}

// Расчёт цены
function calculatePrice(state: ConstructorState): number {
  const { signType, material, roofColor, plateColor, hasRelief, hasBacklight, hasPhotoRelay } = state;

  let price = priceConfig.base[signType];

  // Опции
  if (hasBacklight) {
    price += priceConfig.options.backlight;
  }
  if (hasPhotoRelay) {
    price += priceConfig.options.photoRelay;
  }
  if (hasRelief) {
    price += priceConfig.options.reliefSymbols;
  }

  // Надбавка за нестандартные цвета
  const isNonStandardRoof = roofColor !== defaultRoofColor;
  const isNonStandardPlate = plateColor !== defaultPlateColor;

  if (isNonStandardRoof && isNonStandardPlate) {
    price += priceConfig.colorSurcharge.twoColors;
  } else if (isNonStandardRoof || isNonStandardPlate) {
    price += priceConfig.colorSurcharge.oneColor;
  }

  // Надбавка за материал
  if (material === "galvanized") {
    price += priceConfig.material.galvanized[signType];
  } else if (material === "stainless") {
    price += priceConfig.material.stainless[signType];
  }

  return price;
}

// Интерфейс контекста
interface ConstructorContextType {
  state: ConstructorState;
  totalPrice: number;
  signTypeName: string;
  materialName: string;
  signSize: string;
  setSignType: (type: SignTypeId) => void;
  setStreet: (street: string) => void;
  setHouseNumber: (number: string) => void;
  setMaterial: (material: MaterialType) => void;
  setRoofColor: (color: string) => void;
  setPlateColor: (color: string) => void;
  toggleRelief: () => void;
  toggleBacklight: () => void;
  togglePhotoRelay: () => void;
  reset: () => void;
}

const ConstructorContext = createContext<ConstructorContextType | null>(null);

// Provider
export function ConstructorProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(constructorReducer, initialConstructorState);

  const totalPrice = useMemo(() => calculatePrice(state), [state]);
  const signTypeName = useMemo(() => signTypesConfig[state.signType].name, [state.signType]);
  const materialName = useMemo(() => materialNames[state.material], [state.material]);
  const signSize = useMemo(() => signTypesConfig[state.signType].size, [state.signType]);

  const setSignType = useCallback((type: SignTypeId) => {
    dispatch({ type: "SET_SIGN_TYPE", payload: type });
  }, []);

  const setStreet = useCallback((street: string) => {
    dispatch({ type: "SET_STREET", payload: street });
  }, []);

  const setHouseNumber = useCallback((number: string) => {
    dispatch({ type: "SET_HOUSE_NUMBER", payload: number });
  }, []);

  const setMaterial = useCallback((material: MaterialType) => {
    dispatch({ type: "SET_MATERIAL", payload: material });
  }, []);

  const setRoofColor = useCallback((color: string) => {
    dispatch({ type: "SET_ROOF_COLOR", payload: color });
  }, []);

  const setPlateColor = useCallback((color: string) => {
    dispatch({ type: "SET_PLATE_COLOR", payload: color });
  }, []);

  const toggleRelief = useCallback(() => {
    dispatch({ type: "TOGGLE_RELIEF" });
  }, []);

  const toggleBacklight = useCallback(() => {
    dispatch({ type: "TOGGLE_BACKLIGHT" });
  }, []);

  const togglePhotoRelay = useCallback(() => {
    dispatch({ type: "TOGGLE_PHOTO_RELAY" });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  const value = useMemo(
    () => ({
      state,
      totalPrice,
      signTypeName,
      materialName,
      signSize,
      setSignType,
      setStreet,
      setHouseNumber,
      setMaterial,
      setRoofColor,
      setPlateColor,
      toggleRelief,
      toggleBacklight,
      togglePhotoRelay,
      reset,
    }),
    [
      state,
      totalPrice,
      signTypeName,
      materialName,
      signSize,
      setSignType,
      setStreet,
      setHouseNumber,
      setMaterial,
      setRoofColor,
      setPlateColor,
      toggleRelief,
      toggleBacklight,
      togglePhotoRelay,
      reset,
    ]
  );

  return (
    <ConstructorContext.Provider value={value}>
      {children}
    </ConstructorContext.Provider>
  );
}

// Hook
export function useConstructor() {
  const context = useContext(ConstructorContext);
  if (!context) {
    throw new Error("useConstructor must be used within ConstructorProvider");
  }
  return context;
}
