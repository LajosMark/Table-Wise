const Contact = () => {
  return (
    <section className="page-container contact-page" data-cy="contact-page">
      <div className="contact-top" data-cy="contact-top">
        <div className="contact-hero" data-cy="contact-hero">
          <span className="section-label" data-cy="contact-label">Contact Us</span>
          <h1 data-cy="contact-title">Let’s talk about the experience</h1>
          <p className="page-intro" data-cy="contact-intro">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Suspendisse potenti. Curabitur vitae risus eget nulla porttitor interdum.</p>
        </div>

        <aside className="contact-summary" data-cy="contact-summary">
          <h2 data-cy="contact-quick-contacts-title">Quick contacts</h2>
          <p data-cy="contact-quick-contacts-copy">Send us a message and we will reply within 24 hours.</p>
          <div className="contact-pill" data-cy="contact-pill">Email: hello@example.com</div>
          <div className="contact-pill" data-cy="contact-pill">Phone: +36 20 123 4567</div>
        </aside>
      </div>

      <div className="contact-grid">
        <article className="contact-card contact-card--soft">
          <h3>Send us a message</h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
            at dictum mauris. Aliquam erat volutpat.
          </p>
          <p><strong>Email:</strong> hello@example.com</p>
          <p><strong>Phone:</strong> +36 20 123 4567</p>
        </article>

        <article className="contact-card contact-card--soft">
          <h3>Our address</h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
            bibendum orci vitae augue lacinia, non tincidunt nunc aliquam.
          </p>
          <p>Budapest, Main street 12.</p>
          <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
        </article>
      </div>
    </section>
  )
}

export default Contact