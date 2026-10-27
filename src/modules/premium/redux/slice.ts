import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type PremiumState = { upgradeOpen: boolean; upgradeMessage?: string };

const initialState: PremiumState = { upgradeOpen: false };

export const premiumSlice = createSlice({
  name: 'Premium',
  initialState,
  reducers: {
    openUpgradeModal: (s, a: PayloadAction<string | undefined>) => {
      s.upgradeOpen = true;
      s.upgradeMessage = a.payload;
    },
    closeUpgradeModal: s => {
      s.upgradeOpen = false;
    },
  },
});

export const premiumAction = premiumSlice.actions;
export const premiumReducer = premiumSlice.reducer;
