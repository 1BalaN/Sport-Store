import React from 'react';
import './ContactUs.css'

const ContactUs = () => {
  return (
    <div className="contact-us">
      <h1>Контакты нашего магазина</h1>
      
      <div className="contact-info">
        <p>
          <strong>Адрес:</strong> проспект Независимости 179 , Минск, Беларусь
        </p>
        <p>
          <strong>Телефон:</strong> +375 (29) 888-77-13
        </p>
        <p>
          <strong>Email:</strong> sportcity@gmail.com
        </p>
      </div>

      <div className="social-media">
        <h2>Мы в социальных сетях:</h2>
        <ul>
          <li>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              Facebook
            </a>
          </li>
          <li>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
          </li>
          <li>
            <a href="https://t.me/your_telegram_username" target="_blank" rel="noopener noreferrer">
              Telegram
            </a>
          </li>
        </ul>
      </div>

      <div className="google-map">
        <h2>Наш магазин на карте</h2>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11170.316678624076!2d27.6905147642911!3d53.9447152440977!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46dbc935631b3dc3%3A0xc1df388732a0336f!2z0KHQv9C10LrRgtGA!5e0!3m2!1sru!2snl!4v1732915975188!5m2!1sru!2snl"
          width="750"
          height="450"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
};

export default ContactUs;
