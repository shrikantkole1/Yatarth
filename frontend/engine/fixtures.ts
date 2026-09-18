/**
 * Yatarth AI — Pre-Fed Commodity Test Profiles with Actual Product Package Scans
 */

import { ExtractionRawPayload, ProductMetadata } from './complianceEngine';

export interface DemoFixture {
  id: string;
  name: string;
  category: string;
  description: string;
  metadata: ProductMetadata;
  rawPayload: ExtractionRawPayload;
}

export const DEMO_FIXTURES: Record<string, DemoFixture> = {
  chips_lays_compliant: {
    id: "chips_lays_compliant",
    name: "Lay's India's Magic Masala Chips 50g (Fully Compliant)",
    category: "Food & Beverages",
    description: "Actual photo scan of Lay's potato chips pack satisfying all 11 Rule 6 declarations, FSSAI 14-digit licence, MRP tax statement, and Rule 7 font size.",
    metadata: {
      category: "Food & Beverages",
      isFood: true,
      isImported: false,
      hasShelfLife: true,
      hasDimensions: false,
      surfaceAreaCm2: 180, // ≤ 200 cm² -> requires min 2.0 mm numeral height
      mrpAmount: 20,       // MRP ≤ 35 -> Exempt from USP under Rule 6(11)
      isWholesale: false
    },
    rawPayload: {
      manufacturer_details: {
        text: "PepsiCo India Holdings Pvt. Ltd., Village Channo, Patiala Road, Sangrur - 148028, Punjab, India",
        confidence: 0.98,
        bbox: [15, 65, 85, 75]
      },
      generic_name: {
        text: "Potato Chips - Spicy Magic Masala",
        confidence: 0.99,
        bbox: [20, 15, 80, 25]
      },
      net_quantity: {
        text: "50 g",
        confidence: 0.98,
        bbox: [30, 30, 70, 38]
      },
      mfg_date: {
        text: "04/2026",
        confidence: 0.96,
        bbox: [20, 42, 50, 48]
      },
      best_before: {
        text: "Best before 4 months from packing date",
        confidence: 0.97,
        bbox: [20, 49, 80, 55]
      },
      mrp: {
        text: "MRP ₹ 20.00 (Incl. of all taxes)",
        confidence: 0.99,
        bbox: [20, 57, 80, 63]
      },
      consumer_care: {
        text: "Manager Consumer Care, PepsiCo India, PO Box 27, Gurgaon 122002. Tel: 1800-22-9900, Email: consumer.care@pepsico.com",
        confidence: 0.95,
        bbox: [10, 78, 90, 88]
      },
      fssai_number: {
        text: "FSSAI Lic No. 10012063000110",
        confidence: 0.98,
        bbox: [25, 89, 75, 95]
      },
      font_measurement: {
        measuredNumeralHeightMm: 2.8,
        measuredLetterHeightMm: 1.5,
        measuredWidthRatio: 0.44,
        isEmbossed: false
      },
      sample_image_url: "/images/lays_chips.jpg"
    }
  },

  chips_masala_violating: {
    id: "chips_masala_violating",
    name: "Crispy Wave Masala Chips 90g (Multi-Violation)",
    category: "Food & Beverages",
    description: "Actual photo scan of non-compliant chips pack with non-standard unit 'GMS', missing tax text on MRP, incomplete helpline email, and undersized font (1.8mm vs 4.0mm required).",
    metadata: {
      category: "Food & Beverages",
      isFood: true,
      isImported: false,
      hasShelfLife: true,
      hasDimensions: false,
      surfaceAreaCm2: 310,
      mrpAmount: 45,
      isWholesale: false
    },
    rawPayload: {
      manufacturer_details: {
        text: "Wave Snacks Ltd., Plot 8 Industrial Area, Sitapura, Jaipur",
        confidence: 0.91,
        bbox: [15, 70, 85, 78]
      },
      generic_name: {
        text: "Spicy Potato Chips",
        confidence: 0.96,
        bbox: [20, 15, 80, 25]
      },
      net_quantity: {
        text: "90 GMS",
        confidence: 0.95,
        bbox: [35, 30, 65, 38]
      },
      mfg_date: {
        text: "03/2026",
        confidence: 0.92,
        bbox: [20, 42, 50, 48]
      },
      best_before: {
        text: "Best before 6 months from packaging",
        confidence: 0.94,
        bbox: [20, 49, 80, 55]
      },
      mrp: {
        text: "MRP Rs 45.00",
        confidence: 0.98,
        bbox: [20, 57, 80, 63]
      },
      unit_sale_price: {
        text: "USP: ₹ 0.50 / g",
        confidence: 0.93,
        bbox: [20, 64, 80, 70]
      },
      consumer_care: {
        text: "Helpline: 0141-2334455 (Wave Snacks Jaipur)",
        confidence: 0.88,
        bbox: [10, 80, 90, 88]
      },
      fssai_number: {
        text: "Lic No. 1001401300055",
        confidence: 0.92,
        bbox: [25, 90, 75, 96]
      },
      font_measurement: {
        measuredNumeralHeightMm: 1.8,
        measuredUspHeightMm: 1.1,
        measuredLetterHeightMm: 0.9,
        measuredWidthRatio: 0.35,
        isEmbossed: false
      },
      sample_image_url: "/images/crispy_chips.jpg"
    }
  },

  biscuit_parleg_compliant: {
    id: "biscuit_parleg_compliant",
    name: "Parle-G Gold Biscuits 250g (Fully Compliant)",
    category: "Food & Beverages",
    description: "Actual photo scan of compliant glucose biscuit pack satisfying all 11 mandatory LMPC rules and Rule 7 font height requirements.",
    metadata: {
      category: "Food & Beverages",
      isFood: true,
      isImported: false,
      hasShelfLife: true,
      hasDimensions: false,
      surfaceAreaCm2: 290,
      mrpAmount: 30,
      isWholesale: false
    },
    rawPayload: {
      manufacturer_details: {
        text: "Parle Products Pvt. Ltd., North Level Crossing, Vile Parle East, Mumbai - 400057, Maharashtra, India",
        confidence: 0.99,
        bbox: [15, 65, 85, 75]
      },
      generic_name: {
        text: "Glucose Biscuits",
        confidence: 0.99,
        bbox: [20, 15, 80, 25]
      },
      net_quantity: {
        text: "250 g",
        confidence: 0.98,
        bbox: [30, 30, 70, 38]
      },
      mfg_date: {
        text: "05/2026",
        confidence: 0.97,
        bbox: [20, 42, 50, 48]
      },
      best_before: {
        text: "Best before 6 months from date of packaging",
        confidence: 0.96,
        bbox: [20, 49, 80, 55]
      },
      mrp: {
        text: "MRP ₹ 30.00 (Incl. of all taxes)",
        confidence: 0.99,
        bbox: [20, 57, 80, 63]
      },
      consumer_care: {
        text: "Consumer Care Manager: Parle Products, Vile Parle Mumbai. Tel: 1800-22-7755, Email: cs@parle.biz",
        confidence: 0.96,
        bbox: [10, 78, 90, 88]
      },
      fssai_number: {
        text: "FSSAI Lic No. 10013022002255",
        confidence: 0.98,
        bbox: [25, 89, 75, 95]
      },
      font_measurement: {
        measuredNumeralHeightMm: 4.6,
        measuredLetterHeightMm: 1.8,
        measuredWidthRatio: 0.42,
        isEmbossed: false
      },
      sample_image_url: "/images/parleg_biscuit.jpg"
    }
  },

  biscuit_bourbon_warning: {
    id: "biscuit_bourbon_warning",
    name: "Britannia Bourbon Biscuits 150g (Borderline Warning)",
    category: "Food & Beverages",
    description: "Actual photo scan of cream biscuit pack with minor date formatting warning and borderline font size (2.1mm vs 2.0mm min).",
    metadata: {
      category: "Food & Beverages",
      isFood: true,
      isImported: false,
      hasShelfLife: true,
      hasDimensions: false,
      surfaceAreaCm2: 195,
      mrpAmount: 45,
      isWholesale: false
    },
    rawPayload: {
      manufacturer_details: {
        text: "Britannia Industries Ltd., Executive Centre, Whitefield, Bengaluru - 560066, Karnataka, India",
        confidence: 0.97,
        bbox: [15, 65, 85, 75]
      },
      generic_name: {
        text: "Chocolate Cream Biscuits",
        confidence: 0.98,
        bbox: [20, 15, 80, 25]
      },
      net_quantity: {
        text: "150g",
        confidence: 0.95,
        bbox: [30, 30, 70, 38]
      },
      mfg_date: {
        text: "March 2026",
        confidence: 0.92,
        bbox: [20, 42, 50, 48]
      },
      best_before: {
        text: "Best before 9 months from manufacture",
        confidence: 0.94,
        bbox: [20, 49, 80, 55]
      },
      mrp: {
        text: "MRP ₹ 45.00 (Incl. of all taxes)",
        confidence: 0.98,
        bbox: [20, 57, 80, 63]
      },
      unit_sale_price: {
        text: "USP: ₹ 0.30 / g",
        confidence: 0.95,
        bbox: [20, 64, 80, 70]
      },
      consumer_care: {
        text: "Britannia Care Officer, Executive Centre Bengaluru. Tel: 1800-425-4449, Email: feedback@britannia.co.in",
        confidence: 0.96,
        bbox: [10, 78, 90, 88]
      },
      fssai_number: {
        text: "FSSAI Lic No. 10015043001122",
        confidence: 0.97,
        bbox: [25, 89, 75, 95]
      },
      font_measurement: {
        measuredNumeralHeightMm: 2.1,
        measuredLetterHeightMm: 1.4,
        measuredWidthRatio: 0.40,
        isEmbossed: false
      },
      sample_image_url: "/images/bourbon_biscuit.jpg"
    }
  }
};

export function getExtractionResult(
  image?: string,
  category?: string,
  meta?: ProductMetadata,
  selectedFixtureId?: string
): { payload: ExtractionRawPayload; metadata: ProductMetadata; fixtureName: string } {
  if (selectedFixtureId && DEMO_FIXTURES[selectedFixtureId]) {
    const fix = DEMO_FIXTURES[selectedFixtureId];
    return {
      payload: fix.rawPayload,
      metadata: fix.metadata,
      fixtureName: fix.name
    };
  }

  if (category === 'Chips' || (image && image.toLowerCase().includes('chip'))) {
    const fix = DEMO_FIXTURES.chips_lays_compliant;
    return { payload: fix.rawPayload, metadata: fix.metadata, fixtureName: fix.name };
  } else if (category === 'Biscuits' || (image && image.toLowerCase().includes('biscuit'))) {
    const fix = DEMO_FIXTURES.biscuit_parleg_compliant;
    return { payload: fix.rawPayload, metadata: fix.metadata, fixtureName: fix.name };
  }

  const defaultFix = DEMO_FIXTURES.chips_lays_compliant;
  return {
    payload: defaultFix.rawPayload,
    metadata: meta ? { ...defaultFix.metadata, ...meta } : defaultFix.metadata,
    fixtureName: defaultFix.name
  };
}
