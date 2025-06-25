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
  templateUrl: string | null
  setTemplate: (template: TemplateType) => void
  setTemplateMarketing: (template: TemplateType) => void
  setTemplateUrl: (templateUrl: string) => void
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
  const [templateUrl, setTemplateStateForUrl] = useState("")
  const [lastCampaign, setLastCampaignState] = useState<CampaignType | null>(null)
  const [campaignInfo, setCampaignInfoState] = useState<CampaignInfoType | null>(null)
  const [manualEmails, setManualEmailsState] = useState<string>('')
  const [emailsToRemove, setEmailsToRemoveState] = useState<string>('')
  const [contactListForCampaign, setContactListForCampaignState] = useState<ContactListType[]>([])

  // Load context from localStorage once on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('appContext')
      if (!saved) return

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
      if (
        parsed.campaignInfo?.campaignName &&
        parsed.campaignInfo?.campaignSubject
      ) {
        setCampaignInfoState(parsed.campaignInfo)
      }
      if (typeof parsed.manualEmails === 'string') setManualEmailsState(parsed.manualEmails)
      if (typeof parsed.emailsToRemove === 'string') setEmailsToRemoveState(parsed.emailsToRemove)
      if (Array.isArray(parsed.contactListForCampaign)) setContactListForCampaignState(parsed.contactListForCampaign)
    } catch (err) {
      console.error('Failed to parse appContext from localStorage:', err)
    }
  }, [])

  // Save context to localStorage when any value changes
  useEffect(() => {
    const data = {
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
    }

    try {
      localStorage.setItem('appContext', JSON.stringify(data))
    } catch (err) {
      console.error('Failed to save appContext to localStorage:', err)
    }
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

  return (
    <AppContext.Provider
      value={{
        recipients,
        recipientsMarketing,
        oldRecipients,
        setRecipients: setRecipientsState,
        setRecipientsMarketing: setRecipientsMarketingState,
        setOldRecipients: setOldRecipientsState,
        coupons,
        couponsMarketing,
        setCoupons: setCouponsState,
        setCouponsMarketing: setCouponsMarketingState,
        template,
        templateMarketing,
        templateUrl,
        setTemplate: setTemplateState,
        setTemplateMarketing: setTemplateMarketingState,
        setTemplateUrl: setTemplateStateForUrl,
        lastCampaign,
        setLastCampaign: setLastCampaignState,
        campaignInfo,
        setCampaignInfo: setCampaignInfoState,
        manualEmails,
        setManualEmails: setManualEmailsState,
        emailsToRemove,
        setEmailsToRemove: setEmailsToRemoveState,
        contactListForCampaign,
        setContactListForCampaign: setContactListForCampaignState,
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
