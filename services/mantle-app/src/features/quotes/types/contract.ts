export interface Feature {
  id: string;
  name: string;
  price: number;
  is_custom: boolean;
  royalty_percentage?: number;
  royalty_timeframe?: number;
  royalty_timeframe_unit?: 'months' | 'years' | 'perpetual';
  pricing_type: 'fixed' | 'royalty' | 'hourly';
  royalty_threshold?: number;
  royalty_buyout_amount?: number;
  hourly_rate?: number;
  monthly_cap_hours?: number;
  max_cap_hours?: number;
  monthly_hours_used?: number;
  last_reset_date?: string;
  weekly_cap_hours?: number;
}