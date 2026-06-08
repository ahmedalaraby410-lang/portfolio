import { AdminPanel } from "@/components/admin-panel";
import { CertificateAdminPanel } from "@/components/certificate-admin-panel";
import { ClientAdminPanel } from "@/components/client-admin-panel";
import { ProfileAdminPanel } from "@/components/profile-admin-panel";
import { SocialAdminPanel } from "@/components/social-admin-panel";
import { SiteNav } from "@/components/site-nav";
import { getCertificates } from "@/lib/certificates";
import { getClients } from "@/lib/clients";
import { getProfile } from "@/lib/profile";
import { getProjects } from "@/lib/projects";
import { getSocials } from "@/lib/socials";

export const metadata = {
  title: "Admin"
};

export default async function AdminPage() {
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
      <main className="container-x min-h-screen pb-20 pt-32">
        <div className="mb-10 max-w-4xl">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-lime">Portfolio Manager</p>
          <h1 className="text-5xl font-semibold leading-[0.92] tracking-[-0.05em] sm:text-7xl">
            Manage projects, identity, clients, and credentials without touching code.
          </h1>
          <p className="mt-6 max-w-2xl leading-7 text-paper/58">
            Publish case studies, upload brand assets, control visibility, and reorder the portfolio from one place.
          </p>
        </div>
        <ProfileAdminPanel initialProfile={profile} />
        <SocialAdminPanel initialSocials={socials} />
        <AdminPanel initialProjects={projects} />
        <ClientAdminPanel initialClients={clients} />
        <CertificateAdminPanel initialCertificates={certificates} />
      </main>
    </>
  );
}
