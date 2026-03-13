import type { Metadata } from "next";
import { typograf } from "@/lib/typograf";

const title = typograf("Инструкция по монтажу ретрознака");
const description = typograf(
  "Пошаговая инструкция по подготовке фасада, установке крепежа и подключению подсветки ретрознака."
);

export const metadata: Metadata = {
  title,
  description,
};

const steps = [
  {
    title: typograf("Подготовка фасада"),
    points: [
      typograf("Проверьте геометрию стены и убедитесь, что поверхность сухая и очищена от пыли."),
      typograf("Разметьте точки крепления согласно индивидуальному макету, который предоставляет Retroznak."),
      typograf("Подведите кабель питания 220 В к предполагаемому месту подключения подсветки."),
    ],
  },
  {
    title: typograf("Крепление основы"),
    points: [
      typograf("Просверлите отверстия под анкерные болты согласно маркировке на монтажном шаблоне."),
      typograf("Установите дистанционные втулки и закрепите базовую пластину ретрознака на анкеры."),
      typograf("Проверьте горизонталь уровнем и при необходимости скорректируйте положение."),
    ],
  },
  {
    title: typograf("Подключение подсветки"),
    points: [
      typograf("Соедините проводку ретрознака с подготовленным кабелем питания через влагозащищённые клеммы."),
      typograf("Закрепите блок питания внутри фасада или в ближайшей технической нише с доступом для обслуживания."),
      typograf("Проведите тестовый запуск, убедившись в равномерном свечении и отсутствии мерцания."),
    ],
  },
  {
    title: typograf("Финальная проверка"),
    points: [
      typograf("Защитите соединения термоусадкой и герметиком, чтобы исключить попадание влаги."),
      typograf("Закройте декоративные элементы и проверьте, что все крепления затянуты."),
      typograf("Сделайте фото установленного знака и отправьте менеджеру Retroznak для акта приёмки."),
    ],
  },
];

const updatedYear = new Date().getFullYear();

export default function InstallationGuidePage() {
  return (
    <main className="bg-retro-charcoal text-retro-ivory">
      <section className="container space-y-10 py-16">
        <div className="space-y-4">
          <span className="text-xs font-semibold text-accent-platinum">{typograf("Документы")}</span>
          <h1 className="text-3xl font-semibold sm:text-4xl">{title}</h1>
          <p className="max-w-3xl text-base text-muted-foreground">{description}</p>
        </div>

        <article className="space-y-12 rounded-3xl border border-border/70 bg-retro-graphite/80 p-8">
          <p className="text-sm text-muted-foreground">
            {typograf("Материал подготовлен для монтажных бригад и клиентов Retroznak. Перед установкой убедитесь, что у вас есть актуальный монтажный макет и спецификация крепежа. При возникновении вопросов свяжитесь с менеджером по телефону")}{" "}
            <a className="underline decoration-accent-platinum/60" href="tel:+79990000000">+7 (999) 000-00-00</a>{" "}
            {typograf("или по электронной почте")}{" "}
            <a className="underline decoration-accent-platinum/60" href="mailto:hello@retrozna.ru">hello@retrozna.ru</a>.
          </p>

          <div className="space-y-10">
            {steps.map((step) => (
              <section key={step.title} className="space-y-4">
                <h2 className="text-2xl font-semibold text-retro-ivory">{step.title}</h2>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {step.points.map((point) => (
                    <li key={point} className="flex gap-3">
                      <span className="mt-1 inline-flex h-2 w-2 shrink-0 rounded-full bg-accent-platinum" aria-hidden />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          <div className="rounded-2xl border border-border/60 bg-retro-charcoal/80 p-6">
            <h2 className="text-xl font-semibold text-retro-ivory">{typograf("Перед сдачей объекта")}</h2>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="mt-1 inline-flex h-2 w-2 shrink-0 rounded-full bg-accent-platinum" aria-hidden />
                <span>{typograf("Проверьте работу подсветки в дневном и ночном режимах.")}</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 inline-flex h-2 w-2 shrink-0 rounded-full bg-accent-platinum" aria-hidden />
                <span>{typograf("Убедитесь, что блок питания доступен для обслуживания и подписан.")}</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 inline-flex h-2 w-2 shrink-0 rounded-full bg-accent-platinum" aria-hidden />
                <span>{typograf("Задокументируйте серийный номер ретрознака и дату установки.")}</span>
              </li>
            </ul>
          </div>
        </article>

        <p className="text-xs text-muted-foreground/80">
          {typograf(`Документ обновлён ${updatedYear} Retroznak. Скачайте версию в PDF из внутреннего портала, если требуется подпись и печать.`)}
        </p>
      </section>
    </main>
  );
}
