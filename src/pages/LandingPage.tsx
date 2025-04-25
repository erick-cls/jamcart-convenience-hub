
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/landing/HeroSection';
import CategoriesSection from '@/components/landing/CategoriesSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import CtaSection from '@/components/landing/CtaSection';

const LandingPage = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen">
        <HeroSection />
        <CategoriesSection />
        <HowItWorksSection />
        <CtaSection />
      </div>
      <Footer />
    </>
  );
};

export default LandingPage;
