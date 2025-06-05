'use client';

import { createContext, useContext, useEffect, useState } from 'react';

// Define the campaign structure
type CampaignType = {
  emails: string[];
  createdAt: string; // or Date if you prefer and handle conversion
  [key: string]: any; // allow additional fields
};

type CouponT = {
  id: string;
  code: string;
  discount: string | number;
  minSpend?: number;
};

type AppContextType = {
  recipients: string[];
  oldRecipients: string[];
  setRecipients: (recipients: string[]) => void;
  setOldRecipients: (recipients: string[]) => void;
  coupons: CouponT[];
  setCoupons: (coupons: CouponT[]) => void;
  template: { templateId: string; content: string } | null;
  setTemplate: (template: { templateId: string; content: string }) => void;
  lastCampaign: CampaignType | null;
  setLastCampaign: (campaign: CampaignType) => void;
  
  // New states for manualEmails and emailsToRemove
  manualEmails: string;
  setManualEmails: (emails: string) => void;
  emailsToRemove: string;
  setEmailsToRemove: (emails: string) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [recipients, setRecipientsState] = useState<string[]>([]);
  const [oldRecipients, setOldRecipientsState] = useState<string[]>([]);
  const [coupons, setCouponsState] = useState<CouponT[]>([]);
  const [template, setTemplateState] = useState<{ templateId: string; content: string } | null>(null);
  const [lastCampaign, setLastCampaignState] = useState<CampaignType | null>(null);
  
  // New states for manualEmails and emailsToRemove
  const [manualEmails, setManualEmailsState] = useState<string>('');
  const [emailsToRemove, setEmailsToRemoveState] = useState<string>('');

  console.log("recipients------------------",recipients)

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('appContext');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.recipients)) setRecipientsState(parsed.recipients);
         if (Array.isArray(parsed.oldRecipients)) setOldRecipientsState(parsed.oldRecipients);
        if (Array.isArray(parsed.coupons)) setCouponsState(parsed.coupons);
        if (parsed.template?.templateId && parsed.template?.content) setTemplateState(parsed.template);
        if (parsed.lastCampaign?.emails) setLastCampaignState(parsed.lastCampaign);
        
        if (typeof parsed.manualEmails === 'string') setManualEmailsState(parsed.manualEmails);
        if (typeof parsed.emailsToRemove === 'string') setEmailsToRemoveState(parsed.emailsToRemove);
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
        manualEmails,
        emailsToRemove,
      })
    );
  //  console.log("recipients------------", recipients);
  }, [recipients, coupons, template, lastCampaign, manualEmails, emailsToRemove]);

  // Setters
  const setRecipients = (recipients: string[]) => setRecipientsState(recipients);
    const setOldRecipients = (oldRecipients: string[]) => setOldRecipientsState(oldRecipients);
  const setCoupons = (coupons: CouponT[]) => setCouponsState(coupons);
  const setTemplate = (template: { templateId: string; content: string }) => setTemplateState(template);
  const setLastCampaign = (campaign: CampaignType) => setLastCampaignState(campaign);
  
  const setManualEmails = (emails: string) => setManualEmailsState(emails);
  const setEmailsToRemove = (emails: string) => setEmailsToRemoveState(emails);

  return (
    <AppContext.Provider
      value={{
        recipients,
        setRecipients,
        oldRecipients,
        setOldRecipients,
        coupons,
        setCoupons,
        template,
        setTemplate,
        lastCampaign,
        setLastCampaign,
        manualEmails,
        setManualEmails,
        emailsToRemove,
        setEmailsToRemove,
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
