/**
 * @typedef {Object} Category
 * @property {string} category_id
 * @property {string} category_name
 * @property {number} sort_order
 */

// Export empty objects for type imports (these are just for type definitions)
export const Category = {};
export const Product = {};
export const Subcategory = {};
export const Series = {};
export const Material = {};
export const Warranty = {};
export const Certification = {};
export const ProductDetail = {};
export const ProductFullView = {};

/**
 * @typedef {Object} Product
 * @property {string} product_id
 * @property {string} product_name
 * @property {string} hsn_code
 * @property {number} tax_rate
 * @property {string} category_id
 */

/**
 * @typedef {Object} Subcategory
 * @property {string} subcat_id
 * @property {string} product_id
 * @property {string} subcat_name
 */

/**
 * @typedef {Object} Series
 * @property {string} series_id
 * @property {string} product_id
 * @property {string} series_name
 */

/**
 * @typedef {Object} Material
 * @property {string} material_id
 * @property {string} material_name
 */

/**
 * @typedef {Object} Warranty
 * @property {string} warranty_id
 * @property {string} warranty_text
 */

/**
 * @typedef {Object} Certification
 * @property {string} cert_id
 * @property {string} cert_text
 */

/**
 * @typedef {Object} ProductDetail
 * @property {number} detail_id
 * @property {string} product_id
 * @property {string} series_id
 * @property {string} subcat_id
 * @property {string} material_id
 * @property {string} warranty_id
 * @property {string} certification_id
 * @property {string} net_quantity
 * @property {string} weight
 * @property {string} mrp
 * @property {string} item_dimensions
 * @property {string} package_dimensions
 * @property {string} manufacturer
 * @property {string} marketer
 * @property {string} contents
 * @property {string} customer_care
 * @property {string} description
 */

/**
 * @typedef {Object} ProductFullView
 * @property {number} detail_id
 * @property {string} product_id
 * @property {string} series_id
 * @property {string} subcat_id
 * @property {string} material_id
 * @property {string} warranty_id
 * @property {string} certification_id
 * @property {string} net_quantity
 * @property {string} weight
 * @property {string} mrp
 * @property {string} item_dimensions
 * @property {string} package_dimensions
 * @property {string} manufacturer
 * @property {string} marketer
 * @property {string} contents
 * @property {string} customer_care
 * @property {string} description
 * @property {string} product_name
 * @property {string} hsn_code
 * @property {number} tax_rate
 * @property {string} category_id
 * @property {string} master_category
 * @property {string} subcat_name
 * @property {string} series_name
 * @property {string} material_name
 * @property {string} warranty_text
 * @property {string} certification
 */
