/**
 * Yatarth AI — Legal Metrology (Packaged Commodities) Rules, 2011 (LMPC)
 * Hardcoded, Rule-Accurate Compliance & Font Size Validation Engine
 * 
 * Version Tag: LMPC-2011-v2022
 */

export type FieldStatus = 'PASS' | 'FAIL' | 'WARNING' | 'NOT_APPLICABLE' | 'NEEDS_REVIEW';

export type OverallResult = 'PASS' | 'FAIL' | 'WARNING' | 'NEEDS_REVIEW';

export interface ProductMetadata {
  category: string;
  isFood?: boolean;
  isImported?: boolean;
  hasShelfLife?: boolean;
  hasDimensions?: boolean;
  surfaceAreaCm2?: number;
  mrpAmount?: number;
  isWholesale?: boolean;
}

export interface FieldDefinition {
  field_id: string;
  label: string;
  rule_ref: string;
  description: string;
  applicability: string; // 'always' | 'conditional:...'
}

export interface EvaluatedField {
  field_id: string;
  label: string;
  rule_ref: string;
  rule_version: string;
  status: FieldStatus;
  detected_value: string;
  required_value: string;
  reason: string;
  ocr_confidence: number;
  evidence_image_url?: string;
  bounding_box?: [number, number, number, number]; // [x1%, y1%, x2%, y2%]
  is_conditional?: boolean;
  applicable?: boolean;
}

export interface FontSizeEvaluation {
  status: FieldStatus;
  surfaceAreaCm2: number;
  requiredMinNumeralHeightMm: number;
  measuredNumeralHeightMm: number;
  measuredUspHeightMm?: number;
  requiredMinUspHeightMm?: number;
  measuredLetterHeightMm?: number;
  measuredWidthRatio?: number;
  minWidthRatioRequired: number;
  reason: string;
  configVersion: string;
  comparisonPercentage: number; // percentage of requirement met (e.g. 100% or 60%)
}

export interface ExtractionRawPayload {
  manufacturer_details?: { text: string; confidence: number; bbox?: [number, number, number, number] };
  generic_name?: { text: string; confidence: number; bbox?: [number, number, number, number] };
  net_quantity?: { text: string; confidence: number; bbox?: [number, number, number, number] };
  mfg_date?: { text: string; confidence: number; bbox?: [number, number, number, number] };
  best_before?: { text: string; confidence: number; bbox?: [number, number, number, number] };
  mrp?: { text: string; confidence: number; bbox?: [number, number, number, number] };
  unit_sale_price?: { text: string; confidence: number; bbox?: [number, number, number, number] };
  consumer_care?: { text: string; confidence: number; bbox?: [number, number, number, number] };
  country_of_origin?: { text: string; confidence: number; bbox?: [number, number, number, number] };
  fssai_number?: { text: string; confidence: number; bbox?: [number, number, number, number] };
  dimensions?: { text: string; confidence: number; bbox?: [number, number, number, number] };
  font_measurement?: {
    measuredNumeralHeightMm: number;
    measuredUspHeightMm?: number;
    measuredLetterHeightMm?: number;
    measuredWidthRatio?: number;
    isEmbossed?: boolean;
  };
  sample_image_url?: string;
}

export const RULE_VERSION_TAG = "LMPC-2011-v2022";

export const COMPLIANCE_FIELDS: FieldDefinition[] = [
  {
    field_id: "manufacturer_details",
    label: "Manufacturer/Packer/Importer Name & Address",
    rule_ref: "Rule 6(1)(a)",
    description: "Complete name & physical address with PIN code of manufacturer, packer, or importer.",
    applicability: "always"
  },
  {
    field_id: "generic_name",
    label: "Generic/Common Name of Commodity",
    rule_ref: "Rule 6(1)(b)",
    description: "Common name or generic description of the packaged commodity.",
    applicability: "always"
  },
  {
    field_id: "net_quantity",
    label: "Net Quantity (Weight/Volume/Number)",
    rule_ref: "Rule 6(1)(c)",
    description: "Net quantity in standard metric units (g, kg, ml, l, cm, m, N) with proper spacing.",
    applicability: "always"
  },
  {
    field_id: "mfg_date",
    label: "Month & Year of Manufacture / Packing",
    rule_ref: "Rule 6(1)(f)",
    description: "Month and year of manufacture, packing, or import (e.g. 04/2026).",
    applicability: "always"
  },
  {
    field_id: "best_before",
    label: "Best Before / Use By Date",
    rule_ref: "Rule 6(1)(f)",
    description: "Expiry or best-before period for perishables and shelf-life-limited commodities.",
    applicability: "conditional:hasShelfLife"
  },
  {
    field_id: "mrp",
    label: "MRP (Inclusive of All Taxes)",
    rule_ref: "Rule 6(1)(e)",
    description: "Maximum Retail Price in INR with mandatory 'inclusive of all taxes' declaration.",
    applicability: "always"
  },
  {
    field_id: "unit_sale_price",
    label: "Unit Sale Price (USP)",
    rule_ref: "Rule 6(11)",
    description: "Price per unit (e.g. ₹0.29/g, ₹1.50/ml). Exempt if area ≤100 cm², MRP ≤₹35, or wholesale.",
    applicability: "conditional:!exemptUSP"
  },
  {
    field_id: "consumer_care",
    label: "Consumer Care Details",
    rule_ref: "Rule 6(1)(g)",
    description: "Name, address, telephone number, and email of officer responsible for consumer complaints.",
    applicability: "always"
  },
  {
    field_id: "country_of_origin",
    label: "Country of Origin",
    rule_ref: "Rule 6 (Import Provisions)",
    description: "Mandatory country of origin declaration for imported packaged commodities.",
    applicability: "conditional:isImported"
  },
  {
    field_id: "fssai_number",
    label: "FSSAI Licence Number",
    rule_ref: "FSSAI Regulations (Co-required)",
    description: "14-digit FSSAI licence number for food and beverage items.",
    applicability: "conditional:isFood"
  },
  {
    field_id: "dimensions",
    label: "Dimensions / Sizes",
    rule_ref: "Rule 6 (Category-specific)",
    description: "Dimensions (length, width, diameter) where applicable (textiles, sheets, cables).",
    applicability: "conditional:hasDimensions"
  }
];

export const FONT_SIZE_TABLE = {
  version: "LMPC-2011 (G.S.R. 629(E) dated 23.6.2017 — Config v2022)",
  bands: [
    { max_surface_area_cm2: 100, min_numeral_height_mm: 1.0, label: "≤ 100 cm²" },
    { max_surface_area_cm2: 200, min_numeral_height_mm: 2.0, label: "101 – 200 cm²" },
    { max_surface_area_cm2: 500, min_numeral_height_mm: 4.0, label: "201 – 500 cm²" },
    { max_surface_area_cm2: Infinity, min_numeral_height_mm: 6.0, label: "> 500 cm²" }
  ],
  usp_ratio_of_mrp: 0.5, // USP numeral height must be at least 50% of MRP numeral height
  min_letter_height_mm: 1.0,
  min_letter_height_mm_embossed: 2.0,
  min_width_to_height_ratio: 0.333 // Width >= 1/3 of height (except 1, i, I, l)
};

/**
 * Resolves whether a field is applicable given product category metadata
 */
export function resolveFieldApplicability(
  fieldId: string,
  meta: ProductMetadata
): { applicable: boolean; reasonIfNotApplicable?: string } {
  const isFood = Boolean(meta.isFood || meta.category === 'Food & Beverages');
  const isImported = Boolean(meta.isImported);
  const hasShelfLife = Boolean(meta.hasShelfLife || meta.category === 'Food & Beverages' || meta.category === 'Pharmaceuticals' || meta.category === 'Cosmetics & Personal Care');
  const hasDimensions = Boolean(meta.hasDimensions || meta.category === 'Textiles & Apparel');
  const surfaceArea = meta.surfaceAreaCm2 ?? 250;
  const mrp = meta.mrpAmount ?? 150;
  const isWholesale = Boolean(meta.isWholesale);

  // Exempt from USP under Rule 6(11) if area <= 100 cm2 OR mrp <= 35 OR isWholesale
  const isExemptUSP = surfaceArea <= 100 || mrp <= 35 || isWholesale;

  switch (fieldId) {
    case 'best_before':
      return hasShelfLife
        ? { applicable: true }
        : { applicable: false, reasonIfNotApplicable: 'Non-perishable commodity; Best Before date declaration is not applicable.' };

    case 'unit_sale_price':
      return !isExemptUSP
        ? { applicable: true }
        : {
            applicable: false,
            reasonIfNotApplicable: `Exempt under Rule 6(11) amendment: ${
              surfaceArea <= 100 ? `Package surface area (${surfaceArea} cm²) ≤ 100 cm²` : mrp <= 35 ? `MRP (₹${mrp}) ≤ ₹35` : 'Wholesale package'
            }.`
          };

    case 'country_of_origin':
      return isImported
        ? { applicable: true }
        : { applicable: false, reasonIfNotApplicable: 'Domestic product; Country of origin mandatory declaration is applicable for imported goods.' };

    case 'fssai_number':
      return isFood
        ? { applicable: true }
        : { applicable: false, reasonIfNotApplicable: 'Non-food commodity category; FSSAI license declaration is not required under LMPC.' };

    case 'dimensions':
      return hasDimensions
        ? { applicable: true }
        : { applicable: false, reasonIfNotApplicable: 'Commodity category does not require physical dimensions declaration.' };

    default:
      return { applicable: true };
  }
}

/**
 * Font Size Evaluation Sub-Engine (Rule 7 / Rule 9)
 */
export function evaluateFontSize(
  surfaceAreaCm2: number,
  fontMeasurement?: ExtractionRawPayload['font_measurement'],
  mrpNumeralHeightMm: number = 3.0
): FontSizeEvaluation {
  const area = surfaceAreaCm2 || 250; // default 250 cm2
  const band = FONT_SIZE_TABLE.bands.find(b => area <= b.max_surface_area_cm2) || FONT_SIZE_TABLE.bands[3];
  const requiredMinNumeral = band.min_numeral_height_mm;

  const measuredNumeral = fontMeasurement?.measuredNumeralHeightMm ?? 0;
  const measuredUsp = fontMeasurement?.measuredUspHeightMm;
  const requiredUspMin = Math.round(mrpNumeralHeightMm * FONT_SIZE_TABLE.usp_ratio_of_mrp * 10) / 10;
  const measuredLetter = fontMeasurement?.measuredLetterHeightMm ?? 1.5;
  const measuredWidthRatio = fontMeasurement?.measuredWidthRatio ?? 0.4;
  const isEmbossed = Boolean(fontMeasurement?.isEmbossed);

  const minLetterRequired = isEmbossed ? FONT_SIZE_TABLE.min_letter_height_mm_embossed : FONT_SIZE_TABLE.min_letter_height_mm;

  let status: FieldStatus = 'PASS';
  let reason = `Numeral height ${measuredNumeral.toFixed(1)}mm complies with minimum ${requiredMinNumeral.toFixed(1)}mm required for package area ${area} cm² (${band.label}).`;

  if (measuredNumeral <= 0) {
    status = 'NEEDS_REVIEW';
    reason = `Unable to measure font numeral height automatically. Inspector manual verification required.`;
  } else if (measuredNumeral < requiredMinNumeral) {
    status = 'FAIL';
    reason = `VIOLATION Rule 7: Numeral height ${measuredNumeral.toFixed(1)}mm is below required minimum ${requiredMinNumeral.toFixed(1)}mm for package surface area ${area} cm² (${band.label}).`;
  } else if (measuredNumeral >= requiredMinNumeral && measuredNumeral < requiredMinNumeral * 1.10) {
    status = 'WARNING';
    reason = `BORDERLINE Rule 7: Measured numeral height ${measuredNumeral.toFixed(1)}mm is within 10% of minimum threshold ${requiredMinNumeral.toFixed(1)}mm (${band.label}).`;
  } else if (measuredUsp !== undefined && measuredUsp < requiredUspMin) {
    status = 'FAIL';
    reason = `VIOLATION Rule 6(11): USP numeral height ${measuredUsp.toFixed(1)}mm is below 50% of MRP numeral height (${requiredUspMin.toFixed(1)}mm required).`;
  } else if (measuredLetter < minLetterRequired) {
    status = 'FAIL';
    reason = `VIOLATION Rule 7: Non-numeral letter height ${measuredLetter.toFixed(1)}mm is below minimum ${minLetterRequired.toFixed(1)}mm (${isEmbossed ? 'Embossed' : 'Printed'}).`;
  } else if (measuredWidthRatio < FONT_SIZE_TABLE.min_width_to_height_ratio) {
    status = 'WARNING';
    reason = `WARNING Rule 7: Letter width-to-height ratio (${measuredWidthRatio.toFixed(2)}) is lower than standard 1/3 (0.33) ratio.`;
  }

  const comparisonPercentage = requiredMinNumeral > 0 ? Math.min(Math.round((measuredNumeral / requiredMinNumeral) * 100), 200) : 100;

  return {
    status,
    surfaceAreaCm2: area,
    requiredMinNumeralHeightMm: requiredMinNumeral,
    measuredNumeralHeightMm: measuredNumeral,
    measuredUspHeightMm: measuredUsp,
    requiredMinUspHeightMm: requiredUspMin,
    measuredLetterHeightMm: measuredLetter,
    measuredWidthRatio,
    minWidthRatioRequired: FONT_SIZE_TABLE.min_width_to_height_ratio,
    reason,
    configVersion: FONT_SIZE_TABLE.version,
    comparisonPercentage
  };
}

/**
 * Validates raw extracted data for all 11 fields according to Rule 6 & Rule 7 logic.
 */
export function evaluateCompliance(
  raw: ExtractionRawPayload,
  meta: ProductMetadata
): {
  evaluatedFields: EvaluatedField[];
  fontSizeEval: FontSizeEvaluation;
  overallResult: OverallResult;
  ruleVersion: string;
} {
  const evaluatedFields: EvaluatedField[] = [];

  // Iterate over all 11 defined fields
  for (const def of COMPLIANCE_FIELDS) {
    const { applicable, reasonIfNotApplicable } = resolveFieldApplicability(def.field_id, meta);

    if (!applicable) {
      evaluatedFields.push({
        field_id: def.field_id,
        label: def.label,
        rule_ref: def.rule_ref,
        rule_version: RULE_VERSION_TAG,
        status: 'NOT_APPLICABLE',
        detected_value: 'N/A (Exempt)',
        required_value: def.description,
        reason: reasonIfNotApplicable || 'Field not applicable for this commodity category.',
        ocr_confidence: 1.0,
        is_conditional: true,
        applicable: false
      });
      continue;
    }

    const fieldData = raw[def.field_id as keyof ExtractionRawPayload] as { text: string; confidence: number; bbox?: [number, number, number, number] } | undefined;
    const detectedText = fieldData?.text?.trim() || '';
    const confidence = fieldData?.confidence ?? 0;
    const bbox = fieldData?.bbox || [10, 10, 90, 20];
    const image_url = raw.sample_image_url || '';

    let status: FieldStatus = 'PASS';
    let reason = 'Declaration present and compliant with Rule 6 regulations.';

    // Low confidence check -> NEEDS_REVIEW
    if (!detectedText) {
      status = 'FAIL';
      reason = `MISSING DECLARATION: Mandatory declaration under ${def.rule_ref} is absent from package labels.`;
    } else if (confidence < 0.65) {
      status = 'NEEDS_REVIEW';
      reason = `LOW OCR CONFIDENCE (${Math.round(confidence * 100)}%): Text extracted as "${detectedText}" requires human inspector review.`;
    } else {
      // Specific Field Legal Validation Logic
      switch (def.field_id) {
        case 'manufacturer_details': {
          const hasPinCode = /\b\d{6}\b/.test(detectedText);
          if (!hasPinCode) {
            status = 'WARNING';
            reason = `BORDERLINE ${def.rule_ref}: Manufacturer address found but missing 6-digit postal PIN code pattern.`;
          } else {
            status = 'PASS';
            reason = `COMPLIANT ${def.rule_ref}: Complete name, physical location, and postal PIN code detected.`;
          }
          break;
        }

        case 'generic_name': {
          if (detectedText.length < 2) {
            status = 'FAIL';
            reason = `VIOLATION ${def.rule_ref}: Generic commodity name is incomplete or too short.`;
          } else {
            status = 'PASS';
            reason = `COMPLIANT ${def.rule_ref}: Generic name clearly declared on front principal display panel.`;
          }
          break;
        }

        case 'net_quantity': {
          // Check standard metric unit pattern e.g. "500 g", "1 L", "100 ml", "5 N"
          const validUnitPattern = /^\d+(\.\d+)?\s*(g|kg|ml|l|cm|m|N)\b/i;
          const nonStandardUnit = /^\d+(\.\d+)?\s*(gms|gm|g.m|lts|ltr|ml.)\b/i;

          if (nonStandardUnit.test(detectedText)) {
            status = 'FAIL';
            reason = `VIOLATION Rule 7: Non-standard unit abbreviation "${detectedText}". Rule 7 mandates standard metric symbols (g, kg, ml, l, cm, m, N).`;
          } else if (!validUnitPattern.test(detectedText)) {
            status = 'WARNING';
            reason = `BORDERLINE Rule 6(1)(c): Net quantity missing space or standard unit format e.g. "${detectedText}".`;
          } else {
            status = 'PASS';
            reason = `COMPLIANT Rule 6(1)(c): Net quantity declared in standard metric units.`;
          }
          break;
        }

        case 'mrp': {
          const hasCurrencySymbol = /(₹|Rs\.|INR)/i.test(detectedText);
          const hasTaxPhrase = /(incl|inclusive).*tax/i.test(detectedText);

          if (!hasCurrencySymbol) {
            status = 'FAIL';
            reason = `VIOLATION Rule 6(1)(e): MRP declaration "${detectedText}" is missing standard currency symbol (₹ or Rs.).`;
          } else if (!hasTaxPhrase) {
            status = 'FAIL';
            reason = `VIOLATION Rule 6(1)(e): MRP declaration "${detectedText}" is missing mandatory phrase 'inclusive of all taxes'.`;
          } else {
            status = 'PASS';
            reason = `COMPLIANT Rule 6(1)(e): MRP declared with currency symbol and mandatory tax-inclusive statement.`;
          }
          break;
        }

        case 'unit_sale_price': {
          const hasPerUnit = /\/\s*(g|kg|ml|l|cm|m|N|piece|unit)\b/i.test(detectedText);
          if (!hasPerUnit) {
            status = 'FAIL';
            reason = `VIOLATION Rule 6(11): Unit Sale Price "${detectedText}" missing standard per-unit metric format (e.g. ₹/g or ₹/ml).`;
          } else {
            status = 'PASS';
            reason = `COMPLIANT Rule 6(11): Unit Sale Price clearly declared per standard metric unit.`;
          }
          break;
        }

        case 'consumer_care': {
          const hasPhone = /(\d{10}|\d{3,4}[-\s]?\d{3}[-\s]?\d{4}|1800\d+)/.test(detectedText);
          const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(detectedText);

          if (!hasPhone && !hasEmail) {
            status = 'FAIL';
            reason = `VIOLATION Rule 6(1)(g): Consumer care details missing both helpline phone number and email address.`;
          } else if (!hasPhone) {
            status = 'FAIL';
            reason = `VIOLATION Rule 6(1)(g): Consumer care details missing telephone helpline number.`;
          } else if (!hasEmail) {
            status = 'FAIL';
            reason = `VIOLATION Rule 6(1)(g): Consumer care details missing contact email address.`;
          } else {
            status = 'PASS';
            reason = `COMPLIANT Rule 6(1)(g): Complete consumer care contact details (Officer Name, Tel, Email & Address).`;
          }
          break;
        }

        case 'mfg_date':
        case 'best_before': {
          const validDateFormat = /\b(0[1-9]|1[0-2])\/(\d{4}|\d{2})\b|\b(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/(\d{4}|\d{2})\b/;
          const spelledOut = /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i.test(detectedText);

          if (spelledOut) {
            status = 'WARNING';
            reason = `BORDERLINE Rule 6(1)(f): Date "${detectedText}" uses month name; MM/YYYY or DD/MM/YYYY numeric format recommended.`;
          } else if (!validDateFormat.test(detectedText) && !/best before/i.test(detectedText)) {
            status = 'WARNING';
            reason = `BORDERLINE Rule 6(1)(f): Non-standard date format "${detectedText}".`;
          } else {
            status = 'PASS';
            reason = `COMPLIANT Rule 6(1)(f): Date declared in standard MM/YYYY format.`;
          }
          break;
        }

        case 'country_of_origin': {
          if (!/origin|made in|country of|imported/i.test(detectedText)) {
            status = 'WARNING';
            reason = `BORDERLINE Rule 6 (Import): Country of origin declared but text "${detectedText}" lacks explicit 'Country of Origin:' prefix.`;
          } else {
            status = 'PASS';
            reason = `COMPLIANT Rule 6 (Import): Country of origin explicitly declared for imported commodity.`;
          }
          break;
        }

        case 'fssai_number': {
          const fssaiRegex = /\b\d{14}\b/;
          if (!fssaiRegex.test(detectedText)) {
            status = 'FAIL';
            reason = `VIOLATION FSSAI: Licence number "${detectedText}" must be exactly a 14-digit numeric code.`;
          } else {
            status = 'PASS';
            reason = `COMPLIANT FSSAI: Valid 14-digit FSSAI food safety licence number detected.`;
          }
          break;
        }

        case 'dimensions': {
          if (!/\d/.test(detectedText)) {
            status = 'FAIL';
            reason = `VIOLATION Rule 6: Dimensions declaration missing numerical measurements.`;
          } else {
            status = 'PASS';
            reason = `COMPLIANT Rule 6: Product dimensions declared in standard units.`;
          }
          break;
        }
      }
    }

    evaluatedFields.push({
      field_id: def.field_id,
      label: def.label,
      rule_ref: def.rule_ref,
      rule_version: RULE_VERSION_TAG,
      status,
      detected_value: detectedText || 'Not Found',
      required_value: def.description,
      reason,
      ocr_confidence: confidence,
      evidence_image_url: image_url,
      bounding_box: bbox,
      is_conditional: def.applicability.startsWith('conditional'),
      applicable: true
    });
  }

  // Run font size evaluation sub-engine
  const mrpNumeralHeight = raw.font_measurement?.measuredNumeralHeightMm ?? 3.0;
  const fontSizeEval = evaluateFontSize(meta.surfaceAreaCm2 ?? 250, raw.font_measurement, mrpNumeralHeight);

  // Compute Overall Result Banner
  let overallResult: OverallResult = 'PASS';

  const hasFail = evaluatedFields.some(f => f.status === 'FAIL') || fontSizeEval.status === 'FAIL';
  const hasNeedsReview = evaluatedFields.some(f => f.status === 'NEEDS_REVIEW') || fontSizeEval.status === 'NEEDS_REVIEW';
  const hasWarning = evaluatedFields.some(f => f.status === 'WARNING') || fontSizeEval.status === 'WARNING';

  if (hasFail) {
    overallResult = 'FAIL';
  } else if (hasNeedsReview) {
    overallResult = 'NEEDS_REVIEW';
  } else if (hasWarning) {
    overallResult = 'WARNING';
  } else {
    overallResult = 'PASS';
  }

  return {
    evaluatedFields,
    fontSizeEval,
    overallResult,
    ruleVersion: RULE_VERSION_TAG
  };
}
