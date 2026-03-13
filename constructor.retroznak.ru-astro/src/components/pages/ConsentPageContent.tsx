import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/landing/Logo";
import { Button } from "@/components/ui/button";
import { typograf } from "@/lib/typograf";

export default function ConsentPageContent() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Main Content */}
      <main className="container py-12">
        <article className="prose prose-sm prose-zinc dark:prose-invert mx-auto max-w-4xl">
          {/* Logo */}
          <div className="mb-8 mt-4">
            <a href="/#hero" className="inline-block transition-opacity hover:opacity-80" aria-label={typograf("Вернуться на главную")}>
              <Logo className="h-7 w-auto" />
            </a>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
            {typograf("Согласие на обработку персональных данных пользователя сайта")}
          </h1>

          <section className="space-y-6">
            <div>
              <p className="text-muted-foreground leading-relaxed">
                {typograf("Настоящим, в соответствии с требованиями Федерального закона от 27.07.2006 № 152-ФЗ «О персональных данных», свободно, своей волей и в своем интересе выражаю свое безусловное согласие на обработку моих персональных данных ООО «Три Кита», зарегистрированным в соответствии с законодательством Российской Федерации по адресу: 634041, г. Томск, ул. Енисейская, д. 32б, ОГРН 1097017011079 (далее — Оператор).")}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">{typograf("1. Персональные данные")}</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                {typograf("Персональные данные — любая информация, относящаяся к прямо или косвенно определенному или определяемому физическому лицу (субъекту персональных данных).")}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {typograf("Настоящее Согласие выдано мною на обработку следующих персональных данных:")}
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mt-3">
                <li>{typograf("Фамилия, имя, отчество;")}</li>
                <li>{typograf("Номер мобильного телефона;")}</li>
                <li>{typograf("Адрес электронной почты (E-mail);")}</li>
                <li>{typograf("Город проживания;")}</li>
                <li>{typograf("Адрес доставки;")}</li>
                <li>{typograf("Информация о предпочтительном способе связи (мессенджер);")}</li>
                <li>{typograf("Информация, введенная в поля для комментариев и вопросов на сайте;")}</li>
                <li>
                  {typograf("Данные о посещении сайта, включая технические характеристики устройства, с которого осуществляется доступ (тип браузера, операционная система).")}
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">{typograf("2. Цели обработки персональных данных")}</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                {typograf("Согласие дано Оператору для совершения следующих действий с моими персональными данными с использованием средств автоматизации и/или без использования таких средств:")}
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>{typograf("сбор;")}</li>
                <li>{typograf("запись;")}</li>
                <li>{typograf("систематизация;")}</li>
                <li>{typograf("накопление;")}</li>
                <li>{typograf("хранение;")}</li>
                <li>{typograf("уточнение (обновление, изменение);")}</li>
                <li>{typograf("извлечение;")}</li>
                <li>{typograf("использование;")}</li>
                <li>{typograf("передачу (распространение, предоставление, доступ);")}</li>
                <li>{typograf("обезличивание;")}</li>
                <li>{typograf("блокирование;")}</li>
                <li>{typograf("удаление;")}</li>
                <li>{typograf("уничтожение.")}</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                {typograf("Обработка персональных данных осуществляется Оператором в следующих целях:")}
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mt-3">
                <li>{typograf("обработка входящих запросов физических лиц с целью оказания консультирования;")}</li>
                <li>{typograf("предоставление информации о продукции и услугах;")}</li>
                <li>{typograf("подготовка коммерческих предложений и расчетов;")}</li>
                <li>{typograf("связь с пользователем в рамках оказания услуг;")}</li>
                <li>{typograf("подготовка и отправка ответов на запросы пользователей сайта;")}</li>
                <li>{typograf("направление маркетинговых материалов;")}</li>
                <li>
                  {typograf("анализ посещаемости веб-сайта")}{" "}
                  <a href="https://land.retroznak.ru" className="text-orange-600 dark:text-orange-500 hover:underline">
                    https://land.retroznak.ru
                  </a>
                  ;
                </li>
                <li>{typograf("улучшение качества работы сайта и предоставляемых услуг;")}</li>
                <li>{typograf("исполнение договорных обязательств.")}</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">
                {typograf("3. Правовые основания обработки персональных данных")}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {typograf("Оператор обрабатывает персональные данные пользователя только в случае их заполнения и/или отправки пользователем самостоятельно через специальные формы, расположенные на сайте")}{" "}
                <a href="https://land.retroznak.ru" className="text-orange-600 dark:text-orange-500 hover:underline">
                  https://land.retroznak.ru
                </a>
                {typograf(", либо направленные Оператору посредством электронной почты. Заполняя соответствующие формы и/или отправляя свои персональные данные Оператору, пользователь выражает свое согласие с данным документом.")}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">{typograf("4. Условия обработки и передачи данных")}</h2>
              <ol className="list-decimal list-inside space-y-3 text-muted-foreground">
                <li>
                  {typograf("Настоящее согласие дается на период до истечения сроков хранения соответствующей информации или документов, содержащих указанную информацию, определяемых в соответствии с законодательством Российской Федерации.")}
                </li>
                <li>
                  {typograf("Согласие может быть отозвано мною в любое время на основании письменного заявления, направленного в адрес Оператора по электронной почте")}{" "}
                  <a href="mailto:***REMOVED***" className="text-orange-600 dark:text-orange-500 hover:underline">
                    ***REMOVED***
                  </a>{" "}
                  {typograf("с пометкой «Отзыв согласия на обработку персональных данных».")}
                </li>
                <li>
                  {typograf("В случае отзыва мною согласия на обработку персональных данных Оператор вправе продолжить обработку персональных данных без моего согласия при наличии оснований, указанных в пунктах 2 – 11 части 1 статьи 6, части 2 статьи 10 и части 2 статьи 11 Федерального закона №152-ФЗ «О персональных данных» от 27.07.2006.")}
                </li>
                <li>
                  {typograf("Данное согласие действует в течение всего периода хранения персональных данных, если иное не предусмотрено законодательством Российской Федерации.")}
                </li>
              </ol>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">{typograf("5. Права субъекта персональных данных")}</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                {typograf("В любой момент я имею право на:")}
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>{typograf("получение информации, касающейся обработки моих персональных данных;")}</li>
                <li>
                  {typograf("требование уточнения, блокирования или уничтожения моих персональных данных в случае, если они являются неполными, устаревшими, неточными;")}
                </li>
                <li>{typograf("отзыв настоящего согласия путем направления письменного заявления Оператору;")}</li>
                <li>
                  {typograf("обжалование действий или бездействия Оператора в уполномоченный орган по защите прав субъектов персональных данных или в судебном порядке.")}
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">{typograf("6. Защита персональных данных")}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {typograf("Оператор принимает необходимые правовые, организационные и технические меры для защиты персональных данных от неправомерного или случайного доступа к ним, уничтожения, изменения, блокирования, копирования, предоставления, распространения персональных данных, а также от иных неправомерных действий в отношении персональных данных.")}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">{typograf("7. Дополнительные условия")}</h2>
              <ol className="list-decimal list-inside space-y-3 text-muted-foreground">
                <li>
                  {typograf("Оператор вправе вносить изменения в настоящее Согласие. При внесении изменений в актуальной редакции указывается дата последнего обновления. Новая редакция Согласия вступает в силу с момента ее размещения на сайте, если иное не предусмотрено новой редакцией Согласия.")}
                </li>
                <li>
                  {typograf("Актуальная версия Согласия размещена на сайте по адресу")}{" "}
                  <a href="https://land.retroznak.ru/consent" className="text-orange-600 dark:text-orange-500 hover:underline">
                    https://land.retroznak.ru/consent
                  </a>
                  .
                </li>
                <li>
                  {typograf("К настоящему Согласию применяется российское законодательство. Все возможные споры, вытекающие из настоящего Согласия, подлежат разрешению в соответствии с российским законодательством.")}
                </li>
                <li>
                  {typograf("Перед использованием сайта я подтверждаю, что ознакомлен(а) с условиями настоящего Согласия, текст Согласия мне понятен, последствия его действия мне известны, и я даю свое добровольное согласие на обработку моих персональных данных на указанных выше условиях.")}
                </li>
              </ol>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">{typograf("8. Контактная информация")}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {typograf("По всем вопросам, касающимся обработки персональных данных, можно обратиться к Оператору:")}
              </p>
              <div className="space-y-2 text-muted-foreground mt-4">
                <p>
                  <strong className="font-semibold text-foreground">{typograf("Организация:")}</strong> {typograf("ООО «Три Кита»")}
                </p>
                <p>
                  <strong className="font-semibold text-foreground">{typograf("ОГРН:")}</strong> 1097017011079
                </p>
                <p>
                  <strong className="font-semibold text-foreground">{typograf("Адрес:")}</strong> {typograf("634041, г. Томск, ул. Енисейская, д. 32б")}
                </p>
                <p>
                  <strong className="font-semibold text-foreground">Email:</strong>{" "}
                  <a href="mailto:***REMOVED***" className="text-orange-600 dark:text-orange-500 hover:underline">
                    ***REMOVED***
                  </a>
                </p>
                <p>
                  <strong className="font-semibold text-foreground">{typograf("Телефон:")}</strong>{" "}
                  <a href="tel:+79832322206" className="text-orange-600 dark:text-orange-500 hover:underline">
                    +7 (983) 232-22-06
                  </a>
                </p>
              </div>
            </div>
          </section>
        </article>

        {/* Back to Home Button */}
        <div className="mt-12 flex justify-center">
          <Button asChild size="lg" className="bg-orange-600 hover:bg-orange-700 text-white shadow-lg">
            <a href="/#hero" className="inline-flex items-center gap-2">
              <ArrowLeft className="h-5 w-5" />
              <span>Назад на главную</span>
            </a>
          </Button>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="border-t border-border bg-secondary/30 py-8">
        <div className="container">
          <div className="flex flex-col gap-3 text-center text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:text-left">
            <p>ООО «Три Кита» · ОГРН 1097017011079</p>
            <p>© 2017–{currentYear} ООО «Три Кита». Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
