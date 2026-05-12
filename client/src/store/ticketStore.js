import { create } from 'zustand';

const ZONE_PRICES = {
  green: { label: 'Green Zone (General Standing)', price: 500, color: '#00C853' },
  blue: { label: 'Blue Zone (Lower Tier)', price: 1200, color: '#2196F3' },
  silver: { label: 'Silver Zone (Middle Tier)', price: 2500, color: '#9E9E9E' },
  gold: { label: 'Gold Zone (VIP Upper)', price: 5000, color: '#FFD700' },
  platinum: { label: 'Platinum Suite', price: 15000, color: '#E91E63' },
};

const useTicketStore = create((set, get) => ({
  step: 0,
  selectedMatch: null,
  selectedZone: null,
  quantity: 1,
  ticketType: 'adult',
  promoCode: '',
  buyer: { fullName: '', email: '', phone: '', idNumber: '' },
  deliveryMethod: 'eticket',
  collectionPoint: '',
  paymentMethod: 'mpesa',

  setStep: (step) => set({ step }),
  nextStep: () => set({ step: Math.min(get().step + 1, 4) }),
  prevStep: () => set({ step: Math.max(get().step - 1, 0) }),

  setSelectedMatch: (match) => set({ selectedMatch: match, selectedZone: null }),
  setSelectedZone: (zone) => set({ selectedZone: zone }),
  setQuantity: (quantity) => set({ quantity: Math.max(1, Math.min(10, quantity)) }),
  setTicketType: (ticketType) => set({ ticketType }),
  setPromoCode: (code) => set({ promoCode: code }),
  setBuyer: (buyer) => set({ buyer }),
  setBuyerField: (field, value) => set({ buyer: { ...get().buyer, [field]: value } }),
  setDeliveryMethod: (method) => set({ deliveryMethod: method }),
  setCollectionPoint: (point) => set({ collectionPoint: point }),
  setPaymentMethod: (method) => set({ paymentMethod: method }),

  reset: () => set({
    step: 0, selectedMatch: null, selectedZone: null, quantity: 1,
    ticketType: 'adult', promoCode: '', buyer: { fullName: '', email: '', phone: '', idNumber: '' },
    deliveryMethod: 'eticket', collectionPoint: '', paymentMethod: 'mpesa',
  }),

  get pricePerTicket() {
    const zone = get().selectedZone;
    if (!zone) return 0;
    let price = ZONE_PRICES[zone]?.price || 0;
    const type = get().ticketType;
    if (type === 'under16') price = Math.round(price * 0.7);
    else if (type === 'senior') price = Math.round(price * 0.8);
    return price;
  },

  get total() {
    return get().pricePerTicket * get().quantity;
  },

  zones: Object.entries(ZONE_PRICES).map(([key, val]) => ({ zone: key, ...val })),
}));

export default useTicketStore;
