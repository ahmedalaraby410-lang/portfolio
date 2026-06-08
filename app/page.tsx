import { ExperientialHome } from "@/components/experiential-home";
import { GsapEffects } from "@/components/gsap-effects";
import { SiteNav } from "@/components/site-nav";
import { getCertificates } from "@/lib/certificates";
import { getClients } from "@/lib/clients";
import { getProfile } from "@/lib/profile";
import { getProjects } from "@/lib/projects";
import { getSocials } from "@/lib/socials";

export default async function Home() {
  const [projects, clients, profile, certificates, socials] = await Promise.all([
    getProjects(),
    getClients(),
    getProfile(),
    getCertificates(),
    getSocials()
  ]);

  return (
    <>
      <SiteNav />
      <GsapEffects />
      <ExperientialHome projects={projects} clients={clients} profile={profile} certificates={certificates} socials={socials} />
    </>
  );
}
