import dynamic from 'next/dynamic'

const HeroSection = dynamic(() => import('@/components/home/HeroSection'))
const FeaturesSection = dynamic(() => import('@/components/home/FeaturesSection'))
const SupportedFormatsSection = dynamic(() => import('@/components/home/SupportedFormatsSection'))
const HowItWorksSection = dynamic(() => import('@/components/home/HowItWorksSection'))
const BenefitsSection = dynamic(() => import('@/components/home/BenefitsSection'))
const FAQSection = dynamic(() => import('@/components/home/FAQSection'))

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <SupportedFormatsSection />
      <HowItWorksSection />
      <BenefitsSection />
      <FAQSection />
    </>
  )
}
