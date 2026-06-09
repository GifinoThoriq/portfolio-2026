import './Contact.css'
import Shuffle from './Shuffle'
import PixelBlast from './PixelBlast'

export default function Contact() {
  const year = new Date().getFullYear()

  return (
    <section className="contact" id="contact">
      <PixelBlast
        variant="diamond"
        pixelSize={2}
        color="#e8e8e8"
        patternScale={3.75}
        patternDensity={0.2}
        pixelSizeJitter={0}
        enableRipples
        rippleSpeed={0.4}
        rippleThickness={0.12}
        rippleIntensityScale={1.5}
        liquid={false}
        speed={1.15}
        edgeFade={0.31}
        transparent
        style={{ position: 'absolute', inset: 0 }}
      />
      <div className="contact__label">
        <Shuffle
          text="CONTACT ME"
          tag="span"
          textAlign="left"
          shuffleDirection="right"
          animationMode="evenodd"
          shuffleTimes={1}
          duration={0.35}
          stagger={0.03}
          ease="power3.out"
          threshold={0.1}
          triggerOnce={true}
          triggerOnHover={false}
          loop={false}
          respectReducedMotion={true}
        />
      </div>

      <div className="contact__main">
        <h2 className="contact__headline">
          LET'S<br />
          BUILD<br />
          SOMETHING
        </h2>

        <div className="contact__availability">
          <span className="contact__dot contact__dot--open" />
          Open to any opportunities
        </div>

        <a href="mailto:gifino92@gmail.com" className="contact__email">
          gifino92@gmail.com
        </a>
      </div>

      <div className="contact__footer">
        <div className="contact__copy">
          <div>GIFINO THORIQ</div>
          <div>© {year} — ALL RIGHTS RESERVED</div>
          <div>INDONESIA → REMOTE</div>
        </div>

        <nav className="contact__links" aria-label="Social links">
          <a href="https://github.com/GifinoThoriq" target="_blank" rel="noopener noreferrer">Github</a>
          <a href="https://www.linkedin.com/in/gifino-thoriq/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="mailto:gifino92@gmail.com">Email</a>
        </nav>
      </div>
    </section>
  )
}
