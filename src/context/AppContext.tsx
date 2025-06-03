'use client';

import { createContext, useContext, useEffect, useState } from 'react';

// Define the campaign structure
type CampaignType = {
  emails: string[];
  createdAt: string; // or Date if you prefer and handle conversion
  [key: string]: any; // allow additional fields
};

type AppContextType = {
  recipients: string[];
  setRecipients: (recipients: string[]) => void;
  coupons: CouponT[];
setCoupons: (coupons: CouponT[]) => void;
  template: { templateId: string; content: string } | null;
  setTemplate: (template: { templateId: string; content: string }) => void;
  lastCampaign: CampaignType | null;
  setLastCampaign: (campaign: CampaignType) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

type CouponT = {
  code: string;
  discount: string | number;
  minSpend?: number;
};

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [recipients, setRecipientsState] = useState<string[]>([]);
  const [coupons, setCouponsState] = useState<CouponT[]>([]);
  const [template, setTemplateState] = useState<{ templateId: string; content: string } | null>(null);
  const [lastCampaign, setLastCampaignState] = useState<CampaignType | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('appContext');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.recipients)) setRecipientsState(parsed.recipients);
        if (Array.isArray(parsed.coupons)) setCouponsState(parsed.coupons);
        if (parsed.template?.templateId && parsed.template?.content) setTemplateState(parsed.template);
        if (parsed.lastCampaign?.emails) setLastCampaignState(parsed.lastCampaign);
      } catch (e) {
        console.error('Failed to parse appContext from localStorage:', e);
      }
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem(
      'appContext',
      JSON.stringify({
        recipients,
        coupons,
        template,
        lastCampaign,
      })
    );
    console.log("lastCampaign---------------", lastCampaign)
  }, [recipients, coupons, template, lastCampaign]);

  // Setters
  const setRecipients = (recipients: string[]) => setRecipientsState(recipients);
 const setCoupons = (coupons: CouponT[]) => setCouponsState(coupons);
  const setTemplate = (template: { templateId: string; content: string }) => setTemplateState(template);
  const setLastCampaign = (campaign: CampaignType) => setLastCampaignState(campaign);

  return (
    <AppContext.Provider
      value={{
        recipients,
        setRecipients,
        coupons,
        setCoupons,
        template,
        setTemplate,
        lastCampaign,
        setLastCampaign,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
