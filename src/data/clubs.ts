export type Club = {
    name: string;
    slug: string;
    logo: string;
    color: string;
  };
  
  export const clubs: Record<string, Club> = {
  "cf-godella": {
    name: "CF Godella",
    slug: "cf-godella",
    logo: "/assets/logos/godella.png",
    color: "#dc2626",
  },
  "el-rumbo": {
    name: "El Rumbo",
    slug: "el-rumbo",
    logo: "/assets/logos/el-rumbo.png",
    color: "#ea580c",
  },
};
  