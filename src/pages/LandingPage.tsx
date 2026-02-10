import { Navbar } from '@/components/landing/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { SocialProof } from '@/components/landing/SocialProof';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { PricingSection } from '@/components/landing/PricingSection';
import { Footer } from '@/components/landing/Footer';

// Nota: Los siguientes componentes se importarán a medida que se creen.
// Por ahora, usaremos placeholders o simplemente no los renderizaremos para evitar errores.

export const LandingPage = () => {
    return (
        <div className="min-h-screen">
            <Navbar />
            <HeroSection />
            <SocialProof />
            <FeaturesSection />
            <HowItWorks />
            <PricingSection />
            <Footer />
        </div>
    );
};
