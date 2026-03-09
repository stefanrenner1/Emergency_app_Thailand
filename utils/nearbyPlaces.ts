/**
 * Fetch nearby places via OpenStreetMap Overpass API
 * and consulate data for Thailand
 */

export interface NearbyPlace {
  id: string;
  name: string;
  lat: number;
  lon: number;
  distance: number;
  address?: string;
  phone?: string;
}

const OVERPASS_URL = "https://overpass-api.de/api/interpreter";
const RADIUS_M = 10000; // 10km

function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // metres
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function fetchNearbyHospitals(
  lat: number,
  lon: number
): Promise<NearbyPlace[]> {
  const query = `[out:json];(node["amenity"="hospital"](around:${RADIUS_M},${lat},${lon});node["healthcare"="hospital"](around:${RADIUS_M},${lat},${lon}););out body;`;
  try {
    const res = await fetch(OVERPASS_URL, {
      method: "POST",
      body: query,
    });
    const data = await res.json();
    const places: NearbyPlace[] = (data.elements || [])
      .map((el: { id: number; lat: number; lon: number; tags?: Record<string, string> }) => ({
        id: String(el.id),
        name: el.tags?.name || "Hospital",
        lat: el.lat,
        lon: el.lon,
        distance: haversineDistance(lat, lon, el.lat, el.lon),
        address: el.tags?.["addr:full"] || el.tags?.["addr:street"],
      }))
      .sort((a: NearbyPlace, b: NearbyPlace) => a.distance - b.distance)
      .slice(0, 3);
    return places;
  } catch (err) {
    console.error("Fetch hospitals failed:", err);
    return [];
  }
}

export async function fetchNearbyPharmacies(
  lat: number,
  lon: number
): Promise<NearbyPlace[]> {
  const query = `[out:json];node["amenity"="pharmacy"](around:${RADIUS_M},${lat},${lon});out body;`;
  try {
    const res = await fetch(OVERPASS_URL, {
      method: "POST",
      body: query,
    });
    const data = await res.json();
    const places: NearbyPlace[] = (data.elements || [])
      .map((el: { id: number; lat: number; lon: number; tags?: Record<string, string> }) => ({
        id: `pharmacy-${el.id}`,
        name: el.tags?.name || "Pharmacy",
        lat: el.lat,
        lon: el.lon,
        distance: haversineDistance(lat, lon, el.lat, el.lon),
        address: el.tags?.["addr:full"] || el.tags?.["addr:street"],
      }))
      .sort((a: NearbyPlace, b: NearbyPlace) => a.distance - b.distance)
      .slice(0, 3);
    return places;
  } catch (err) {
    console.error("Fetch pharmacies failed:", err);
    return [];
  }
}

export async function fetchNearbyPolice(
  lat: number,
  lon: number
): Promise<NearbyPlace[]> {
  const query = `[out:json];node["amenity"="police"](around:${RADIUS_M},${lat},${lon});out body;`;
  try {
    const res = await fetch(OVERPASS_URL, {
      method: "POST",
      body: query,
    });
    const data = await res.json();
    const places: NearbyPlace[] = (data.elements || [])
      .map((el: { id: number; lat: number; lon: number; tags?: Record<string, string> }) => ({
        id: String(el.id),
        name: el.tags?.name || "Police Station",
        lat: el.lat,
        lon: el.lon,
        distance: haversineDistance(lat, lon, el.lat, el.lon),
        address: el.tags?.["addr:full"] || el.tags?.["addr:street"],
      }))
      .sort((a: NearbyPlace, b: NearbyPlace) => a.distance - b.distance)
      .slice(0, 3);
    return places;
  } catch (err) {
    console.error("Fetch police failed:", err);
    return [];
  }
}

// Consulates/Embassies in Bangkok – major countries
const CONSULATES: Array<{
  country: string;
  keywords: string[];
  name: string;
  lat: number;
  lon: number;
  address: string;
  phone?: string;
}> = [
  {
    country: "US",
    keywords: ["american", "usa", "united states", "us"],
    name: "U.S. Embassy Bangkok",
    lat: 13.7328,
    lon: 100.5412,
    address: "95 Wireless Road, Lumpini, Pathum Wan, Bangkok 10330",
    phone: "+66 2 205 4000",
  },
  {
    country: "UK",
    keywords: ["british", "uk", "united kingdom", "english"],
    name: "British Embassy Bangkok",
    lat: 13.7356,
    lon: 100.5392,
    address: "14 Wireless Road, Lumpini, Pathum Wan, Bangkok 10330",
    phone: "+66 2 305 8333",
  },
  {
    country: "DE",
    keywords: ["german", "germany", "deutschland"],
    name: "German Embassy Bangkok",
    lat: 13.7367,
    lon: 100.5399,
    address: "9 Sathon Tai Road, Bangkok 10120",
    phone: "+66 2 287 9000",
  },
  {
    country: "AU",
    keywords: ["australian", "australia"],
    name: "Australian Embassy Bangkok",
    lat: 13.7458,
    lon: 100.5341,
    address: "181 Sathon Tai Road, Bangkok 10120",
    phone: "+66 2 344 6300",
  },
  {
    country: "FR",
    keywords: ["french", "france"],
    name: "French Embassy Bangkok",
    lat: 13.729,
    lon: 100.5393,
    address: "35 Charoen Krung Road, Bangkok 10500",
    phone: "+66 2 657 5100",
  },
  {
    country: "CH",
    keywords: ["swiss", "switzerland"],
    name: "Swiss Embassy Bangkok",
    lat: 13.7274,
    lon: 100.5292,
    address: "35 North Wireless Road, Bangkok 10330",
    phone: "+66 2 254 5700",
  },
  {
    country: "AT",
    keywords: ["austrian", "austria"],
    name: "Austrian Embassy Bangkok",
    lat: 13.7389,
    lon: 100.5414,
    address: "14 Soi Nandha, Sathon Tai Road, Bangkok 10120",
    phone: "+66 2 309 5200",
  },
  {
    country: "NL",
    keywords: ["dutch", "netherlands", "holland"],
    name: "Dutch Embassy Bangkok",
    lat: 13.7395,
    lon: 100.5412,
    address: "15 Soi Tonson, Ploenchit Road, Bangkok 10330",
    phone: "+66 2 309 5200",
  },
  {
    country: "JP",
    keywords: ["japanese", "japan"],
    name: "Japanese Embassy Bangkok",
    lat: 13.7312,
    lon: 100.5415,
    address: "1674 New Petchaburi Road, Bangkok 10310",
    phone: "+66 2 207 8500",
  },
  {
    country: "CN",
    keywords: ["chinese", "china"],
    name: "Chinese Embassy Bangkok",
    lat: 13.7245,
    lon: 100.5352,
    address: "57 Ratchadaphisek Road, Bangkok 10900",
    phone: "+66 2 245 7043",
  },
  {
    country: "IN",
    keywords: ["indian", "india"],
    name: "Indian Embassy Bangkok",
    lat: 13.7382,
    lon: 100.5421,
    address: "46 Soi Prasarnmit, Sukhumvit 23, Bangkok 10110",
    phone: "+66 2 258 0300",
  },
  {
    country: "CA",
    keywords: ["canadian", "canada"],
    name: "Canadian Embassy Bangkok",
    lat: 13.7398,
    lon: 100.5418,
    address: "15th Floor, Abdulrahim Place, 990 Rama IV Road, Bangkok 10500",
    phone: "+66 2 646 4300",
  },
  {
    country: "IT",
    keywords: ["italian", "italy"],
    name: "Italian Embassy Bangkok",
    lat: 13.7378,
    lon: 100.5402,
    address: "399 Nang Linchi Road, Bangkok 10120",
    phone: "+66 2 250 4970",
  },
  {
    country: "ES",
    keywords: ["spanish", "spain"],
    name: "Spanish Embassy Bangkok",
    lat: 13.7385,
    lon: 100.5408,
    address: "193/1 Wireless Road, Bangkok 10330",
    phone: "+66 2 252 6112",
  },
  {
    country: "SE",
    keywords: ["swedish", "sweden"],
    name: "Swedish Embassy Bangkok",
    lat: 13.7392,
    lon: 100.541,
    address: "20th Floor, Sindhorn Building, 130-132 Wireless Road, Bangkok 10330",
    phone: "+66 2 263 7200",
  },
  {
    country: "NO",
    keywords: ["norwegian", "norway"],
    name: "Norwegian Embassy Bangkok",
    lat: 13.7388,
    lon: 100.5405,
    address: "20th Floor, CP Tower, 313 Silom Road, Bangkok 10500",
    phone: "+66 2 234 3360",
  },
  {
    country: "DK",
    keywords: ["danish", "denmark"],
    name: "Danish Embassy Bangkok",
    lat: 13.739,
    lon: 100.5407,
    address: "10 Soi Attakarn Prasit, Sathon Tai Road, Bangkok 10120",
    phone: "+66 2 343 1104",
  },
  {
    country: "RU",
    keywords: ["russian", "russia"],
    name: "Russian Embassy Bangkok",
    lat: 13.7315,
    lon: 100.542,
    address: "78 Sap Road, Bangkok 10500",
    phone: "+66 2 234 9824",
  },
  {
    country: "KR",
    keywords: ["korean", "south korea", "korea"],
    name: "Korean Embassy Bangkok",
    lat: 13.7375,
    lon: 100.5415,
    address: "23 Thungmahamek, Sathon, Bangkok 10120",
    phone: "+66 2 247 7537",
  },
  {
    country: "BR",
    keywords: ["brazilian", "brazil"],
    name: "Brazilian Embassy Bangkok",
    lat: 13.738,
    lon: 100.5409,
    address: "28 Soi 1, Sukhumvit Road, Bangkok 10110",
    phone: "+66 2 260 2672",
  },
];

export function findNearestConsulate(
  lat: number,
  lon: number,
  nationality?: string
): NearbyPlace & { needsNationality?: boolean } | null {
  const normalized = (nationality || "").toLowerCase().trim();
  const match = CONSULATES.find((c) =>
    c.keywords.some((k) => normalized.includes(k))
  );
  const consulate = match || CONSULATES[0]; // fallback to US
  const distance = haversineDistance(lat, lon, consulate.lat, consulate.lon);
  return {
    id: consulate.country,
    name: consulate.name,
    lat: consulate.lat,
    lon: consulate.lon,
    distance,
    address: consulate.address,
    phone: consulate.phone,
    needsNationality: !match && !normalized,
  };
}

// Towing / Roadside assistance in Thailand (nationwide hotlines)
const TOWING_SERVICES: Array<{
  name: string;
  nameTh: string;
  phone: string;
  desc: string;
  descTh: string;
  highwayOnly?: boolean;
}> = [
  {
    name: "Ruam Duay Chuay Kan (Free Roadside Assistance)",
    nameTh: "ร่วมด้วยช่วยกัน (บริการฟรี)",
    phone: "1677",
    desc: "Free 24/7 roadside assistance nationwide",
    descTh: "บริการฉุกเฉินฟรี 24 ชม. ทั่วประเทศ",
  },
  {
    name: "Highway Police",
    nameTh: "ตำรวจทางหลวง",
    phone: "1193",
    desc: "Highway accidents, breakdowns, emergencies",
    descTh: "อุบัติเหตุทางหลวง รถเสีย ฉุกเฉิน",
    highwayOnly: true,
  },
  {
    name: "Traffic Hotline",
    nameTh: "สายด่วนจราจร",
    phone: "1197",
    desc: "Traffic info and coordination",
    descTh: "ข้อมูลการจราจรและประสานงาน",
  },
  {
    name: "BKI Roadside Assistance",
    nameTh: "BKI บริการข้างทาง",
    phone: "1438",
    desc: "24h towing, fuel, tire, battery (insurance)",
    descTh: "24 ชม. ลากจูง น้ำมัน ยาง แบตเตอรี่",
  },
  {
    name: "LMG Roadside Service",
    nameTh: "LMG บริการข้างทาง",
    phone: "1790",
    desc: "24h towing up to 35km (press 1)",
    descTh: "24 ชม. ลากจูง 35 กม. (กด 1)",
  },
  {
    name: "Thai PAT Insurance",
    nameTh: "ไทยพัฒน์ประกันภัย",
    phone: "+66 2 305 8799",
    desc: "24h towing, battery, tire, fuel delivery",
    descTh: "24 ชม. ลากจูง แบตเตอรี่ ยาง ส่งน้ำมัน",
  },
];

export interface TowingService {
  id: string;
  name: string;
  nameTh: string;
  phone: string;
  desc: string;
  descTh: string;
}

export async function isNearHighway(lat: number, lon: number): Promise<boolean> {
  const radius = 500; // 500m
  const query = `[out:json];(way["highway"="motorway"](around:${radius},${lat},${lon});way["highway"="trunk"](around:${radius},${lat},${lon});way["highway"="primary"](around:${radius},${lat},${lon}););out body;`;
  try {
    const res = await fetch(OVERPASS_URL, { method: "POST", body: query });
    const data = await res.json();
    return (data.elements?.length ?? 0) > 0;
  } catch {
    return false;
  }
}

export async function getTowingServices(lat?: number, lon?: number): Promise<TowingService[]> {
  let list = TOWING_SERVICES;
  if (lat != null && lon != null) {
    const onHighway = await isNearHighway(lat, lon);
    if (!onHighway) {
      list = list.filter((s) => !s.highwayOnly);
    }
  } else {
    list = list.filter((s) => !s.highwayOnly);
  }
  return list.slice(0, 3).map((s, i) => ({
    id: `towing-${i}`,
    name: s.name,
    nameTh: s.nameTh,
    phone: s.phone,
    desc: s.desc,
    descTh: s.descTh,
  }));
}

export function getFacilityTypeForSituation(situation: string): "hospital" | "police" | "consulate" | "towing" {
  switch (situation) {
    case "medical":
      return "hospital";
    case "lost_passport":
      return "consulate";
    case "breakdown":
      return "towing";
    default:
      return "police"; // assistance, other
  }
}
