import React from 'react'
import Hero from './components/Hero.jsx'
import AICoachHighlight from './components/AICoachHighlight.jsx'
import Membership from './components/Membership.jsx'
import HowItWorks from './components/HowItWorks.jsx'
import Testimonials from './components/Testimonials.jsx'
import FAQ from './components/FAQ.jsx'
import FinalCTA from './components/FinalCTA.jsx'

// Home page content only — Header/Footer/Chat live in the layout so they
// persist across future routes. AI Coach is pulled up right after the Hero
// to keep the AI chat experience front and center.
export default function HomePage() {
  return (
    <>
      <Hero />
      <AICoachHighlight />
      <Membership />
      <HowItWorks />
      <Testimonials />
      <FAQ />
      <FinalCTA />
    </>
  )
}
