import React from 'react'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__content">
        <div className="footer__social">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <circle cx="12" cy="12" r="4"/>
              <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" strokeWidth="0"/>
            </svg>
          </a>
        </div>
        <span className="footer__divider">|</span>
        <div className="footer__contact">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
          <span>cosmos@gmail.com</span>
        </div>
      </div>
      <p className="footer__copy">© All rights reserved. 2026 COSMOS</p>
    </footer>
  )
}
