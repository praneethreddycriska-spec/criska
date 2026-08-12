import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/sections/footer";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "Industry Sectors & Solutions — Criska Consulting",
  description:
    "Tailored enterprise technology solutions across BFSI, Healthcare, Manufacturing, Energy, Retail, High-Tech, Telecom, and Public Sector.",
};

const SECTORS = [
  {
    title: "Banking, Financial Services & Insurance (BFSI)",
    tag: "Finance Tech",
    icon: "🏦",
    description:
      "Enterprise fintech solutions, automated regulatory compliance, fraud detection AI models, secure open banking APIs, and high-frequency trading infrastructure.",
    keyCapabilities: [
      "AI Fraud & Anomaly Detection",
      "SOC 2 & PCI DSS Compliance",
      "Core Banking Modernization",
      "Real-time Payment Gateways",
    ],
    techStack: "Python · PostgreSQL · AWS · Kafka · Microservices",
  },
  {
    title: "Healthcare, MedTech & Life Sciences",
    tag: "Health Tech",
    icon: "🩺",
    description:
      "HIPAA-compliant patient portals, AI medical image diagnostics, EHR system integration, telemedicine platforms, and genomic data processing pipelines.",
    keyCapabilities: [
      "HIPAA & GDPR Compliant Cloud",
      "AI Clinical Decision Support",
      "EHR Interoperability (FHIR/HL7)",
      "Remote Patient Monitoring",
    ],
    techStack: "Next.js · FHIR APIs · PyTorch · AWS HealthLake · Docker",
  },
  {
    title: "Manufacturing, Automotive & Industrial IoT",
    tag: "Industry 4.0",
    icon: "🏭",
    description:
      "Smart factory automation, IoT edge sensor networks, predictive equipment maintenance models, supply chain visibility, and digital twin technology.",
    keyCapabilities: [
      "Predictive Maintenance AI",
      "Industrial IoT Edge Hubs",
      "Supply Chain Traceability",
      "MES System Integration",
    ],
    techStack: "MQTT · Azure IoT Hub · TimescaleDB · Python · Kubernetes",
  },
  {
    title: "Energy, Utilities & Smart Infrastructure",
    tag: "Clean Energy",
    icon: "⚡",
    description:
      "Smart grid analytics, renewable energy generation forecasting, asset management systems, and SCADA infrastructure cybersecurity monitoring.",
    keyCapabilities: [
      "Smart Grid Telemetry",
      "Renewable Output Analytics",
      "Critical Asset Monitoring",
      "SCADA Security Audits",
    ],
    techStack: "Go · TimescaleDB · React · Grafana · Terraform",
  },
  {
    title: "Retail, E-Commerce & Consumer Goods",
    tag: "Retail Tech",
    icon: "🛍️",
    description:
      "Omnichannel e-commerce platforms, personalized AI recommendation engines, dynamic pricing algorithms, and automated inventory sync.",
    keyCapabilities: [
      "Headless E-Commerce Build",
      "AI Recommendation Models",
      "Real-time Inventory Sync",
      "Omnichannel Loyalty Engine",
    ],
    techStack: "Next.js · GraphQL · Stripe · Redis · Supabase",
  },
  {
    title: "High-Tech, SaaS & AI Enterprises",
    tag: "Software Tech",
    icon: "🚀",
    description:
      "End-to-end multi-tenant SaaS architecture, Generative AI agent pipelines, custom vector search indexers, and global cloud infrastructure scaling.",
    keyCapabilities: [
      "Multi-Tenant SaaS Engine",
      "GenAI Agent Pipelines (RAG)",
      "CI/CD Release Automation",
      "Zero-Trust Cloud Security",
    ],
    techStack: "Next.js · LangChain · Vector DBs · AWS/GCP · Kubernetes",
  },
  {
    title: "Telecom, Media & Logistics",
    tag: "Communications",
    icon: "📡",
    description:
      "High-throughput network monitoring, media streaming optimization, fleet logistics routing algorithms, and automated customer dispatch systems.",
    keyCapabilities: [
      "Route Optimization Algorithms",
      "Fleet Telemetry Dashboard",
      "Low-Latency Video Streaming",
      "High-Volume CDR Analytics",
    ],
    techStack: "Node.js · WebSockets · Redis · Kafka · Elasticsearch",
  },
  {
    title: "Government, Education & Public Sector",
    tag: "Gov Tech",
    icon: "🏛️",
    description:
      "Accessible e-governance portals, secure digital identity verification systems, public cloud migration, and university learning management platforms.",
    keyCapabilities: [
      "WCAG 2.2 AA Accessible UI",
      "National ID / e-KYC Verification",
      "Sovereign Cloud Deployments",
      "Citizen Service Dashboards",
    ],
    techStack: "React · Node.js · PostgreSQL · Docker · ISO 27001",
  },
];

export default function IndustriesPage() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <PageHeader
          eyebrow="Industry Sectors & Expertise"
          title="Transforming Key Industry Sectors with Purpose-Built Technology"
          lead="Deep domain knowledge combined with cutting-edge AI, cloud, cybersecurity, and full-stack engineering across global industry verticals."
        />

        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-[1200px] px-6 md:px-10">
            {/* Grid of detailed sector cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
              {SECTORS.map((sector) => (
                <article
                  key={sector.title}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-surface p-8 transition-all duration-300 hover:border-accent/40 hover:shadow-[0_24px_60px_-20px_rgba(0,0,0,0.35)]"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="grid h-12 w-12 place-items-center rounded-xl bg-panel text-[24px]">
                        {sector.icon}
                      </span>
                      <span className="rounded-full border border-accent/30 bg-accent-soft px-3 py-1 text-[12px] font-semibold text-accent">
                        {sector.tag}
                      </span>
                    </div>

                    <h2 className="font-display mt-6 text-[24px] font-semibold leading-tight text-foreground">
                      {sector.title}
                    </h2>

                    <p className="mt-3 text-[15px] leading-relaxed text-muted font-normal">
                      {sector.description}
                    </p>

                    <div className="mt-6 border-t border-border pt-5">
                      <span className="text-[11.5px] font-semibold uppercase tracking-[0.12em] text-faint">
                        Core Sector Capabilities:
                      </span>
                      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {sector.keyCapabilities.map((cap) => (
                          <div key={cap} className="flex items-center gap-2 text-[13.5px] text-foreground font-medium">
                            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                            {cap}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 border-t border-border pt-4 text-[12.5px] text-muted">
                    <span className="font-semibold text-faint uppercase tracking-wider">Tech Stack:</span>{" "}
                    {sector.techStack}
                  </div>
                </article>
              ))}
            </div>

            {/* CTA Banner */}
            <div className="mt-14 rounded-2xl border border-border bg-gradient-to-r from-panel via-surface to-panel p-10 text-center shadow-xl">
              <h2 className="font-display text-[30px] font-semibold leading-tight">
                Operating in Your Sector?
              </h2>
              <p className="mx-auto mt-2 max-w-lg text-[15.5px] text-muted">
                Our domain specialists and solution architects are ready to help customize the right enterprise architecture for your business.
              </p>
              <a href="/contact" className="btn-pill btn-primary mt-6 inline-flex items-center gap-2">
                Schedule Sector Consultation →
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
