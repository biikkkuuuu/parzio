import React from 'react';
import { SearchView } from './SearchView';
import { Product } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
  onAddToCart
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-[#faf8f5] overflow-y-auto animate-fadeIn">
      <SearchView
        products={products}
        onBack={onClose}
        onSelectProduct={(p) => {
          onSelectProduct(p);
          onClose();
        }}
        onAddToCart={onAddToCart}
      />
    </div>
  );
};
