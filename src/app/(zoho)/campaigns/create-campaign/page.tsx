'use client';

//import CreateCampaignForm from './components/CreateCampaignForm';
import CampaignSteps from './components/CampaignSteps';
import SaveCampaignButton from './components/SaveCampaignButton';

export default function ZohoSetupPage() {
  return (
    <div className="p-6 space-y-10">
      <h1 className="text-3xl font-bold text-center text-orange-700">
        🎯 Setup Your Email Campaign
      </h1>

      <CampaignSteps />
<SaveCampaignButton />
      {/* <CreateCampaignForm /> */}
    </div>
  );
}
