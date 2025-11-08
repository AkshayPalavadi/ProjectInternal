import React from "react";
import "./Contact.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const Contact = () => {
  return (
    <div className="contact-page">
      {/* ==== TOP SECTION ==== */}
      <div className="contact-section">
        {/* LEFT CONTENT */}
        <div className="contact-left">
          <h2 className="contact-heading">
            You Will Grow, You Will Succeed. We Promise That
          </h2>
          <p className="contact-description">
            Pellentesque arcu facilisis nunc mi proin. Dignissim mattis in
            lectus tincidunt tincidunt ultrices. Diam convallis morbi
            pellentesque adipiscing.
          </p>

          <div className="contact-details">
            <div className="contact-item">
              <i className="fas fa-phone-alt contact-icon"></i>
              <div>
                <h4>Call for inquiry</h4>
                <p>+91 40 45374487</p>
              </div>
            </div>

            <div className="contact-item">
              <i className="fas fa-envelope contact-icon"></i>
              <div>
                <h4>Send us email</h4>
                <p>info@dhatvibs.com</p>
              </div>
            </div>

            <div className="contact-item">
              <i className="fas fa-clock contact-icon"></i>
              <div>
                <h4>Opening hours</h4>
                <p>Mon - Fri: 9:30AM - 6:30PM</p>
              </div>
            </div>

            <div className="contact-item">
              {/* <i className="fas fa-map-marker-alt contact-icon"></i> */}
              {/* <div>
                <h4>Office</h4>
                <p>
                  1st Floor, Street No.7, PB House, HUDA Techno Enclave,
                  Madhapur, Hyderabad, Telangana 500081, India
                </p>
              </div> */}
            </div>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="contact-form-box">
          <h3>Contact Info</h3>
          <p className="form-subtitle">
            {/* Nibh dis faucibus proin lacus tristique */}
          </p>
          <form className="contact-form">
            <div className="form-row">
              <input type="text" placeholder="First Name" required />
              <input type="text" placeholder="Last Name" required />
            </div>
            <input type="email" placeholder="Email Address" required />
            <textarea placeholder="Message" rows="4" required></textarea>
            <button type="submit">Send Message</button>
          </form>
        </div>
      </div>

      {/* ==== MAP SECTION ==== */}
      <div className="contact-map">
         <div className="office">
                <h4>Office Address</h4>
                <p>
                  1st Floor, Street No.7, PB House, HUDA Techno Enclave,
                  Madhapur, Hyderabad, Telangana 500081, India
                </p>
         </div>
        <div className="map">

        <iframe
          title="office-location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.2936443524504!2d78.3773654742109!3d17.445654001125916!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb93003b4e8b3b%3A0x29a6b4660a56ed47!2sDhaTvi%20Business%20Solutions%20Pvt%20Ltd!5e0!3m2!1sen!2sus!4v1761369928968!5m2!1sen!2sus"
          width="100%"
          height="450"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
        </div>
      </div>

      {/* ==== FOOTER SECTION ==== */}
      <footer className="footer">
        <div className="footer-container">
          {/* COMPANY INFO */}
          <div className="footer-column-c">
            <h3>DhaTvi Business Solutions</h3>
            <p>
              We empower businesses through technology — offering modern
              solutions for digital growth, innovation, and transformation.
            </p>
          </div>

          {/* SERVICES & LINKS */}
          <div className="footer-column-c">
            <h4>Company</h4>
            <ul>
              <li><a href="#">Services</a></li>
              <li><a href="#">About</a></li>
              <li><a href="#">Careers</a></li>
            </ul>
          </div>

          <div className="footer-column-c">
            <h4>Legal</h4>
            <ul>
              <li><a href="#">Terms & Conditions</a></li>
              <li><a href="#">Privacy Policy</a></li>
            </ul>
          </div>

          {/* CONTACT INFO */}
          <div className="footer-column-c">
            <h4>Contact</h4>
            <p>Email: info@dhatvibs.com</p>
            <p>Tel: +91 40 45374487</p>
            <p>
              1st Floor, Street No.7, PB House, HUDA Techno Enclave,
              Madhapur, Hyderabad, Telangana 500081
            </p>

            <div className="footer-social">
              <a href="https://www.linkedin.com/feed/update/urn:li:activity:7387755680721444864" target="_blank" rel="noreferrer">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="https://www.youtube.com/@dhatvi" target="_blank" rel="noreferrer">
                <i color="red" className="fab fa-youtube"></i>
              </a>
              <a href="https://www.instagram.com/dhatviofficial?utm_source=qr&igsh=YndrNWU4MnZwZmY5" target="_blank" rel="noreferrer">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} DhaTvi Business Solutions Pvt. Ltd. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Contact;