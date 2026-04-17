const Contact = ({ t }) => {
  return (
    <section className="page-container contact-page">
      <div className="contact-top">
        <div className="contact-hero">
          <span className="section-label">{t.contact.sectionLabel}</span>
          <h1>{t.contact.title}</h1>
          <p className="page-intro">{t.contact.intro}</p>
        </div>

        <aside className="contact-summary">
          <h2>{t.contact.summaryTitle}</h2>
          <p>{t.contact.summaryText}</p>
          <div className="contact-pill">{t.contact.emailLabel}: hello@example.com</div>
          <div className="contact-pill">{t.contact.phoneLabel}: +36 20 123 4567</div>
        </aside>
      </div>

      <div className="contact-grid">
        <article className="contact-card contact-card--soft">
          <h3>{t.contact.messageCardTitle}</h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
            at dictum mauris. Aliquam erat volutpat.
          </p>
          <p><strong>{t.contact.emailLabel}:</strong> hello@example.com</p>
          <p><strong>{t.contact.phoneLabel}:</strong> +36 20 123 4567</p>
        </article>

        <article className="contact-card contact-card--soft">
          <h3>{t.contact.locationCardTitle}</h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
            bibendum orci vitae augue lacinia, non tincidunt nunc aliquam.
          </p>
          <p>{t.contact.address}</p>
          <p>{t.contact.hours}</p>
        </article>
      </div>
    </section>
  )
}

export default Contact