import { CTASection } from '@/components/landing/CTASection'
import { FeaturesSection } from '@/components/landing/FeaturesSection'
import { HeroSection } from '@/components/landing/HeroSection'
import { HowToSection } from '@/components/landing/HowToSection'
import { MainCopySection } from '@/components/landing/MainCopySection'
import { SiteFooter } from '@/components/landing/SiteFooter'

export function LandingPage() {
  return (
    <div className="min-h-dvh bg-white">
      <HeroSection />
      <FeaturesSection />
      <MainCopySection />
      <HowToSection />
      <CTASection />
      <SiteFooter />
    </div>
  )
}
