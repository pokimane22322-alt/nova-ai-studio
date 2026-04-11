import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import AdvantagesSection from '@/components/AdvantagesSection';
import IndustriesSection from '@/components/IndustriesSection';
import CTASection from '@/components/CTASection';

const Index = () => {
  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <HowItWorksSection />
      <AdvantagesSection />
      <IndustriesSection />
      <CTASection />
    </div>
  );
};

export default Index;
