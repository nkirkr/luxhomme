import type { Metadata } from 'next'
import { SiteHeader } from '@/components/layout/site-header/SiteHeader'
import styles from './service.module.css'
import clsx from 'clsx'

export const metadata: Metadata = {
  title: 'Сервис и гарантия | Luxhommè',
  description:
    'Гарантийное обслуживание, возврат и обмен товаров Luxhommè. Условия, контакты сервисной службы.',
}

export default function ServicePage() {
  return (
    <div className={styles.page}>
      <div className={styles.headerWrap}>
        <SiteHeader solid />
      </div>

      <div className={styles.content}>
        {/* ═══════════ Сервис и гарантия — title ═══════════ */}
        <div className={styles.sectionTitle}>
          <div className={styles.divider} />
          <h1 className={styles.heading}>Сервис и гарантия</h1>
          <div className={styles.divider} />
        </div>

        {/* ─── Instruction header ─── */}
        <div className={styles.instrHeader}>
          <p className={styles.instrQuestion}>Как воспользоваться гарантией?</p>
          <p className={styles.instrGuide}>Пошаговая инструкция</p>
        </div>

        {/* ─── Steps 1–5 ─── */}
        <div className={styles.stepsList}>
          {/* Step 1 */}
          <div className={styles.step}>
            <div className={styles.stepNum}>1</div>
            <div className={styles.stepContent}>
              <p className={styles.stepBold}>Не паникуйте и не ремонтируйте сами!</p>
              <p className={styles.stepText}>Самостоятельное вскрытие лишает права на гарантию.</p>
            </div>
          </div>
          <div className={styles.divider} />

          {/* Step 2 */}
          <div className={styles.step}>
            <div className={styles.stepNum}>2</div>
            <div className={styles.stepContent}>
              <p className={clsx(styles.stepBoldBlack, styles.boldSecondStep)}>
                Назовите номер заказа, модель техники и опишите проблему. Наш специалист проведет
                первичную диагностику и даст дальнейшие инструкции.
              </p>
              <div className={styles.stepContacts}>
                <div className={styles.stepContact}>
                  <p className={styles.stepContactLabel}>Напишите нам в Службу заботы</p>
                  <p className={styles.stepContactValue}>t.me/LuxhommeServiceBot</p>
                </div>
                <div className={styles.stepContact}>
                  <p className={styles.stepContactLabel}>Позвоните на ГЛ по номеру</p>
                  <p className={styles.stepContactValue}>8 800 505 71 30</p>
                </div>
                <div className={styles.stepContact}>
                  <p className={styles.stepContactLabel}>Напишите на почту</p>
                  <p className={styles.stepContactValue}>care@saudagar-group.com</p>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.divider} />

          {/* Step 3 */}
          <div className={styles.step}>
            <div className={styles.stepNum}>3</div>
            <div className={styles.stepContent}>
              <p className={styles.stepBoldBlack}>Доставка товара в сервисный центр:</p>
              <div className={styles.stepSubColumns}>
                <div className={styles.stepSubCol}>
                  <div>
                    <span className={styles.stepSubBadge}>Вариант А</span>
                    <p className={styles.stepSubBadgeSmall}>(бесплатный для клиента):</p>
                  </div>
                  <p className={styles.stepSubText}>
                    Мы организуем бесплатный вывоз неисправной техники курьерской службой СДЭК в
                    случае подтвержденного гарантийного случая.
                  </p>
                </div>
                <div className={styles.stepSubCol}>
                  <div>
                    <span className={styles.stepSubBadge}>Вариант Б</span>
                  </div>
                  <p className={styles.stepSubText}>
                    Вы можете самостоятельно доставить товар по адресу нашего сервисного центра:
                    Республика Татарстан, Пестречинский район, село Кощаково, ул. Промышленная, д 5.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.divider} />

          {/* Step 4 */}
          <div className={styles.step}>
            <div className={styles.stepNum}>4</div>
            <div className={styles.stepContent}>
              <p className={styles.stepBoldBlack}>Диагностика</p>
              <p className={styles.stepText}>
                Проводится в течение <span className={styles.stepHighlight}>5 рабочих дней</span> с
                момента поступления товара в наш сервисный центр. По ее итогам мы сообщим вам,
                является ли случай гарантийным.
              </p>
            </div>
          </div>
          <div className={styles.divider} />

          {/* Step 5 */}
          <div className={styles.step}>
            <div className={styles.stepNum}>5</div>
            <div className={styles.stepContent}>
              <p className={styles.stepBoldBlack}>Ремонт или замена.</p>
              <p className={styles.stepText}>
                Срок ремонта по гарантии составляет{' '}
                <span className={styles.stepHighlight}>не более 45 дней</span> (согласно ЗоЗП). В
                случае если ремонт невозможен или нецелесообразен, мы заменим товар на аналогичный
                или вернем деньги.
              </p>
            </div>
          </div>
          <div className={styles.divider} />
        </div>

        {/* ─── Service contacts ─── */}
        <div className={styles.contactCards}>
          <div className={styles.contactCardPhone}>
            <p className={styles.contactLabel}>Контакты сервисной службы</p>
            <p className={styles.contactValue}>8 800 505 71 30</p>
          </div>
          <div className={styles.contactCardInfo}>
            <div className={styles.contactRow}>
              <p className={styles.contactLabel}>Email</p>
              <p className={styles.contactSmallValue}>care@saudagar-group.com</p>
            </div>
            <div className={styles.contactRow}>
              <p className={styles.contactLabel}>Режим работы</p>
              <p className={styles.contactSmallValue}>с 9:00 до 18:00 по МСК</p>
            </div>
          </div>
        </div>

        <div className={styles.divider} />

        {/* ═══════════ Гарантия — two columns ═══════════ */}
        <div className={styles.twoColumns} style={{ marginTop: '40rem' }}>
          {/* Column 1: Гарантийные обязательства */}
          <div className={styles.column}>
            <h3 className={styles.colTitle}>1. Гарантийные обязательства</h3>
            <div className={styles.colBlock}>
              <p className={styles.colBlockLabel}>Гарантия на технику</p>
              <div className={styles.colBlockContent}>
                <ol className={styles.olList}>
                  <li className={styles.olItem}>
                    1. Вся техника, представленная в нашем магазине, является новой и оригинальной,
                    что подтверждается полной комплектацией и установленными гарантийными сроками.
                  </li>
                  <li className={styles.olItem}>
                    2. Гарантийный срок на товар составляет 12 месяцев с момента передачи товара
                    покупателю. Гарантия распространяется на недостатки и неисправности, возникшие
                    по вине производителя/импортера.
                  </li>
                  <li className={styles.olItem}>
                    3. Для активации гарантийного обслуживания сохраняйте товарный и/или кассовый
                    чек, а также целостность заводских пломб и гарантийных стикеров.
                  </li>
                </ol>
              </div>
            </div>
          </div>

          {/* Column 2: Что не покрывается гарантией? */}
          <div className={styles.column}>
            <h3 className={styles.colTitle}>2. Что не покрывается гарантией?</h3>
            <div className={styles.colBlock}>
              <p className={styles.colBlockLabel}>
                Условия, при которых гарантия
                <br />
                не действует
              </p>
              <div className={styles.colBlockContentNarrow}>
                <ol className={styles.olList}>
                  <li className={styles.olItem}>
                    1. Механические повреждения (вмятины, сколы, трещины), возникшие в результате
                    небрежной эксплуатации, транспортировки или хранения.
                  </li>
                  <li className={styles.olItem}>
                    2. Повреждения, вызванные попаданием внутрь корпуса посторонних предметов,
                    веществ, жидкостей или насекомых.
                  </li>
                  <li className={styles.olItem}>
                    3. Повреждения, возникшие в результате стихийных бедствий (пожар, наводнение,
                    удар молнии), аварийных ситуаций в электросети (скачки напряжения, кроме
                    случаев, когда техника должна была быть защищена встроенными предохранителями).
                  </li>
                  <li className={styles.olItem}>
                    4. Естественный износ расходных материалов (например, фильтры, уплотнители,
                    лампы). Неисправности, вызванные нарушением правил эксплуатации, указанных в
                    инструкции (например, использование бытовой техники в коммерческих целях).
                  </li>
                  <li className={styles.olItem}>
                    5. Неисправности, вызванные самостоятельным ремонтом или попыткой вскрытия
                    лицами, не имеющими аккредитации у производителя.
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════ Возврат ═══════════ */}
        <div className={styles.sectionTitle}>
          <div className={styles.divider} />
          <h2 className={styles.heading}>Возврат</h2>
          <div className={styles.divider} />
        </div>

        <div className={styles.instrHeader}>
          <p className={styles.instrQuestion}>Как оформить возврат?</p>
          <p className={styles.instrGuide}>Пошаговая инструкция</p>
        </div>

        <div className={styles.stepsList}>
          {/* Return Step 1 */}
          <div className={styles.step}>
            <div className={styles.stepNum}>1</div>
            <div className={styles.stepContent}>
              <p className={styles.stepText}>
                Заполните заявку на возврат внизу этой страницы или свяжитесь с нами по телефону
                горячей линии{' '}
                <a href="tel:88005057130">
                  <strong>8 800 505 71 30</strong>
                </a>{' '}
                или напишите нам в службу заботы{' '}
                <a href="https://t.me/LuxhommeServiceBot" target="_blank" rel="noopener noreferrer">
                  <strong>(@LuxhommeServiceBot)</strong>
                </a>{' '}
                и сообщите номер заказа и причину возврата.
              </p>
            </div>
          </div>
          <div className={styles.divider} />

          {/* Return Step 2 */}
          <div className={styles.step}>
            <div className={styles.stepNum}>2</div>
            <div className={styles.stepContent}>
              <p className={styles.stepText}>
                Наш специалист проконсультирует вас и поможет решить Ваш вопрос.
              </p>
            </div>
          </div>
          <div className={styles.divider} />

          {/* Return Step 3 */}
          <div className={styles.step}>
            <div className={styles.stepNum}>3</div>
            <div className={styles.stepContent}>
              <p className={styles.stepText}>
                Заполните заявление, упакуйте товар со всеми комплектующими и документами (копия
                чека, копия паспорта).
              </p>
            </div>
          </div>
          <div className={styles.divider} />

          {/* Return Step 4 */}
          <div className={styles.step}>
            <div className={styles.stepNum}>4</div>
            <div className={styles.stepContent}>
              <p className={styles.stepBoldBlack}>
                Мы вышлем вам трек-номер для отправки через СДЭК:
              </p>
              <div className={styles.returnBadgesRow}>
                <div className={styles.returnBadgeCol}>
                  <span className={styles.stepSubBadge}>При браке</span>
                  <p className={styles.stepSubText}>Мы создаем заказ с оплатой за наш счет.</p>
                </div>
                <div className={styles.returnBadgeCol}>
                  <span className={styles.stepSubBadge}>Если товар качественный</span>
                  <p className={styles.stepSubText}>Вы создаете заказ с оплатой за ваш счет</p>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.divider} />
        </div>

        {/* ═══════════ Return — two columns ═══════════ */}
        <div className={styles.twoColumns}>
          {/* Column 1 */}
          <div className={styles.column}>
            <h3 className={styles.colTitle}>
              1. Возврат товара надлежащего
              <br />
              качества (не подошел)
            </h3>

            <div className={styles.colBlock}>
              <p className={styles.colBlockLabel}>Если товар вам не подошел</p>
              <div className={styles.colBlockContent}>
                <ol className={styles.olList}>
                  <li className={styles.olItem}>
                    1. Согласно ст. 25 Федерального закона «О защите прав потребителей», вы можете
                    вернуть или обменять товар надлежащего качества в течение 7 дней с момента
                    получения заказа.
                  </li>
                  <li className={styles.olItem}>
                    2. Внимание! В соответствии с Правилами дистанционной торговли (Постановление
                    Правительства РФ № 2463), мы уведомляем вас, что этот срок продлевается до 3
                    месяцев, если вместе с товаром вам было направлено письменное уведомление о
                    порядке и сроках возврата (что мы и делаем с каждым заказом).
                  </li>
                </ol>
              </div>
            </div>

            <div className={styles.colBlock}>
              <p className={styles.colBlockLabel}>Условия возврата:</p>
              <div className={styles.colBlockContent}>
                <ol className={styles.olList}>
                  <li className={styles.olItem}>
                    1. Товар не был в употреблении, сохранен его товарный вид, потребительские
                    свойства, пломбы и фабричные ярлыки.
                  </li>
                  <li className={styles.olItem}>
                    2. Полная комплектация: упаковка, инструкции, все аксессуары.
                  </li>
                  <li className={styles.olItem}>
                    3. Имеются документы, подтверждающие покупку (чек или номер онлайн-заказа).
                  </li>
                  <li className={styles.olItem}>
                    4. <strong>За чей счет?</strong> Покупатель оплачивает стоимость обратной
                    пересылки товара до нашего склада.
                  </li>
                </ol>
              </div>
            </div>
          </div>

          {/* Column 2 */}
          <div className={styles.column}>
            <h3 className={styles.colTitle}>
              2. Возврат товара ненадлежащего
              <br />
              качества (брак)
            </h3>

            <div className={styles.colBlock}>
              <p className={styles.colBlockLabel}>
                Обнаружен брак или
                <br />
                неисправность
              </p>
              <div className={styles.colBlockContentNarrow}>
                <p className={styles.colBlockBold}>
                  Если вы обнаружили заводской брак или неисправность, возникшую не по вашей вине,
                  вы вправе потребовать (на выбор):
                </p>
                <ol className={styles.olListSmall}>
                  <li className={styles.olItem}>
                    1. Безвозмездного устранения недостатков (гарантийный ремонт).
                  </li>
                  <li className={styles.olItem}>2. Соразмерного уменьшения покупной цены.</li>
                  <li className={styles.olItem}>
                    3. Замены на товар этой же или другой модели с перерасчетом цены.
                  </li>
                  <li className={styles.olItem}>
                    4. Расторжения договора купли-продажи и полного возврата уплаченной суммы.
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════ Обмен и возврат — Form ═══════════ */}
        <div className={styles.sectionTitle}>
          <div className={styles.divider} />
          <h2 className={styles.heading}>Обмен и возврат</h2>
          <div className={styles.divider} />
        </div>

        <div className={styles.formSection}>
          <div className={styles.formWrap}>
            <div className={styles.formFields}>
              <div className={styles.formField}>
                <label className={styles.formLabel}>
                  ФИО <span>*</span>
                </label>
                <input type="text" className={styles.formInput} />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>
                  Телефон <span>*</span>
                </label>
                <input type="tel" className={styles.formInput} />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>
                  E-mail <span>*</span>
                </label>
                <input type="email" className={styles.formInput} />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>
                  Номер заказа <span>*</span>
                </label>
                <input type="text" className={styles.formInput} />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>
                  Товар <span>*</span>
                </label>
                <div className={styles.formSelect}>
                  <span />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/icons/form-arrow.svg" alt="" />
                </div>
                <p className={styles.formSelectHint}>Выберите товар, который хотите вернуть</p>
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>
                  Причина возврата <span>*</span>
                </label>
                <div className={styles.formSelect}>
                  <span />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/icons/form-arrow.svg" alt="" />
                </div>
                <p className={styles.formSelectHint}>Выберите причину возврата</p>
              </div>

              <label className={styles.formCheckbox}>
                <input type="checkbox" className={styles.checkboxBox} />
                <p className={styles.checkboxText}>
                  Нажимая кнопку «Отправить», я даю свое согласие на обработку моих персональных
                  данных, в соответствии с Федеральным законом от 27.07.2006 года №152-ФЗ «О
                  персональных данных», на условиях и для целей, определенных в Согласии на
                  обработку персональных данных
                </p>
              </label>
            </div>

            <div className={styles.formActions}>
              <button type="submit" className={styles.btnSubmit}>
                Отправить
              </button>
              <div className={styles.reportLink}>
                <a href="#" className={styles.reportLinkText}>
                  Сообщить о нарушении
                </a>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/icons/question.svg" alt="" className={styles.reportIcon} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
