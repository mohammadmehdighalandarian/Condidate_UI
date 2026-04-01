
export const environment = {
  production: true,
  baseUrl: (window as { [key: string]: any })["env"]["apiUrl"] || "https://localhost:7101/api/",
  logoutUrl:  (window as { [key: string]: any })["env"]["logoutUrl"]  || "https://ssokeshvar.moi.ir/logout",
  apiVersion: (window as { [key: string]: any })["env"]["apiVersion"] || "v1",
  bypassLoginForDevelopment: false,
  partyList: {
    electionType: Number((window as { [key: string]: any })['env']['electionType']) || 2
  },


};
