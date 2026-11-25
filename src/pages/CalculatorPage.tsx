import React from 'react';
import { PageRoute, Product } from '../data/kaffiikaData';
import { PageHeaderBanner } from '../components/PageHeaderBanner';
import { RationCalculator } from '../components/RationCalculator';

interface CalculatorPageProps {
  products: Product[];
  onNavigate: (page: PageRoute) => void;
  onAddMultipleToQuote: (items: { product: Product; quantity: number }[]) => void;
}

export const CalculatorPage: React.FC<CalculatorPageProps> = ({
  products,
  onNavigate,
  onAddMultipleToQuote,
}) => {
  return (
    <div className="min-h-screen bg-[#F4F7FB]">
      <PageHeaderBanner
        title="On-Farm Ration & Concentrate Mixing Calculator"
        subtitle="Calculate exact Koudijs concentrate, broken maize, maize bran, soya, and limestone ratios for any batch size from 100 kg to 5 Tons."
        currentPage="calculator.html"
        badgeText="INTERACTIVE FEED FORMULATION TOOL"
        onNavigate={onNavigate}
      />

      <RationCalculator
        products={products}
        onAddMultipleToQuote={onAddMultipleToQuote}
      />
    </div>
  );
};
