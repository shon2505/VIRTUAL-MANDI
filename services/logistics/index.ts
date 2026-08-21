/**
 * B2B Agricultural Mandi Logistics & E-Way Bill Stub
 */

export interface FreightEstimateRequest {
  originMandi: string;
  originDistrict: string;
  destinationWarehouse: string;
  weightTonnes: number;
  perishable: boolean;
}

export const logisticsService = {
  async calculateFreight(req: FreightEstimateRequest) {
    const baseRatePerTonneKm = req.perishable ? 6.5 : 4.5;
    const estimatedDistanceKm = 160; // Average Maharashtra intra-mandi distance
    const totalFreight = Math.round(baseRatePerTonneKm * estimatedDistanceKm * Math.max(req.weightTonnes, 1));

    return {
      distanceKm: estimatedDistanceKm,
      estimatedHours: 4.5,
      freightAmount: totalFreight,
      recommendedVehicle: req.weightTonnes > 5 ? '14-ft Eicher Heavy' : 'Mahindra Bolero Maxi Truck',
      climateControlRequired: req.perishable,
    };
  },

  async generateEWayBill(orderId: string, vehicleNo: string) {
    return {
      eWayBillNo: `EWB-2608-${Math.floor(100000 + Math.random() * 900000)}`,
      generatedAt: new Date().toISOString(),
      validUntil: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
      vehicleNo,
    };
  },
};
