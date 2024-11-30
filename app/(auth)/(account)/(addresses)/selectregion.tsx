import { Dimensions, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { ThemedView } from '@/components/ThemedView'
import { router, useLocalSearchParams } from 'expo-router'

// Load JSON data
import regions from '@/assets/data/region.json';
import provinces from '@/assets/data/province.json';
import cities from '@/assets/data/city.json';
import barangays from '@/assets/data/barangay.json';

interface Province {
  province_code: string;
  province_name: string;
  psgc_code: string;
  region_code: string;
}

interface City {
  city_code: string;
  city_name: string;
  province_code: string;
  psgc_code: string;
}

interface Barangay {
  brgy_code: string;
  brgy_name: string;
  city_code: string;
  province_code: string;
  region_code: string;
}

const { width, height } = Dimensions.get('screen')

export default function SelectRegion() {
  const { routeBack } = useLocalSearchParams<{routeBack: string}>()
  const [selectedRegion, setSelectedRegion] = useState<typeof regions[0] | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [selectedBarangay, setSelectedBarangay] = useState<Barangay | null>(null);

  const [filteredProvinces, setFilteredProvinces] = useState<Province[]>([]);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [filteredBarangays, setFilteredBarangays] = useState<Barangay[]>([]);

  // Filter provinces based on selected region
  useEffect(() => {
    if (selectedRegion) {
      const filtered = provinces.filter(
        (province) => province.region_code === selectedRegion.region_code
      );
      setFilteredProvinces(filtered);
      setSelectedProvince(null);
      setSelectedCity(null);
      setSelectedBarangay(null);
      setFilteredCities([]);
      setFilteredBarangays([]);
    }
  }, [selectedRegion]);

  // Filter cities based on selected province
  useEffect(() => {
    if (selectedProvince) {
      const filtered = cities.filter(
        (city) => city.province_code === selectedProvince.province_code
      );
      setFilteredCities(filtered);
      setSelectedCity(null);
      setSelectedBarangay(null);
      setFilteredBarangays([]);
    }
  }, [selectedProvince]);

  // Filter barangays based on selected city
  useEffect(() => {
    if (selectedCity) {
      const filtered = barangays.filter(
        (barangay: Barangay) => barangay.city_code === selectedCity.city_code
      );
      setFilteredBarangays(filtered);
      setSelectedBarangay(null);
    }
  }, [selectedCity])

  useEffect(() => {
    if (
        selectedRegion && 
        selectedProvince && 
        selectedCity && 
        selectedBarangay
    ) { 
        const newRpcb = `${selectedRegion.region_name} ${selectedProvince.province_name} ${selectedCity.city_name} ${selectedBarangay.brgy_name}`;

        if (routeBack === 'addnewaddress') {
            router.replace(`/(account)/(addresses)/addnewaddress?newRpcb=${newRpcb}`)
        } else {
            router.replace(`/(account)/(addresses)/editaddress?newRpcb=${newRpcb}`)
        }
        
    }
  },[routeBack, selectedBarangay, selectedCity, selectedProvince, selectedRegion])

  return (
    <ThemedView style={styles.container}>
      {/* Region Picker */}
      <Picker
        selectedValue={selectedRegion}
        onValueChange={(value) => setSelectedRegion(value)}
      >
        <Picker.Item label="Select Region" value={null} />
        {regions.map((region) => (
          <Picker.Item key={region.region_code} label={region.region_name} value={region} />
        ))}
      </Picker>

      {/* Province Picker */}
      <Picker
        selectedValue={selectedProvince}
        onValueChange={(value) => setSelectedProvince(value)}
        enabled={!!selectedRegion}
      >
        <Picker.Item label="Select Province" value={null} />
        {filteredProvinces.map((province) => (
          <Picker.Item
            key={province.province_code}
            label={province.province_name}
            value={province}
          />
        ))}
      </Picker>

      {/* City Picker */}
      <Picker
        selectedValue={selectedCity}
        onValueChange={(value) => setSelectedCity(value)}
        enabled={!!selectedProvince}
      >
        <Picker.Item label="Select City" value={null} />
        {filteredCities.map((city) => (
          <Picker.Item key={city.city_code} label={city.city_name} value={city} />
        ))}
      </Picker>

      {/* Barangay Picker */}
      <Picker
        selectedValue={selectedBarangay}
        onValueChange={(value) => setSelectedBarangay(value)}
        enabled={!!selectedCity}
      >
        <Picker.Item label="Select Barangay" value={null} />
        {filteredBarangays.map((barangay) => (
          <Picker.Item key={barangay.brgy_code} label={barangay.brgy_name} value={barangay} />
        ))}
      </Picker>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: height,
    width: width
  },
})