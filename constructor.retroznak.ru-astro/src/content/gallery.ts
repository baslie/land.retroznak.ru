import type { GalleryContent } from "@/types/content";
import { typografContent } from "@/lib/typograf";
import { asset } from "@/lib/base-path";

export const galleryContent: GalleryContent = typografContent({
  title: "Процесс создания ретрознаков",
  subtitle: "Каждый знак проходит через руки мастеров. От первого эскиза до финальной установки — смотрите, как рождаются наши работы",
  images: [
    {
      id: "process-01",
      src: asset("/process/01.jpg"),
      alt: "Фото 1",
      width: 1200,
      height: 800,
    },
    {
      id: "process-02",
      src: asset("/process/02.jpg"),
      alt: "Фото 2",
      width: 1200,
      height: 800,
    },
    {
      id: "process-03",
      src: asset("/process/03.jpg"),
      alt: "Фото 3",
      width: 1200,
      height: 800,
    },
    {
      id: "process-04",
      src: asset("/process/04.jpg"),
      alt: "Фото 4",
      width: 1200,
      height: 800,
    },
    {
      id: "process-05",
      src: asset("/process/05.jpg"),
      alt: "Фото 5",
      width: 1200,
      height: 800,
    },
    {
      id: "process-06",
      src: asset("/process/06.jpg"),
      alt: "Фото 6",
      width: 1200,
      height: 800,
    },
    {
      id: "process-07",
      src: asset("/process/07.jpg"),
      alt: "Фото 7",
      width: 1200,
      height: 800,
    },
    {
      id: "process-08",
      src: asset("/process/08.jpg"),
      alt: "Фото 8",
      width: 1200,
      height: 800,
    },
    {
      id: "process-09",
      src: asset("/process/09.jpg"),
      alt: "Фото 9",
      width: 1200,
      height: 800,
    },
    {
      id: "process-10",
      src: asset("/process/10.jpg"),
      alt: "Фото 10",
      width: 1200,
      height: 800,
    },
    {
      id: "process-11",
      src: asset("/process/11.jpg"),
      alt: "Фото 11",
      width: 1200,
      height: 800,
    },
    {
      id: "process-12",
      src: asset("/process/12.jpg"),
      alt: "Фото 12",
      width: 1200,
      height: 800,
    },
  ],
});
