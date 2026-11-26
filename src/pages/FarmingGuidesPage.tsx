import React from 'react';
import { PageRoute, Product } from '../data/kaffiikaData';
import { PageHeaderBanner } from '../components/PageHeaderBanner';
import { SpeciesPrograms } from '../components/SpeciesPrograms';

interface FarmingGuidesPageProps {
  products: Product[];
  onNavigate: (page: PageRoute) => void;
  onSelectProduct: (product: Product) => void;
}

export const FarmingGuidesPage: React.FC<FarmingGuidesPageProps> = ({
  products,
  onNavigate,
  onSelectProduct,
}) => {
  return (
    <div className="min-h-screen bg-[#F4F7FB]">
      <PageHeaderBanner
        title="Livestock & Aquaculture Farming Guides"
        subtitle="Phase-specific nutritional protocols for Poultry (Chicks, Broilers, Layers), Piggery (Piglets, Sows, Fattening), Ruminants (Calves, Dairy, Beef), and Aqua (Tilapia & Catfish)."
        currentPage="/farming-guides"
        badgeText="POULTRY • PIGGERY • RUMINANTS • AQUA"
        onNavigate={onNavigate}
      />

      <SpeciesPrograms products={products} onSelectProduct={onSelectProduct} />
    </div>
  );
};
