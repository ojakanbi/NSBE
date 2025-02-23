import { storage } from "./firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// ✅ Upload Company Logo
export async function uploadCompanyLogo(file, companyName) {
  try {
    const storageRef = ref(storage, `company_logos/${companyName}.png`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    console.error("❌ Error uploading logo:", error);
    return null;
  }
}
