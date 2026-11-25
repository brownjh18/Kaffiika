import React from 'react';
import { Branch, COMPANY_INFO, PageRoute } from '../data/kaffiikaData';
import { PageHeaderBanner } from '../components/PageHeaderBanner';
import { BranchLocator } from '../components/BranchLocator';

interface BranchesPageProps {
  branches: Branch[];
  selectedBranchId: string;
  onSelectBranch: (branchId: string) => void;
  onNavigate: (page: PageRoute) => void;
}

export const BranchesPage: React.FC<BranchesPageProps> = ({
  branches,
  selectedBranchId,
  onSelectBranch,
  onNavigate,
}) => {
  return (
    <div className="min-h-screen bg-[#F4F7FB]">
      <PageHeaderBanner
        title="Our Branches — Find a Shop or Agent Near You"
        subtitle={`Visit our Headoffice at ${COMPANY_INFO.headquarters} for product inquiries, orders, and technical support.`}
        currentPage="branches.html"
        badgeText="HEAD OFFICE LOCATION"
        onNavigate={onNavigate}
      />

      <BranchLocator
        branches={branches}
        selectedBranchId={selectedBranchId}
        onSelectBranch={onSelectBranch}
      />
    </div>
  );
};
