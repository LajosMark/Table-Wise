const About = () => {
  return (
    <section className="page-container about-page" data-cy="about-page">
      <header className="about-hero" data-cy="about-hero">
        <span className="section-label" data-cy="about-section-label">About Us</span>
        <h1 data-cy="about-title">Our Story</h1>
        <p className="page-intro" data-cy="about-intro">Learn more about our company and what drives us.</p>
      </header>

      <div className="about-features" data-cy="about-features">
        <article className="feature-card" data-cy="about-feature-card">
          <h3>Our Mission</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vehicula, odio sit amet vestibulum interdum, urna est feugiat urna.</p>
        </article>
        <article className="feature-card" data-cy="about-feature-card">
          <h3>Our Mission</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vehicula, odio sit amet vestibulum interdum, urna est feugiat urna.</p>
        </article>
        <article className="feature-card" data-cy="about-feature-card">
          <h3>Our Mission</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vehicula, odio sit amet vestibulum interdum, urna est feugiat urna.</p>
        </article>
      </div>
    </section>
  )
}

export default About