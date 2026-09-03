import { TableInfo } from '../types';

export const INITIAL_TABLES: TableInfo[] = Array.from({ length: 20 }, (_, i) => {
  const id = i + 1;
  const isTable12 = id === 12;
  const isOccupied = [3, 7, 12, 16].includes(id);
  const isReserved = id === 5;

  return {
    id,
    name: `Table ${id}`,
    capacity: id % 4 === 0 ? 6 : id % 2 === 0 ? 4 : 2,
    status: isTable12 ? 'occupied' : isOccupied ? 'occupied' : isReserved ? 'reserved' : 'available',
    qrActive: true,
    qrUrl: `https://fryguy.demo/order?table=${id}`,
    currentOrderId: isTable12 ? 'order-1048' : undefined,
  };
});
