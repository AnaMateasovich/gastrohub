import Link from "next/link";
import { StoreSettingsType } from "../../types/storeSettings";

const REQUIRED_FIELDS: (keyof StoreSettingsType)[] = [

  "organizationName",
  "storeDescription",

  "city",
  "province",
  "address",

  "heroImageUrl",
  "heroBadgeText",
  "heroTitle",
  "heroHighlight",
  "heroSubtitle",
  "ctaLabel",

  "deliveryFee",

  "openingTime",
  "closingTime",

  "whatsappPhone",
  "storeEmail",
  "instagramUrl",

  "enableCoupons",
  "maxDiscountPercentage",

  "announcementBar",


];

function getConfigCompletion(settings: StoreSettingsType | null) {
  if (!settings) {
    return { percent: 0, isComplete: false };
  }

  const filled = REQUIRED_FIELDS.filter((f) => !!settings[f]).length;
  const percent = Math.round((filled / REQUIRED_FIELDS.length) * 100);

  return { percent, isComplete: filled === REQUIRED_FIELDS.length };
}

type StoreConfigAlertProps = {
  settings: StoreSettingsType | null;
  isOwnerViewing?: boolean;
};

export default function StoreConfigAlert({
  settings,
  isOwnerViewing = false,
}: StoreConfigAlertProps) {
  const { percent, isComplete } = getConfigCompletion(settings);


  if (!isOwnerViewing || isComplete) return null; 
  return (
    <div className="bg-red-500/80 text-amber-100 text-sm px-6 py-2 flex items-center justify-between">
      <span>
        Te falta completar un {100 - percent}% de la configuración de tu tienda.
      </span>
      <Link href="/admin/configuracion" className="underline font-medium">
        Completar configuración →
      </Link>
    </div>
  );
}
