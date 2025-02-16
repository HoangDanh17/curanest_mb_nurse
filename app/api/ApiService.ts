export interface District {
  id: string;
  name: string;
  wards: string[];
  code: string;
}

interface Ward {
  id: string;
  name: string;
  code: string;
}

class ApiService {
  private static instance: ApiService;
  private hcmCode: string = "79"; // Mã TP.HCM

  private constructor() {}

  static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  private sortDistricts(districts: District[]): District[] {
    return districts.sort((a, b) => {
      const getDistrictNumber = (name: string): number => {
        const match = name.match(/(\d+)/);
        return match ? parseInt(match[0]) : Infinity;
      };

      const isDistrict = (name: string): boolean => name.toLowerCase().includes('quận');
      const aIsDistrict = isDistrict(a.name);
      const bIsDistrict = isDistrict(b.name);

      if (aIsDistrict && !bIsDistrict) return -1;
      if (!aIsDistrict && bIsDistrict) return 1;

      if (aIsDistrict && bIsDistrict) {
        return getDistrictNumber(a.name) - getDistrictNumber(b.name);
      }

      return a.name.localeCompare(b.name);
    });
  }

  private sortWards(wards: string[]): string[] {
    return wards.sort((a, b) => {
      const getWardNumber = (name: string): number => {
        const match = name.match(/(\d+)/);
        return match ? parseInt(match[0]) : Infinity;
      };

      const isWard = (name: string): boolean => name.toLowerCase().includes('phường');
      const aIsWard = isWard(a);
      const bIsWard = isWard(b);

      if (aIsWard && !bIsWard) return -1;
      if (!aIsWard && bIsWard) return 1;

      if (aIsWard && bIsWard) {
        return getWardNumber(a) - getWardNumber(b);
      }

      return a.localeCompare(b);
    });
  }

  async fetchDistricts(): Promise<District[]> {
    try {
      const response = await fetch(`https://provinces.open-api.vn/api/p/${this.hcmCode}?depth=2`);
      if (!response.ok) {
        throw new Error("Failed to fetch districts");
      }
      
      const data = await response.json();
      
      const formattedDistricts = data.districts.map((district: any) => ({
        id: district.code,
        name: district.name,
        code: district.code,
        wards: this.sortWards(district.wards.map((ward: any) => ward.name))
      }));
      return this.sortDistricts(formattedDistricts);
    } catch (error) {
      console.error("Error fetching districts:", error);
      throw error;
    }
  }

  async fetchWardsByDistrict(districtCode: string): Promise<string[]> {
    try {
      const response = await fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
      if (!response.ok) {
        throw new Error("Failed to fetch wards");
      }
      
      const data = await response.json();
      return this.sortWards(data.wards.map((ward: any) => ward.name));
    } catch (error) {
      console.error("Error fetching wards:", error);
      throw error;
    }
  }
}

export default ApiService;