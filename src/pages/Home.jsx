import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import ProductCard from '../components/ProductCard'
import './Home.css'

export default function Home() {
  const [featured, setFeatured] = useState([])

  useEffect(() => {
    api.getProducts().then(products => setFeatured(products.slice(0, 3)))
  }, [])

  return (
    <div className="home">
      <section className="home__hero">
        <img src="/hero.png" alt="COSMOS" className="home__hero-img" />
        <div className="home__hero-logo">
          <div className="home__hero-text">
            <svg className="home__hero-star" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <polygon fill="#ffe328" points="50,2 61,35 97,35 68,57 79,91 50,70 21,91 32,57 3,35 39,35" transform="rotate(-12, 50, 50)" />
            </svg>
            <span className="home__hero-cosmos">COSMOS</span>
            <span className="home__hero-sub">Clothing co.</span>
          </div>
        </div>
      </section>

      <section className="home__featured">
        <div className="home__torn-edge" />
        <div className="home__featured-inner">
          <h2 className="home__featured-title">Destacados</h2>
          <div className="home__product-grid">
            {featured.length > 0
              ? featured.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))
              : [1, 2, 3].map(i => <div key={i} className="home__card-placeholder" />)
            }
          </div>
        </div>
      </section>
    </div>
  )
}
