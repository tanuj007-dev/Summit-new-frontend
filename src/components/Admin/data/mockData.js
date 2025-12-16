
export const categories = [
  { category_id: 'PC', category_name: 'Pressure Cooker', sort_order: 10 },
  { category_id: 'MG', category_name: 'Mixer Grinder', sort_order: 20 },
  { category_id: 'GS', category_name: 'Gas Stove', sort_order: 30 },
  { category_id: 'GT', category_name: 'Gas Tandoor', sort_order: 40 },
  { category_id: 'CK', category_name: 'Cookware', sort_order: 50 },
  { category_id: 'IDLI', category_name: 'Idli / Multi Kadai', sort_order: 60 },
  { category_id: 'FN', category_name: 'Ceiling Fan', sort_order: 70 },
  { category_id: 'IR', category_name: 'Iron', sort_order: 80 },
  { category_id: 'RC', category_name: 'Rice Cooker', sort_order: 90 },
  { category_id: 'COMBO', category_name: 'Combo Packs', sort_order: 100 },
];

export const materials = [
  { material_id: 'M1', material_name: 'Aluminium' },
  { material_id: 'M2', material_name: 'Triply Stainless Steel' },
  { material_id: 'M3', material_name: 'Glass' },
  { material_id: 'M4', material_name: 'Copper' },
];

export const warranties = [
  { warranty_id: 'W1', warranty_text: '5 YEARS' },
  { warranty_id: 'W2', warranty_text: 'N/A' },
  { warranty_id: 'W3', warranty_text: '1 YEAR' },
  { warranty_id: 'W4', warranty_text: '2 YEARS' },
];

export const certifications = [
  { cert_id: 'C1', cert_text: 'ISI CERTIFIED' },
  { cert_id: 'C2', cert_text: 'N/A' },
];

export const products = [
  { product_id: 'SI1F', product_name: 'SUMMIT INNERLID 1L PLAIN FINE', hsn_code: '761510', tax_rate: 0.05, category_id: 'PC' },
  { product_id: 'SI1IF', product_name: 'SUMMIT INNERLID 1L PLAIN IND FINE', hsn_code: '761510', tax_rate: 0.05, category_id: 'PC' },
  { product_id: 'SO1.5P', product_name: 'SUMMIT OUTERLID 1.5L PRIME', hsn_code: '761510', tax_rate: 0.05, category_id: 'PC' },
  { product_id: 'SO1.5IP', product_name: 'SUMMIT OUTERLID 1.5L IND PRIME', hsn_code: '761510', tax_rate: 0.05, category_id: 'PC' },
  { product_id: 'SO5TIE', product_name: 'SUMMIT OUTERLID 5L TRIPLY IND ELITE', hsn_code: '761510', tax_rate: 0.05, category_id: 'PC' },
  { product_id: 'SIC4P', product_name: 'SUMMIT IDLI COOKER 4 PLATES PRIME', hsn_code: '761510', tax_rate: 0.05, category_id: 'IDLI' },
  { product_id: 'SIC5P', product_name: 'SUMMIT IDLI COOKER 5 PLATES PRIME', hsn_code: '761510', tax_rate: 0.05, category_id: 'IDLI' },
  { product_id: 'SIC6S', product_name: 'SUMMIT IDLI COOKER 6 PLATES SUPREME', hsn_code: '761510', tax_rate: 0.05, category_id: 'IDLI' },
  { product_id: 'SMK4S', product_name: 'SUMMIT MULTI KADAI 4 PLATES SUPREME', hsn_code: '761510', tax_rate: 0.05, category_id: 'IDLI' },
  { product_id: 'SGTPR', product_name: 'Summit Gas Tandoor Prime', hsn_code: '761510', tax_rate: 0.05, category_id: 'GT' },
];

export const subcategories = [
  { subcat_id: 'SI1F-SUB', product_id: 'SI1F', subcat_name: 'Innerlid Pressure Cooker' },
  { subcat_id: 'SI1IF-SUB', product_id: 'SI1IF', subcat_name: 'Innerlid Pressure Cooker' },
  { subcat_id: 'SO1.5P-SUB', product_id: 'SO1.5P', subcat_name: 'Outerlid Pressure Cooker' },
  { subcat_id: 'SO1.5IP-SUB', product_id: 'SO1.5IP', subcat_name: 'Outerlid Pressure Cooker' },
  { subcat_id: 'SO5TIE-SUB', product_id: 'SO5TIE', subcat_name: 'Outerlid Pressure Cooker' },
  { subcat_id: 'SIC4P-SUB', product_id: 'SIC4P', subcat_name: 'Idli Cooker' },
  { subcat_id: 'SIC5P-SUB', product_id: 'SIC5P', subcat_name: 'Idli Cooker' },
  { subcat_id: 'SIC6S-SUB', product_id: 'SIC6S', subcat_name: 'Idli Cooker' },
  { subcat_id: 'SMK4S-SUB', product_id: 'SMK4S', subcat_name: 'Multi Kadai' },
  { subcat_id: 'SGTPR-SUB', product_id: 'SGTPR', subcat_name: 'Galvanized Iron' },
];

export const series = [
  { series_id: 'SI1F-SER', product_id: 'SI1F', series_name: 'Fine' },
  { series_id: 'SI1IF-SER', product_id: 'SI1IF', series_name: 'Fine' },
  { series_id: 'SO1.5P-SER', product_id: 'SO1.5P', series_name: 'Prime' },
  { series_id: 'SO1.5IP-SER', product_id: 'SO1.5IP', series_name: 'Prime' },
  { series_id: 'SO5TIE-SER', product_id: 'SO5TIE', series_name: 'Elite' },
  { series_id: 'SIC4P-SER', product_id: 'SIC4P', series_name: 'Prime' },
  { series_id: 'SIC5P-SER', product_id: 'SIC5P', series_name: 'Prime' },
  { series_id: 'SIC6S-SER', product_id: 'SIC6S', series_name: 'Supreme' },
  { series_id: 'SMK4S-SER', product_id: 'SMK4S', series_name: 'Supreme' },
  { series_id: 'SGTPR-SER', product_id: 'SGTPR', series_name: 'Prime' },
];

export const productDetails = [
  {
    detail_id: 1,
    product_id: 'SI1F',
    series_id: 'SI1F-SER',
    subcat_id: 'SI1F-SUB',
    material_id: 'M1',
    warranty_id: 'W1',
    certification_id: 'C1',
    net_quantity: '1 UNIT',
    weight: '0.75',
    mrp: '990',
    item_dimensions: '28 x 14 x 15',
    package_dimensions: '282 x 145 x 140',
    manufacturer: 'VARDHMAN INDUSTRIES B-36, KRISHNA VIHAR, LONI, GHAZIABAD-201102 UP(INDIA)',
    marketer: 'VARDHMAN INDUSTRIES B-36, KRISHNA VIHAR, LONI, GHAZIABAD-201102 UP(INDIA)',
    contents: '1 PRESSURE COOKER WITH LID, 1 RUBBER GASKET, 1 WEIGHT (WHISTLE), 1 INSTRUCTION MANUAL',
    customer_care: 'TOLL FREE NO : 1800 419 6048, WHATSAPP NO : 9990555161',
    description: 'Summit Innerlid Pressure Cooker – 1L (Fine Series). Compact, durable, and efficient kitchen essential.',
  },
  {
    detail_id: 2,
    product_id: 'SO5TIE',
    series_id: 'SO5TIE-SER',
    subcat_id: 'SO5TIE-SUB',
    material_id: 'M2',
    warranty_id: 'W1',
    certification_id: 'C1',
    net_quantity: '1 UNIT',
    weight: '2.35',
    mrp: '3140',
    item_dimensions: '37 x 19 x 20',
    package_dimensions: '375 x 248 x 181',
    manufacturer: 'VARDHMAN INDUSTRIES B-36, KRISHNA VIHAR, LONI, GHAZIABAD-201102 UP(INDIA)',
    marketer: 'VARDHMAN INDUSTRIES B-36, KRISHNA VIHAR, LONI, GHAZIABAD-201102 UP(INDIA)',
    contents: '1 PRESSURE COOKER WITH LID, 1 RUBBER GASKET, 1 WEIGHT (WHISTLE), 1 INSTRUCTION MANUAL',
    customer_care: 'TOLL FREE NO : 1800 419 6048, WHATSAPP NO : 9990555161',
    description: 'Summit Outerlid 5L Triply Induction Elite Pressure Cooker. Premium triply stainless steel construction.',
  },
  {
    detail_id: 3,
    product_id: 'SIC4P',
    series_id: 'SIC4P-SER',
    subcat_id: 'SIC4P-SUB',
    material_id: 'M1',
    warranty_id: 'W2',
    certification_id: 'C2',
    net_quantity: '1 UNIT',
    weight: '1.4',
    mrp: '1400',
    item_dimensions: '33 x 21 x 23',
    package_dimensions: '',
    manufacturer: 'VARDHMAN INDUSTRIES B-36, KRISHNA VIHAR, LONI, GHAZIABAD-201102 UP(INDIA)',
    marketer: 'VARDHMAN INDUSTRIES B-36, KRISHNA VIHAR, LONI, GHAZIABAD-201102 UP(INDIA)',
    contents: '1 IDLI COOKER WITH LID, 1 HANDLE SET, 4 IDLI PLATES',
    customer_care: 'TOLL FREE NO : 1800 419 6048, WHATSAPP NO : 9990555161',
    description: 'Summit Idli Cooker – 4 Plates (Prime Series). High-quality aluminium steam cookware.',
  },
];
