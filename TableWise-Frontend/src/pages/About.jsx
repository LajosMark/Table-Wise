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
          <p>TableWise is more than just a restaurant; it's a community experience. Launched in 2024, our mission is to blend technology and gastronomy to provide our guests with the fastest and most delicious service possible.</p>
        </article>
        <article className="feature-card" data-cy="about-feature-card">
          <h3>Our Vision</h3>
          <p>We envision a future where dining is not just about the food, but about the entire experience. Our goal is to be the leading destination for culinary excellence and exceptional service.</p>
        </article>
        <article className="feature-card" data-cy="about-feature-card">
          <h3>Our Values</h3>
          <p>At TableWise, we are committed to quality, innovation, and customer satisfaction. We believe in treating every guest like family and providing an experience that exceeds expectations.</p>
        </article>
      </div>
    </section>
  )
}

export default About