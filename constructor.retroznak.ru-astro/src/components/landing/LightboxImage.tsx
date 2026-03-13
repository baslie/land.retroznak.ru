import {
  isImageFitCover,
  isImageSlide,
  useLightboxProps,
  useLightboxState,
  type Slide,
  type RenderSlideProps,
} from "yet-another-react-lightbox";

function isValidImage(slide: Slide) {
  return (
    isImageSlide(slide) &&
    typeof slide.width === "number" &&
    typeof slide.height === "number"
  );
}

export default function LightboxImage({ slide, offset, rect }: RenderSlideProps) {
  const {
    on: { click },
    carousel: { imageFit },
  } = useLightboxProps();

  const { currentIndex } = useLightboxState();

  const cover = isImageSlide(slide) && isImageFitCover(slide, imageFit);

  if (!isValidImage(slide)) return undefined;

  const slideWidth = slide.width ?? 1200;
  const slideHeight = slide.height ?? 800;

  const width = !cover
    ? Math.round(
        Math.min(rect.width, (rect.height / slideHeight) * slideWidth),
      )
    : rect.width;

  const height = !cover
    ? Math.round(
        Math.min(rect.height, (rect.width / slideWidth) * slideHeight),
      )
    : rect.height;

  return (
    <div style={{ position: "relative", width, height }}>
      <img
        alt={slide.alt ?? ""}
        src={slide.src ?? ""}
        loading="eager"
        draggable={false}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: cover ? "cover" : "contain",
          cursor: click ? "pointer" : undefined,
        }}
        onClick={
          offset === 0 ? () => click?.({ index: currentIndex }) : undefined
        }
      />
    </div>
  );
}