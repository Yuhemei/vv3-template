interface SystemConfigResponse {
  data: SystemConfigData;
  msg: string;
}

interface SystemConfigData {
  copyright: string;
  created_at: string;
  deleted_at: null;
  icon: string;
  id: number;
  logo: string;
  name: string;
  sLogo: string;
  status: number;
  updated_at: string;
}
