import { ProduceListing } from '../types';
import { productService } from './productService';

export interface InventoryOverview {
  totalProduceCount: number;
  totalStockKg: number;
  availableStockKg: number;
  reservedStockKg: number;
  soldStockKg: number;
  items: {
    listingId: string;
    name: string;
    variety: string;
    grade: string;
    totalQuantity: number;
    availableQuantity: number;
    reservedQuantity: number;
    soldQuantity: number;
    unit: string;
    status: string;
    percentageAvailable: number;
  }[];
}

export const inventoryService = {
  async getFarmerInventoryOverview(farmerId: string): Promise<InventoryOverview> {
    const listings = await productService.getFarmerListings(farmerId);

    let totalStock = 0;
    let availableStock = 0;
    let reservedStock = 0;
    let soldStock = 0;

    const items = listings.map(l => {
      totalStock += l.totalQuantity;
      availableStock += l.availableQuantity;
      reservedStock += l.reservedQuantity;
      soldStock += l.soldQuantity;

      const percentage = l.totalQuantity > 0 ? Math.round((l.availableQuantity / l.totalQuantity) * 100) : 0;

      return {
        listingId: l.id,
        name: l.name,
        variety: l.variety,
        grade: l.grade,
        totalQuantity: l.totalQuantity,
        availableQuantity: l.availableQuantity,
        reservedQuantity: l.reservedQuantity,
        soldQuantity: l.soldQuantity,
        unit: l.unit,
        status: l.status,
        percentageAvailable: percentage,
      };
    });

    return {
      totalProduceCount: listings.length,
      totalStockKg: totalStock,
      availableStockKg: availableStock,
      reservedStockKg: reservedStock,
      soldStockKg: soldStock,
      items,
    };
  },

  async adjustStock(listingId: string, availableQuantity: number, reservedQuantity?: number): Promise<ProduceListing> {
    const listing = await productService.getListingById(listingId);
    if (!listing) throw new Error('Produce not found');

    const newReserved = reservedQuantity !== undefined ? reservedQuantity : listing.reservedQuantity;
    const newTotal = availableQuantity + newReserved + listing.soldQuantity;
    const newStatus = availableQuantity === 0 ? 'sold_out' : listing.status === 'sold_out' ? 'active' : listing.status;

    return await productService.updateListing(listingId, {
      availableQuantity,
      reservedQuantity: newReserved,
      totalQuantity: newTotal,
      status: newStatus,
    });
  },
};
