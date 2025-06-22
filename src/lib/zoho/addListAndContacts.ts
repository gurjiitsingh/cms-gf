import axios from "axios";
import qs from "qs";

export async function addListAndContactsZoho(
    oauthToken: string,
inputPayload: {
    emailids: string; // comma-separated string, not array
    listname: string;
    signupform: "public" | "private";
    mode: "newlist" | "existinglist";
    listdescription?: string;
  }
) {
   console.log("oauthToken in create list----------", oauthToken)
  try {
    const formData = qs.stringify({
      resfmt: "JSON",
      emailids: inputPayload.emailids, // 🔁 Use real emails
      listname: inputPayload.listname,
      signupform: "private",
      mode: inputPayload.mode,
      listdescription: inputPayload.listdescription,
    });

    console.log("✅ Form Data Being Sent:\n", formData);

    const response = await axios.post(
      "https://campaigns.zoho.in/api/v1.1/addlistandcontacts",
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Zoho-oauthtoken ${oauthToken}`,
        },
      }
    );

    console.log("✅ Zoho Response:\n", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Zoho API Error:", error.response?.data || error.message);
    throw error;
  }
}
