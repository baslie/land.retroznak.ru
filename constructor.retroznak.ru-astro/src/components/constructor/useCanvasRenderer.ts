"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import type { ConstructorState, SignTypeId } from "@/types/constructor";
import {
  signTypesConfig,
  ralColorsCatalog,
  darkPlateColors,
  defaultPlateColor,
  renderingConfig,
  svgPaths,
  canvasDimensions,
  streetPrefixPattern,
  placeholders,
  materialValues,
} from "@/content/constructor-config";

interface CanvasRendererOptions {
  state: ConstructorState;
  totalPrice: number;
}

interface StreetData {
  prefix: string;
  street: string;
}

export function useCanvasRenderer({ state, totalPrice }: CanvasRendererOptions) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // Кэш изображений
  const imagesRef = useRef<Map<string, HTMLImageElement>>(new Map());

  // Загрузка шрифтов
  useEffect(() => {
    const loadFonts = async () => {
      try {
        const font18 = new FontFace(
          "Retroznak18",
          "url(/constructor/fonts/retroznak18.woff)"
        );
        const font16 = new FontFace(
          "Retroznak16",
          "url(/constructor/fonts/retroznak16.woff)"
        );

        await Promise.all([font18.load(), font16.load()]);

        document.fonts.add(font18);
        document.fonts.add(font16);

        setFontsLoaded(true);
      } catch (error) {
        console.error("Error loading fonts:", error);
        setFontsLoaded(true); // Продолжаем даже при ошибке
      }
    };

    loadFonts();
  }, []);

  // Загрузка изображения
  const loadImage = useCallback((src: string): Promise<HTMLImageElement> => {
    const cached = imagesRef.current.get(src);
    if (cached) return Promise.resolve(cached);

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        imagesRef.current.set(src, img);
        resolve(img);
      };
      img.onerror = reject;
      img.src = src;
    });
  }, []);

  // Парсинг названия улицы
  const parseStreetName = useCallback((input: string): StreetData => {
    const match = input.match(streetPrefixPattern);
    if (match) {
      return { prefix: match[1], street: match[2] };
    }
    return { prefix: "", street: input };
  }, []);

  // Измерение ширины текста
  const measureTextWidth = useCallback(
    (ctx: CanvasRenderingContext2D, text: string, fontSize: number): number => {
      ctx.font = `${fontSize}px Retroznak18`;
      return ctx.measureText(text).width;
    },
    []
  );

  // Отрисовка цветного прямоугольника
  const drawColorSwatch = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      width: number,
      height: number,
      fillColor: string
    ) => {
      ctx.strokeStyle = renderingConfig.colors.swatchStroke;
      ctx.fillStyle = fillColor;
      ctx.fillRect(x, y, width, height);
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);
    },
    []
  );

  // Отрисовка тени текста (рельеф)
  const drawTextShadow = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      text: string,
      x: number,
      y: number,
      hasRelief: boolean
    ) => {
      if (!hasRelief) return;

      ctx.save();
      ctx.shadowColor = renderingConfig.relief.shadowColor;
      ctx.shadowBlur = renderingConfig.relief.shadowBlur;
      ctx.fillText(text, x, y);
      ctx.restore();
    },
    []
  );

  // Отрисовка обводки текста (рельеф)
  const drawTextStroke = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      text: string,
      x: number,
      y: number,
      hasRelief: boolean,
      plateColor: string
    ) => {
      if (!hasRelief) return;

      ctx.save();
      ctx.lineJoin = "round";
      ctx.lineWidth = renderingConfig.relief.strokeWidth;
      ctx.strokeStyle = ralColorsCatalog[plateColor]?.colorStroke || "#e6e2d8ff";
      ctx.strokeText(text, x, y);
      ctx.restore();
    },
    []
  );

  // Отрисовка кругового текста улицы
  const drawCircularStreetName = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      streetData: StreetData,
      signType: SignTypeId,
      plateColor: string,
      hasRelief: boolean
    ) => {
      const { prefix, street: rawStreet } = streetData;
      let street = rawStreet;

      // Нормализация кавычек
      street = street
        .replace(/([а-яА-Яa-zA-Z0-9,:;])[",»]/g, "$1)")
        .replace(/[«]/g, "(")
        .replace(/[»]/g, ")");

      const config = signTypesConfig[signType];
      const { width, height } = canvasDimensions;
      const centerX = width / 2;
      const centerY = height / 2 + config.circular.yOffset;
      const radius = config.circular.radius;
      const maxAngle = config.circular.maxAngle;
      const baseFontSize = config.circular.baseFontSize;
      const textAdapt = renderingConfig.textAdaptation;
      const prefixFontSize = baseFontSize * textAdapt.prefixSizeRatio;

      let letterSpacing = config.circular.letterSpacing;
      if (hasRelief) {
        letterSpacing += config.circular.reliefSpacingBonus;
      }
      const prefixLetterSpacing = letterSpacing * textAdapt.prefixSpacingRatio;

      // Формирование сегментов текста
      const segments: { text: string; size: number; spacing: number }[] = [];
      if (prefix && prefix.trim()) {
        segments.push({ text: prefix.trim(), size: prefixFontSize, spacing: prefixLetterSpacing });
      }
      if (street && street.trim()) {
        if (prefix && prefix.trim()) {
          segments.push({ text: " ", size: prefixFontSize, spacing: prefixLetterSpacing });
        }
        segments.push({ text: street.trim(), size: baseFontSize, spacing: letterSpacing });
      }

      if (segments.length === 0) return;

      // Разбиение на символы
      const characters: { ch: string; fontSize: number; spacing: number }[] = [];
      segments.forEach((segment) => {
        for (const char of segment.text) {
          characters.push({ ch: char, fontSize: segment.size, spacing: segment.spacing });
        }
      });

      // Адаптивное уменьшение размера
      let angles: number[] = [];
      while (true) {
        angles = [];
        for (let i = 0; i < characters.length - 1; i++) {
          const curr = characters[i];
          const next = characters[i + 1];
          const charWidth =
            (textAdapt.prefixSizeRatio *
              (measureTextWidth(ctx, curr.ch, curr.fontSize) / 2 +
                measureTextWidth(ctx, next.ch, next.fontSize) / 2 +
                Math.max(curr.spacing, next.spacing))) /
            (2 * Math.PI * radius) *
            360;
          angles.push(charWidth);
        }

        if (angles.reduce((sum, a) => sum + a, 0) <= maxAngle) break;

        characters.forEach((char) => {
          char.fontSize *= textAdapt.shrinkFactor;
          char.spacing *= textAdapt.shrinkFactor;
        });
      }

      // Отрисовка по дуге
      let currentAngle = 90 - angles.reduce((sum, a) => sum + a, 0) / 2;
      const textRadius = radius + textAdapt.textRadiusOffset * Math.max(...characters.map((c) => c.fontSize));
      const isDarkPlate = darkPlateColors.includes(plateColor);

      ctx.save();
      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";
      ctx.fillStyle = isDarkPlate
        ? renderingConfig.colors.lightText
        : renderingConfig.colors.darkText;

      for (let i = characters.length - 1; i >= 0; i--) {
        const { ch, fontSize } = characters[i];
        ctx.font = `${fontSize}px Retroznak18`;

        const angleRad = (currentAngle * Math.PI) / 180;
        const x = centerX + textRadius * Math.cos(angleRad);
        const y = centerY + textRadius * Math.sin(angleRad);

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angleRad - Math.PI / 2);

        drawTextShadow(ctx, ch, 0, 0, hasRelief);
        drawTextStroke(ctx, ch, 0, 0, hasRelief, plateColor);
        ctx.fillText(ch, 0, 0);

        ctx.restore();

        if (i > 0) {
          currentAngle += angles[i - 1];
        }
      }

      ctx.restore();
    },
    [measureTextWidth, drawTextShadow, drawTextStroke]
  );

  // Отрисовка центрального номера
  const drawCentralHouseNumber = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      houseNumber: string,
      signType: SignTypeId,
      plateColor: string,
      hasRelief: boolean
    ) => {
      const normalized = houseNumber
        .replace(/([а-яА-Яa-zA-Z,:;])"/g, "$1)")
        .replace(/[«]/g, "(")
        .replace(/[»]/g, ")");

      const config = signTypesConfig[signType];
      const { width, height } = canvasDimensions;
      const centerX = width / 2;
      const centerY = height / 2 + config.central.yOffset;
      let fontSize = config.central.fontSize;
      const maxWidth = config.central.maxWidth;
      const textAdapt = renderingConfig.textAdaptation;

      // Уменьшение шрифта если не помещается
      while (measureTextWidth(ctx, normalized, fontSize) > maxWidth && fontSize > textAdapt.minFontSize) {
        fontSize -= 1;
      }

      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";

      const y = centerY + textAdapt.centralTextYOffset * fontSize;
      ctx.font = `${fontSize}px Retroznak18`;

      const isDarkPlate = darkPlateColors.includes(plateColor);

      drawTextShadow(ctx, normalized, centerX, y, hasRelief);
      ctx.fillStyle = isDarkPlate
        ? renderingConfig.colors.lightText
        : renderingConfig.colors.darkText;
      drawTextStroke(ctx, normalized, centerX, y, hasRelief, plateColor);
      ctx.fillText(normalized, centerX, y);
    },
    [measureTextWidth, drawTextShadow, drawTextStroke]
  );

  // Отрисовка перспективного номера (в окнах)
  const drawPerspectiveHouseNumber = useCallback(
    (ctx: CanvasRenderingContext2D, houseNumber: string, signType: SignTypeId) => {
      const normalized = houseNumber
        .replace(/([а-яА-Яa-zA-Z,:;])"/g, "$1)")
        .replace(/[«]/g, "(")
        .replace(/[»]/g, ")");

      const config = signTypesConfig[signType];
      const { width, height } = canvasDimensions;
      const rightX = width / 2 + config.windows.xOffset;
      const leftX = width / 2 - config.windows.xOffset;
      const baseY = height / 2 - config.windows.yOffset;
      let fontSize = config.windows.fontSize;

      const { skewY, scaleX, scaleY, maxWidth } = config.windows;
      const textAdapt = renderingConfig.textAdaptation;

      // Уменьшение шрифта
      while (measureTextWidth(ctx, normalized, fontSize) > maxWidth && fontSize > textAdapt.minFontSize) {
        fontSize -= 1;
      }

      const y = baseY + textAdapt.windowsTextYOffset * fontSize;
      ctx.font = `${fontSize}px Retroznak18`;
      ctx.fillStyle = renderingConfig.colors.darkText;
      ctx.textBaseline = "alphabetic";

      // Правое окно
      ctx.save();
      ctx.translate(rightX, y);
      ctx.transform(scaleX, skewY, 0, scaleY, 0, 0);
      ctx.fillText(normalized, 0, 0);
      ctx.restore();

      // Левое окно
      ctx.save();
      ctx.translate(leftX, y);
      ctx.transform(scaleX, -skewY, 0, scaleY, 0, 0);
      ctx.fillText(normalized, 0, 0);
      ctx.restore();
    },
    [measureTextWidth]
  );

  // Отрисовка SVG крыши
  const drawRoofShape = useCallback(
    (ctx: CanvasRenderingContext2D, roofColor: string, signType: SignTypeId) => {
      const config = signTypesConfig[signType];
      const roofPath = new Path2D(svgPaths.roof[signType]);
      const { width, height } = canvasDimensions;

      ctx.save();
      ctx.translate(
        width / 2 - config.roof.translateY,
        height / 2 - config.roof.translateX
      );
      ctx.scale(config.roof.scale!, config.roof.scale!);
      ctx.globalCompositeOperation = ralColorsCatalog[roofColor]?.overlay || "multiply";
      ctx.fillStyle = ralColorsCatalog[roofColor]?.color || "#584440ff";
      ctx.fill(roofPath);
      ctx.restore();
    },
    []
  );

  // Отрисовка SVG тарелки
  const drawPlateShape = useCallback(
    (ctx: CanvasRenderingContext2D, plateColor: string, signType: SignTypeId) => {
      const config = signTypesConfig[signType];
      const platePath = new Path2D(svgPaths.plate[signType]);
      const { width, height } = canvasDimensions;

      ctx.save();
      ctx.translate(
        width / 2 - config.plate.translateY,
        height / 2 + config.plate.translateX
      );
      ctx.scale(config.plate.scale!, config.plate.scale!);
      ctx.globalCompositeOperation = ralColorsCatalog[plateColor]?.overlay || "soft-light";
      ctx.fillStyle = ralColorsCatalog[plateColor]?.color || "#ece3cbff";
      ctx.fill(platePath);
      ctx.restore();
    },
    []
  );

  // Отрисовка иконки фотореле
  const drawPhotoRelayIcon = useCallback(
    (ctx: CanvasRenderingContext2D, isEnabled: boolean, signType: SignTypeId) => {
      // Заливка белым фоном
      ctx.save();
      ctx.fillStyle = renderingConfig.colors.canvasBackground;
      ctx.fillRect(0, 0, canvasDimensions.width, canvasDimensions.height);
      ctx.restore();

      if (!isEnabled) return;

      const config = signTypesConfig[signType];
      const relePath = new Path2D(svgPaths.photoRelay);
      const { width, height } = canvasDimensions;
      const iconParams = renderingConfig.photoRelayIcon;

      ctx.save();
      ctx.translate(
        width / 2 + config.photoRelay.translateY,
        height / 2 - config.photoRelay.translateX
      );
      ctx.scale(iconParams.scale, iconParams.scale);
      ctx.rotate(iconParams.rotation);
      ctx.fillStyle = renderingConfig.colors.darkText;
      ctx.fill(relePath);
      ctx.restore();
    },
    []
  );

  // Отрисовка информационной панели
  const drawInfoPanel = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      roofColor: string,
      plateColor: string,
      signType: SignTypeId,
      material: string,
      price: number
    ) => {
      const config = signTypesConfig[signType];
      const panel = renderingConfig.infoPanel;
      const panelFonts = renderingConfig.panelFonts;
      const isDarkPlate = darkPlateColors.includes(plateColor);

      ctx.fillStyle = renderingConfig.colors.darkText;
      ctx.textAlign = "left";
      ctx.textBaseline = "top";

      // Левая колонка
      ctx.font = panelFonts.label;
      ctx.fillText("Домовой знак:", panel.leftMargin, 35);

      ctx.font = panelFonts.value;
      ctx.fillText(config.name, panel.leftMargin, 70);

      ctx.font = panelFonts.label;
      ctx.fillText("Цвет крыши:", panel.leftMargin, 130);
      drawColorSwatch(ctx, panel.leftMargin, 165, panel.swatchWidth, panel.swatchHeight, ralColorsCatalog[roofColor]?.colorInfo || "#44322D");

      ctx.fillStyle = renderingConfig.colors.darkText;
      ctx.fillText(`RAL ${roofColor}`, panel.ralTextOffset, 171);

      ctx.fillText("Цвет тарелки:", panel.leftMargin, 220);
      drawColorSwatch(ctx, panel.leftMargin, 255, panel.swatchWidth, panel.swatchHeight, ralColorsCatalog[plateColor]?.colorInfo || "#F7F9EF");

      ctx.fillStyle = renderingConfig.colors.darkText;
      ctx.fillText(`RAL ${plateColor}`, panel.ralTextOffset, 261);

      ctx.fillText("Цвет текста:", panel.leftMargin, 310);

      if (isDarkPlate) {
        drawColorSwatch(ctx, panel.leftMargin, 345, panel.swatchWidth, panel.swatchHeight, ralColorsCatalog[defaultPlateColor]?.colorInfo || "#F7F9EF");
        ctx.fillStyle = renderingConfig.colors.darkText;
        ctx.fillText(`RAL ${defaultPlateColor}`, panel.ralTextOffset, 350);
      } else {
        drawColorSwatch(ctx, panel.leftMargin, 345, panel.swatchWidth, panel.swatchHeight, ralColorsCatalog["9005"]?.colorInfo || "#0A0A0D");
        ctx.fillText("RAL 9005", panel.ralTextOffset, 350);
      }

      // Правая колонка
      ctx.textAlign = "right";
      ctx.fillText("Размер знака:", panel.rightMargin, 35);

      ctx.font = renderingConfig.panelFonts.smallValue;
      ctx.fillText(config.size, panel.rightMargin, 70);

      ctx.font = panelFonts.label;
      ctx.fillText("Тип стали:", panel.rightMargin, 130);

      ctx.font = renderingConfig.panelFonts.smallValue;
      ctx.fillText(material, panel.rightMargin, 165);

      ctx.font = panelFonts.label;
      ctx.fillText("Цена знака:", panel.rightMargin, 220);

      ctx.font = renderingConfig.panelFonts.smallValue;
      ctx.fillText(`${price} ₽`, panel.rightMargin, 255);
    },
    [drawColorSwatch]
  );

  // Отрисовка эффекта подсветки
  const drawLightEffect = useCallback(
    (ctx: CanvasRenderingContext2D, lightImage: HTMLImageElement, isEnabled: boolean) => {
      if (!isEnabled) return;

      const { width, height } = canvasDimensions;
      const lightEffect = renderingConfig.lightEffect;

      ctx.save();
      ctx.globalCompositeOperation = lightEffect.firstLayer.operation;
      ctx.globalAlpha = lightEffect.firstLayer.alpha;
      ctx.drawImage(lightImage, 0, 0, width, height);
      ctx.globalCompositeOperation = lightEffect.secondLayer.operation;
      ctx.globalAlpha = lightEffect.secondLayer.alpha;
      ctx.drawImage(lightImage, 0, 0, width, height);
      ctx.restore();
    },
    []
  );

  // Основная функция рендеринга
  const render = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas || !fontsLoaded) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsLoading(true);

    try {
      const {
        signType,
        street,
        houseNumber,
        material,
        roofColor,
        plateColor,
        hasRelief,
        hasBacklight,
        hasPhotoRelay,
      } = state;

      const config = signTypesConfig[signType];

      // Загрузка изображений
      const [bgImage, lightImage] = await Promise.all([
        loadImage(config.backgroundImage),
        loadImage(config.lightEffectImage),
      ]);

      // Очистка и фон
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawPhotoRelayIcon(ctx, hasPhotoRelay, signType);

      // Фоновое изображение
      ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

      // Цветные элементы
      drawRoofShape(ctx, roofColor, signType);
      drawPlateShape(ctx, plateColor, signType);

      // Эффект подсветки
      drawLightEffect(ctx, lightImage, hasBacklight);

      // Текст
      const displayStreet = street || placeholders.street;
      const displayHouse = houseNumber || placeholders.house;
      const streetData = parseStreetName(displayStreet);

      drawCircularStreetName(ctx, streetData, signType, plateColor, hasRelief);
      drawCentralHouseNumber(ctx, displayHouse, signType, plateColor, hasRelief);
      drawPerspectiveHouseNumber(ctx, displayHouse, signType);

      // Информационная панель
      drawInfoPanel(
        ctx,
        roofColor,
        plateColor,
        signType,
        materialValues[material],
        totalPrice
      );
    } catch (error) {
      console.error("Error rendering canvas:", error);
    } finally {
      setIsLoading(false);
    }
  }, [
    state,
    totalPrice,
    fontsLoaded,
    loadImage,
    parseStreetName,
    drawPhotoRelayIcon,
    drawRoofShape,
    drawPlateShape,
    drawLightEffect,
    drawCircularStreetName,
    drawCentralHouseNumber,
    drawPerspectiveHouseNumber,
    drawInfoPanel,
  ]);

  // Эффект рендеринга при изменении состояния
  useEffect(() => {
    render();
  }, [render]);

  // Экспорт изображения
  const exportImage = useCallback((): string | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    return canvas.toDataURL("image/png");
  }, []);

  // Скачивание изображения
  const downloadImage = useCallback((filename = "Мой ретрознак.png") => {
    const dataUrl = exportImage();
    if (!dataUrl) return;

    const link = document.createElement("a");
    link.download = filename;
    link.href = dataUrl;
    link.click();
  }, [exportImage]);

  return {
    canvasRef,
    isLoading,
    fontsLoaded,
    render,
    exportImage,
    downloadImage,
  };
}
