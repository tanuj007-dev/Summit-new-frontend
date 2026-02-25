import React, { useState } from 'react';
import axios from '../axiosConfig';

/**
 * ProductIdFinder - Helper component to find product IDs
 * This is a temporary tool to help you find product IDs for your reels
 * 
 * Usage:
 * 1. Add this component to your app temporarily
 * 2. Search for products by name or SKU
 * 3. Copy the product_id values
 * 4. Update the ReelsSection.jsx products array with the correct IDs
 * 5. Remove this component when done
 */
const ProductIdFinder = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    const searchProducts = async () => {
        if (!searchTerm.trim()) {
            alert('Please enter a search term');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.get(`/api/products/view?search=${searchTerm}`, {
                withCredentials: true,
            });

            console.log('Search results:', response.data);

            if (response.data && response.data.data) {
                setProducts(response.data.data);
            } else {
                setProducts([]);
                alert('No products found');
            }
        } catch (error) {
            console.error('Error searching products:', error);
            alert('Error searching products');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert(`Copied: ${text}`);
    };

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-4">Product ID Finder</h1>
                <p className="text-gray-600 mb-6">
                    Search for products to find their IDs. Use these IDs in your ReelsSection component.
                </p>

                {/* Search Box */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                    <div className="flex gap-4">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && searchProducts()}
                            placeholder="Search by product name, SKU, or keyword..."
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={searchProducts}
                            disabled={loading}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                        >
                            {loading ? 'Searching...' : 'Search'}
                        </button>
                    </div>
                </div>

                {/* Results */}
                {products.length > 0 && (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">
                            Found {products.length} product(s)
                        </h2>
                        <div className="space-y-4">
                            {products.map((product, index) => (
                                <div
                                    key={index}
                                    className="border border-gray-200 p-4 rounded-lg hover:bg-gray-50"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Product Info */}
                                        <div>
                                            <h3 className="font-semibold text-lg mb-2">
                                                {product.product_name || product.name || 'Unnamed Product'}
                                            </h3>
                                            <div className="space-y-1 text-sm">
                                                <p>
                                                    <span className="font-medium">Product ID:</span>{' '}
                                                    <code className="bg-gray-100 px-2 py-1 rounded">
                                                        {product.product_id || product.id || 'N/A'}
                                                    </code>
                                                    <button
                                                        onClick={() => copyToClipboard(product.product_id || product.id)}
                                                        className="ml-2 text-blue-600 hover:underline"
                                                    >
                                                        Copy
                                                    </button>
                                                </p>
                                                {product.sku && (
                                                    <p>
                                                        <span className="font-medium">SKU:</span> {product.sku}
                                                    </p>
                                                )}
                                                {product.mrp && (
                                                    <p>
                                                        <span className="font-medium">Price:</span> ₹{product.mrp}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Product Image */}
                                        {product.image && (
                                            <div className="flex justify-end">
                                                <img
                                                    src={product.image}
                                                    alt={product.product_name}
                                                    className="w-32 h-32 object-contain rounded"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Full Product Data (for debugging) */}
                                    <details className="mt-3">
                                        <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
                                            View full product data
                                        </summary>
                                        <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto max-h-64">
                                            {JSON.stringify(product, null, 2)}
                                        </pre>
                                    </details>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Instructions */}
                <div className="mt-8 bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
                    <h3 className="font-semibold text-lg mb-2">📝 Instructions:</h3>
                    <ol className="list-decimal list-inside space-y-2 text-sm">
                        <li>Search for each product you want to feature in your reels</li>
                        <li>Copy the <strong>Product ID</strong> for each product</li>
                        <li>
                            Open <code className="bg-gray-200 px-2 py-1 rounded">src/components/ReelsSection.jsx</code>
                        </li>
                        <li>
                            Replace the <code className="bg-gray-200 px-2 py-1 rounded">productId: null</code> values with the actual IDs
                        </li>
                        <li>Example: <code className="bg-gray-200 px-2 py-1 rounded">productId: 123</code></li>
                        <li>Save the file and test the "Add to Cart" functionality</li>
                    </ol>
                </div>
            </div>
        </div>
    );
};

export default ProductIdFinder;
