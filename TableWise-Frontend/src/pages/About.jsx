const About = ({ t }) => {
  return (
    <section className="page-container about-page">
      <header className="about-hero">
        <span className="section-label">{t.about.sectionLabel}</span>
        <h1>{t.about.title}</h1>
        <p className="page-intro">{t.about.intro}</p>
      </header>

      <div className="about-features">
        {t.about.features.map((feature) => (
          <article className="feature-card" key={feature.title}>
            <h3>{feature.title}</h3>
            <p>{feature.text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default About