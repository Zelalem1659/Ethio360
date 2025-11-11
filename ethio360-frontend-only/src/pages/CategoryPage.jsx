import React from 'react';
import { useParams } from 'react-router-dom';

const CategoryPage = () => {
  const { category } = useParams();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 capitalize">
          {category} News
        </h1>
        <p className="text-gray-600">
          This page will display articles from the {category} category. Implementation coming soon.
        </p>
      </div>
    </div>
  );
};

export default CategoryPage;