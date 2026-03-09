import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useLanguage } from '../contexts/LanguageContext';
import { Header } from '../components/Header';
import { BottomNav } from '../components/BottomNav';
import { HelpModal } from '../components/HelpModal';
import {
  fetchNearbyHospitals,
  fetchNearbyPharmacies,
  fetchNearbyPolice,
  findNearestConsulate,
  getFacilityTypeForSituation,
  getTowingServices,
  type NearbyPlace,
} from '../../../utils/nearbyPlaces';
import { MapPin, Copy, CheckCircle, Building2, Phone, Navigation, Pill } from 'lucide-react';

export default function NoEmergencyLocation() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [showHelp, setShowHelp] = useState(false);
  const [copied, setCopied] = useState(false);
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);
  const [nearbyPlaces, setNearbyPlaces] = useState<NearbyPlace[]>([]);
  const [nearbyPharmacies, setNearbyPharmacies] = useState<NearbyPlace[]>([]);
  const [nearbyConsulate, setNearbyConsulate] = useState<NearbyPlace | null>(null);
  const [towingServices, setTowingServices] = useState<ReturnType<typeof getTowingServices>>([]);
  const [nearbyLoading, setNearbyLoading] = useState(false);

  const getLocationData = () => {
    const base = {
      street: '',
      district: '',
      province: '',
      latitude: coords?.latitude,
      longitude: coords?.longitude,
      coordinates: coords
        ? `${coords.latitude.toFixed(4)}° N, ${coords.longitude.toFixed(4)}° E`
        : '',
    };
    if (coords) {
      base.street = `${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`;
      base.district = '';
      base.province = 'Thailand';
    }
    return base;
  };

  const handleCopyLocation = () => {
    const loc = getLocationData();
    const locationText = loc.coordinates
      ? `GPS: ${loc.coordinates}\n${loc.street || ''} ${loc.district || ''} ${loc.province || ''}`.trim()
      : loc.street || 'Location not available';
    navigator.clipboard.writeText(locationText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleContinue = () => {
    localStorage.setItem('noEmergencyLocation', JSON.stringify(getLocationData()));
    navigate('/no-emergency-summary');
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatus(
        language === 'en'
          ? 'Location not supported on this device'
          : 'อุปกรณ์นี้ไม่รองรับการระบุตำแหน่ง',
      );
      return;
    }

    setLocationStatus(
      language === 'en'
        ? 'Detecting your location...'
        : 'กำลังตรวจหาตำแหน่งของคุณ...',
    );

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ latitude, longitude });
        setLocationStatus(null);
      },
      () => {
        setLocationStatus(
          language === 'en'
            ? 'Location access denied'
            : 'ไม่สามารถเข้าถึงตำแหน่งได้',
        );
      },
    );
  }, [language]);

  // Fetch nearest facility based on situation
  useEffect(() => {
    const situation = localStorage.getItem('noEmergencySituation') || 'medical';
    const facilityType = getFacilityTypeForSituation(situation);

    if (facilityType === 'towing') {
      setNearbyLoading(true);
      setNearbyPlaces([]);
      setNearbyPharmacies([]);
      setNearbyConsulate(null);
      getTowingServices(coords?.latitude, coords?.longitude)
        .then(setTowingServices)
        .catch(() => setTowingServices([]))
        .finally(() => setNearbyLoading(false));
      return;
    }

    if (!coords) return;
    setNearbyLoading(true);
    setNearbyPlaces([]);
    setNearbyPharmacies([]);
    setNearbyConsulate(null);
    setTowingServices([]);

    const run = async () => {
      try {
        if (facilityType === 'consulate') {
          const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');
          const consulate = findNearestConsulate(
            coords!.latitude,
            coords!.longitude,
            profile.nationality
          );
          setNearbyConsulate(consulate);
        } else if (facilityType === 'hospital') {
          const [hospitals, pharmacies] = await Promise.all([
            fetchNearbyHospitals(coords!.latitude, coords!.longitude),
            fetchNearbyPharmacies(coords!.latitude, coords!.longitude),
          ]);
          setNearbyPlaces(hospitals);
          setNearbyPharmacies(pharmacies);
        } else {
          const places = await fetchNearbyPolice(coords!.latitude, coords!.longitude);
          setNearbyPlaces(places);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setNearbyLoading(false);
      }
    };
    run();
  }, [coords]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[var(--background)] flex flex-col pb-24">
      <Header 
        title={language === 'en' ? 'Location' : 'ตำแหน่ง'} 
      />
      
      <div className="flex-1 px-6 py-6 flex flex-col">
        {/* Info */}
        <p className="text-gray-600 dark:text-[var(--muted-foreground)] text-sm text-center mb-6">
          {language === 'en' 
            ? 'Your location will be included in the message' 
            : 'ตำแหน่งของคุณจะรวมอยู่ในข้อความ'}
        </p>

        {/* Map View */}
        <div className="bg-white dark:bg-[var(--card)] border-2 border-gray-200 dark:border-[var(--border)] rounded-2xl p-6 mb-6 shadow-sm">
          <div className="bg-gray-100 dark:bg-[var(--secondary)] rounded-xl h-48 mb-5 overflow-hidden flex items-center justify-center">
            {coords ? (
              <iframe
                title={language === 'en' ? 'Map View' : 'มุมมองแผนที่'}
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${coords.longitude - 0.01},${coords.latitude - 0.01},${coords.longitude + 0.01},${coords.latitude + 0.01}&marker=${coords.latitude},${coords.longitude}&layer=mapnik`}
                className="w-full h-full border-0"
                loading="lazy"
              />
            ) : (
              <div className="text-center px-4">
                <MapPin className="w-12 h-12 text-gray-400 dark:text-[var(--muted-foreground)] mx-auto mb-2" />
                <p className="text-sm text-gray-500 dark:text-[var(--muted-foreground)]">
                  {locationStatus ||
                    (language === 'en'
                      ? 'Allow location access to see the map'
                      : 'อนุญาตการเข้าถึงตำแหน่งเพื่อดูแผนที่')}
                </p>
              </div>
            )}
          </div>

          {/* Location Details */}
          <div className="space-y-3">
            {coords && (
              <>
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-[var(--muted-foreground)] mb-1">
                    {language === 'en' ? 'GPS Coordinates' : 'พิกัด GPS'}
                  </p>
                  <p className="text-sm font-mono text-gray-700 dark:text-[var(--muted-foreground)]">
                    {getLocationData().coordinates}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-[var(--muted-foreground)] mb-1">
                    {language === 'en' ? 'Latitude / Longitude' : 'ละติจูด / ลองจิจูด'}
                  </p>
                  <p className="text-sm font-mono text-gray-700 dark:text-[var(--muted-foreground)]">
                    {coords.latitude.toFixed(6)}, {coords.longitude.toFixed(6)}
                  </p>
                </div>
              </>
            )}
            {!coords && locationStatus && (
              <p className="text-sm text-gray-500 dark:text-[var(--muted-foreground)]">{locationStatus}</p>
            )}
          </div>
        </div>

        {/* Nearest pharmacies (for mild symptoms) – medical only */}
        {(() => {
          const situation = localStorage.getItem('noEmergencySituation') || 'medical';
          const type = getFacilityTypeForSituation(situation);
          if (type !== 'hospital' || nearbyPharmacies.length === 0) return null;
          return (
            <div className="bg-white dark:bg-[var(--card)] border-2 border-gray-200 dark:border-[var(--border)] rounded-2xl p-6 mb-6 shadow-sm">
              <h3 className="text-base font-semibold text-gray-900 dark:text-[var(--foreground)] mb-1 flex items-center gap-2">
                <Pill className="w-5 h-5" />
                {language === 'en' ? 'Nearest Pharmacies' : 'ร้านขายยาที่ใกล้ที่สุด'}
              </h3>
              <p className="text-sm text-gray-600 dark:text-[var(--muted-foreground)] mb-4">
                {language === 'en' ? 'For mild symptoms – try pharmacy first' : 'สำหรับอาการเล็กน้อย – ลองร้านขายยาก่อน'}
              </p>
              <div className="space-y-3">
                {nearbyPharmacies.map((place) => (
                  <div key={place.id} className="bg-gray-50 dark:bg-[var(--secondary)] rounded-xl p-4">
                    <p className="font-semibold text-gray-900 dark:text-[var(--foreground)]">{place.name}</p>
                    {place.address && (
                      <p className="text-sm text-gray-600 dark:text-[var(--muted-foreground)] mt-1">{place.address}</p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-[var(--muted-foreground)] mt-1">
                      {language === 'en' ? 'Distance' : 'ระยะทาง'}: ~{(place.distance / 1000).toFixed(1)} km
                    </p>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lon}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 flex items-center justify-center gap-2 bg-gray-900 dark:bg-[var(--secondary)] text-white dark:text-[var(--foreground)] py-2 rounded-lg text-sm font-medium w-full"
                    >
                      <Navigation className="w-4 h-4" />
                      {language === 'en' ? 'Directions' : 'นำทาง'}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Nearest facility (hospital, police, consulate, towing) */}
        {(coords || towingServices.length > 0) && (
          <div className="bg-white dark:bg-[var(--card)] border-2 border-gray-200 dark:border-[var(--border)] rounded-2xl p-6 mb-6 shadow-sm">
            <h3 className="text-base font-semibold text-gray-900 dark:text-[var(--foreground)] mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              {(() => {
                const situation = localStorage.getItem('noEmergencySituation') || 'medical';
                const type = getFacilityTypeForSituation(situation);
                if (type === 'hospital') return language === 'en' ? 'Nearest Hospitals' : 'โรงพยาบาลใกล้ที่สุด';
                if (type === 'consulate') return language === 'en' ? 'Nearest Consulate' : 'สถานกงสุลใกล้ที่สุด';
                if (type === 'towing') return language === 'en' ? 'Towing & Roadside Assistance' : 'บริการลากจูงและช่วยเหลือข้างทาง';
                return language === 'en' ? 'Nearest Police Stations' : 'สถานีตำรวจใกล้ที่สุด';
              })()}
            </h3>
            {towingServices.length > 0 ? (
              <div className="space-y-3">
                {towingServices.map((s) => (
                  <div key={s.id} className="bg-gray-50 dark:bg-[var(--secondary)] rounded-xl p-4">
                    <p className="font-semibold text-gray-900 dark:text-[var(--foreground)]">
                      {language === 'en' ? s.name : s.nameTh}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-[var(--muted-foreground)] mt-1">
                      {language === 'en' ? s.desc : s.descTh}
                    </p>
                    <a
                      href={`tel:${s.phone.replace(/\s/g, '').replace(/-/g, '')}`}
                      className="mt-3 flex items-center justify-center gap-2 bg-gray-900 dark:bg-[var(--secondary)] text-white dark:text-[var(--foreground)] py-3 rounded-lg text-sm font-medium w-full hover:bg-gray-800 dark:hover:bg-[var(--accent)]"
                    >
                      <Phone className="w-4 h-4" />
                      {language === 'en' ? 'Call' : 'โทร'} {s.phone}
                    </a>
                  </div>
                ))}
              </div>
            ) : nearbyLoading ? (
              <p className="text-sm text-gray-500 dark:text-[var(--muted-foreground)]">{language === 'en' ? 'Searching...' : 'กำลังค้นหา...'}</p>
            ) : nearbyConsulate ? (
              <div className="space-y-3">
                {'needsNationality' in nearbyConsulate && nearbyConsulate.needsNationality && (
                  <p className="text-sm text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/30 p-3 rounded-lg">
                    {language === 'en'
                      ? 'Add your nationality in profile for your consulate.'
                      : 'เพิ่มสัญชาติในโปรไฟล์เพื่อดูสถานกงสุลของคุณ'}
                  </p>
                )}
                <div className="bg-gray-50 dark:bg-[var(--secondary)] rounded-xl p-4">
                  <p className="font-semibold text-gray-900 dark:text-[var(--foreground)]">{nearbyConsulate.name}</p>
                  {nearbyConsulate.address && (
                    <p className="text-sm text-gray-600 dark:text-[var(--muted-foreground)] mt-1">{nearbyConsulate.address}</p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-[var(--muted-foreground)] mt-1">
                    {language === 'en' ? 'Distance' : 'ระยะทาง'}: ~{(nearbyConsulate.distance / 1000).toFixed(1)} km
                  </p>
                  <div className="flex gap-2 mt-3">
                    {nearbyConsulate.phone && (
                      <a
                        href={`tel:${nearbyConsulate.phone.replace(/\s/g, '')}`}
                        className="flex-1 flex items-center justify-center gap-2 bg-gray-900 dark:bg-[var(--secondary)] text-white dark:text-[var(--foreground)] py-2 rounded-lg text-sm font-medium"
                      >
                        <Phone className="w-4 h-4" />
                        {language === 'en' ? 'Call' : 'โทร'}
                      </a>
                    )}
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${nearbyConsulate.lat},${nearbyConsulate.lon}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 bg-white dark:bg-[var(--card)] border border-gray-300 dark:border-[var(--border)] text-gray-900 dark:text-[var(--foreground)] py-2 rounded-lg text-sm font-medium"
                    >
                      <Navigation className="w-4 h-4" />
                      {language === 'en' ? 'Directions' : 'นำทาง'}
                    </a>
                  </div>
                </div>
              </div>
            ) : nearbyPlaces.length > 0 ? (
              <div className="space-y-3">
                {nearbyPlaces.map((place) => (
                  <div key={place.id} className="bg-gray-50 dark:bg-[var(--secondary)] rounded-xl p-4">
                    <p className="font-semibold text-gray-900 dark:text-[var(--foreground)]">{place.name}</p>
                    {place.address && (
                      <p className="text-sm text-gray-600 dark:text-[var(--muted-foreground)] mt-1">{place.address}</p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-[var(--muted-foreground)] mt-1">
                      {language === 'en' ? 'Distance' : 'ระยะทาง'}: ~{(place.distance / 1000).toFixed(1)} km
                    </p>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lon}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 flex items-center justify-center gap-2 bg-gray-900 dark:bg-[var(--secondary)] text-white dark:text-[var(--foreground)] py-2 rounded-lg text-sm font-medium w-full"
                    >
                      <Navigation className="w-4 h-4" />
                      {language === 'en' ? 'Directions' : 'นำทาง'}
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-[var(--muted-foreground)]">
                {language === 'en'
                  ? 'No nearby facilities found. Try expanding the search area.'
                  : 'ไม่พบสถานที่ใกล้เคียง ลองขยายพื้นที่ค้นหา'}
              </p>
            )}
          </div>
        )}

        {/* Copy Location Button */}
        <button
          onClick={handleCopyLocation}
          className="w-full bg-white dark:bg-[var(--card)] rounded-2xl p-6 shadow-sm border-2 border-gray-200 dark:border-[var(--border)] hover:border-gray-400 dark:hover:border-[var(--muted-foreground)] active:scale-[0.99] transition-all text-gray-900 dark:text-[var(--foreground)] font-medium flex items-center justify-center gap-2 mb-6"
        >
          {copied ? (
            <>
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="text-green-600 dark:text-green-400">
                {language === 'en' ? 'Copied!' : 'คัดลอกแล้ว!'}
              </span>
            </>
          ) : (
            <>
              <Copy className="w-5 h-5" />
              {language === 'en' ? 'Copy Location' : 'คัดลอกตำแหน่ง'}
            </>
          )}
        </button>

        <div className="flex-1"></div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          className="w-full bg-white dark:bg-[var(--card)] rounded-2xl p-6 shadow-sm border-2 border-gray-900 dark:border-[var(--foreground)] hover:border-gray-700 dark:hover:border-[var(--muted-foreground)] active:scale-[0.99] transition-all text-gray-900 dark:text-[var(--foreground)] font-semibold"
        >
          {language === 'en' ? 'Continue' : 'ดำเนินการต่อ'}
        </button>
      </div>
      
      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
      <BottomNav onHelpClick={() => setShowHelp(true)} />
    </div>
  );
}
