import LogoGrid from "@/features/home/components/LogoGrid";
import { clients } from "@/features/home/data/clients";

export default function Clients() {
  return (
    <LogoGrid
      theme="light"
      heading="You're in good hands."
      subheading="Growthpad is trusted by industry leaders"
      items={clients.map((client) => ({
        name: client.name,
        src: `/assets/images/clients/${client.logo}`,
      }))}
    />
  );
}
