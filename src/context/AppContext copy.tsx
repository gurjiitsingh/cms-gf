'use client'

import { createContext, useContext, useEffect, useState } from 'react'

// Define types
type CampaignType = {
  emails: string[]
  createdAt: string
  [key: string]: any
}

type CouponT = {
  id: string
  code: string
  discount: string | number
  minSpend?: number
}

type ContactListType = {
  list_key: string
  list_name: string
}

type CampaignInfoType = {
  campaignName: string
  campaignSubject: string
}

type TemplateType = {
  templateId: string
  content: string
}

type AppContextType = {
  recipients: string[]
  recipientsMarketing: string[]
  oldRecipients: string[]
  setRecipients: (recipients: string[]) => void
  setRecipientsMarketing: (recipients: string[]) => void
  setOldRecipients: (recipients: string[]) => void
  coupons: CouponT[]
  couponsMarketing: CouponT[]
  setCoupons: (coupons: CouponT[]) => void
  setCouponsMarketing: (coupons: CouponT[]) => void
  template: TemplateType | null
  templateMarketing: TemplateType | null
  templateUrl: TemplateType | null
  setTemplate: (template: TemplateType) => void
  setTemplateMarketing: (template: TemplateType) => void
  setTemplateUrl: (templateUrl: TemplateType) => void
  lastCampaign: CampaignType | null
  setLastCampaign: (campaign: CampaignType) => void
  campaignInfo: CampaignInfoType | null
  setCampaignInfo: (info: CampaignInfoType) => void
  manualEmails: string
  setManualEmails: (emails: string) => void
  emailsToRemove: string
  setEmailsToRemove: (emails: string) => void
  contactListForCampaign: ContactListType[]
  setContactListForCampaign: (list: ContactListType[]) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [recipients, setRecipientsState] = useState<string[]>([])
  const [recipientsMarketing, setRecipientsMarketingState] = useState<string[]>([])
  const [oldRecipients, setOldRecipientsState] = useState<string[]>([])
  const [coupons, setCouponsState] = useState<CouponT[]>([])
  const [couponsMarketing, setCouponsMarketingState] = useState<CouponT[]>([])
  const [template, setTemplateState] = useState<TemplateType | null>(null)
  const [templateMarketing, setTemplateMarketingState] = useState<TemplateType | null>(null)
  const [templateUrl, setTemplateStateForUrl] = useState<TemplateType | null>(null)
  const [lastCampaign, setLastCampaignState] = useState<CampaignType | null>(null)
  const [campaignInfo, setCampaignInfoState] = useState<CampaignInfoType | null>(null)
  const [manualEmails, setManualEmailsState] = useState<string>('')
  const [emailsToRemove, setEmailsToRemoveState] = useState<string>('')
  const [contactListForCampaign, setContactListForCampaignState] = useState<ContactListType[]>([])

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('appContext')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed.recipients)) setRecipientsState(parsed.recipients)
        if (Array.isArray(parsed.recipientsMarketing)) setRecipientsMarketingState(parsed.recipientsMarketing)
        if (Array.isArray(parsed.oldRecipients)) setOldRecipientsState(parsed.oldRecipients)
        if (Array.isArray(parsed.coupons)) setCouponsState(parsed.coupons)
        if (Array.isArray(parsed.couponsMarketing)) setCouponsMarketingState(parsed.couponsMarketing)
        if (parsed.template?.templateId && parsed.template?.content) setTemplateState(parsed.template)
        if (parsed.templateMarketing?.templateId && parsed.templateMarketing?.content)
          setTemplateMarketingState(parsed.templateMarketing)
        if (parsed.templateUrl?.templateId && parsed.templateUrl?.content)
          setTemplateStateForUrl(parsed.templateUrl)
        if (parsed.lastCampaign?.emails) setLastCampaignState(parsed.lastCampaign)
        if (parsed.campaignInfo?.campaignName && parsed.campaignInfo?.campaignSubject)
          setCampaignInfoState(parsed.campaignInfo)
        if (typeof parsed.manualEmails === 'string') setManualEmailsState(parsed.manualEmails)
        if (typeof parsed.emailsToRemove === 'string') setEmailsToRemoveState(parsed.emailsToRemove)
        if (Array.isArray(parsed.contactListForCampaign)) setContactListForCampaignState(parsed.contactListForCampaign)
      } catch (e) {
        console.error('Failed to parse appContext from localStorage:', e)
      }
    }
  }, [])

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(
      'appContext',
      JSON.stringify({
        recipients,
        recipientsMarketing,
        oldRecipients,
        coupons,
        couponsMarketing,
        template,
        templateMarketing,
        templateUrl,
        lastCampaign,
        campaignInfo,
        manualEmails,
        emailsToRemove,
        contactListForCampaign,
      })
    )
  }, [
    recipients,
    recipientsMarketing,
    oldRecipients,
    coupons,
    couponsMarketing,
    template,
    templateMarketing,
    templateUrl,
    lastCampaign,
    campaignInfo,
    manualEmails,
    emailsToRemove,
    contactListForCampaign,
  ])

  // Setters
  const setRecipients = (val: string[]) => setRecipientsState(val)
  const setRecipientsMarketing = (val: string[]) => setRecipientsMarketingState(val)
  const setOldRecipients = (val: string[]) => setOldRecipientsState(val)
  const setCoupons = (val: CouponT[]) => setCouponsState(val)
  const setCouponsMarketing = (val: CouponT[]) => setCouponsMarketingState(val)
  const setTemplate = (val: TemplateType) => setTemplateState(val)
  const setTemplateMarketing = (val: TemplateType) => setTemplateMarketingState(val)
  const setTemplateUrl = (val: TemplateType) => setTemplateStateForUrl(val)
  const setLastCampaign = (val: CampaignType) => setLastCampaignState(val)
  const setCampaignInfo = (val: CampaignInfoType) => setCampaignInfoState(val)
  const setManualEmails = (val: string) => setManualEmailsState(val)
  const setEmailsToRemove = (val: string) => setEmailsToRemoveState(val)
  const setContactListForCampaign = (val: ContactListType[]) => setContactListForCampaignState(val)

  return (
    <AppContext.Provider
      value={{
        recipients,
        recipientsMarketing,
        oldRecipients,
        setRecipients,
        setRecipientsMarketing,
        setOldRecipients,
        coupons,
        couponsMarketing,
        setCoupons,
        setCouponsMarketing,
        template,
        templateMarketing,
        templateUrl,
        setTemplate,
        setTemplateMarketing,
        setTemplateUrl,
        lastCampaign,
        setLastCampaign,
        campaignInfo,
        setCampaignInfo,
        manualEmails,
        setManualEmails,
        emailsToRemove,
        setEmailsToRemove,
        contactListForCampaign,
        setContactListForCampaign,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) throw new Error('useAppContext must be used within AppProvider')
  return context
}
