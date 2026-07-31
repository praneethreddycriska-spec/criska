/**
 * CRISKA — Site content (single source of truth).
 * Phase 2: the admin panel + database will read/write this shape,
 * so keep it serializable (no functions/JSX).
 */

export type Stat = { value: string; label: string };
export type ServiceGroup = { label: string; items: string[] };
export type Service = {
  icon: string;
  title: string;
  desc: string;
  includes: string[];
  extra?: ServiceGroup; // platforms / technologies / benefits / compliance
};
export type Value = { title: string; desc: string };
export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  body: string[];
};
export type BlogCategory = { title: string; desc: string };
export type NavLink = { label: string; href: string };

export const site = {
  brand: {
    name: "Criska",
    legalName: "Criska Business Consulting Pvt. Ltd.",
    tagline: "Building Intelligent Futures",
    est: "2014",
    location: "Hyderabad, India",
    markets: "India · UK · US",
  },

  nav: {
    links: [
      { label: "Services", href: "/#services" },
      { label: "Industries", href: "/#industries" },
      { label: "Why Criska", href: "/#why" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
    ],
    cta: { label: "Schedule Consultation", href: "/contact" },
  },

  hero: {
    eyebrow: "Technology · Talent · Innovation",
    titleLead: "Accelerating business growth through",
    titleAccent: "technology & innovation.",
    subtitle:
      "Criska Business Consulting helps organizations transform their operations through Artificial Intelligence, Cloud, Cybersecurity, Digital Engineering, IT Infrastructure, and Business Consulting — delivering solutions that improve efficiency, reduce costs, and create sustainable competitive advantage.",
    primaryCta: { label: "Schedule Consultation", href: "/contact" },
    secondaryCta: { label: "Explore Services", href: "/#services" },
    stats: [
      { value: "2014", label: "Established" },
      { value: "15+", label: "Service Lines" },
      { value: "12", label: "Industries Served" },
      { value: "3", label: "Markets — IN · UK · US" },
    ] as Stat[],
  },

  about: {
    eyebrow: "About Criska",
    title: "A technology & business solutions partner built for what's next",
    body: [
      "We are a technology consulting and business solutions company committed to helping organizations achieve operational excellence through strategic consulting, digital transformation, workforce solutions, and emerging technologies.",
      "From startups to enterprises, we deliver innovative solutions that improve efficiency, reduce costs, and create sustainable competitive advantages — combining skilled talent, secure delivery, and practical AI adoption.",
    ],
  },

  services: {
    eyebrow: "Our Services",
    title: "End-to-end technology & consulting services",
    lead: "Fifteen service lines spanning AI, cloud, security, engineering, data, and talent — delivered through flexible, outcome-focused engagement models.",
    items: [
      {
        icon: "ai",
        title: "Artificial Intelligence & Generative AI",
        desc: "AI-powered solutions that improve efficiency, automate processes, and enhance customer experiences.",
        includes: [
          "Generative AI Solutions",
          "AI Strategy & Consulting",
          "LLM Integration",
          "AI Chatbot Development",
          "Conversational AI Platforms",
          "Predictive Analytics",
          "Intelligent Document Processing",
          "Machine Learning Solutions",
          "Computer Vision",
          "Natural Language Processing",
          "AI Automation",
          "AI Governance & Compliance",
        ],
        extra: {
          label: "Business Benefits",
          items: [
            "Faster Decision-Making",
            "Reduced Operational Costs",
            "Improved Customer Experience",
            "Increased Productivity",
            "Data-Driven Insights",
          ],
        },
      },
      {
        icon: "cloud",
        title: "Cloud Infrastructure Services",
        desc: "Scalable, secure, and resilient cloud environments that support growth and digital transformation.",
        includes: [
          "Cloud Strategy & Consulting",
          "Cloud Migration",
          "Infrastructure Modernization",
          "Cloud Architecture Design",
          "Hybrid & Multi-Cloud",
          "Cloud Cost Optimization",
          "Disaster Recovery Planning",
          "Backup & Business Continuity",
          "Cloud Security Management",
        ],
        extra: {
          label: "Platforms",
          items: ["AWS", "Microsoft Azure", "Google Cloud", "Oracle Cloud"],
        },
      },
      {
        icon: "security",
        title: "Cybersecurity Services",
        desc: "Enterprise-grade security that protects your organization from evolving cyber threats.",
        includes: [
          "Security Assessments",
          "Vulnerability Management",
          "Penetration Testing",
          "Security Operations Center (SOC)",
          "Managed Security Services",
          "Identity & Access Management",
          "Endpoint & Network Security",
          "Data Protection & Encryption",
          "Incident Response",
          "Security Awareness Training",
        ],
        extra: {
          label: "Compliance",
          items: ["ISO 27001", "GDPR", "HIPAA", "SOC 2", "PCI DSS"],
        },
      },
      {
        icon: "code",
        title: "Software Development",
        desc: "Custom software solutions that drive operational excellence and business growth.",
        includes: [
          "Enterprise Software Development",
          "Web Application Development",
          "SaaS Product Development",
          "API Development & Integration",
          "Legacy Application Modernization",
          "Custom Business Applications",
          "Software Maintenance & Support",
          "Quality Assurance & Testing",
        ],
      },
      {
        icon: "mobile",
        title: "Mobile Application Development",
        desc: "Engaging mobile experiences across platforms, from native to cross-platform.",
        includes: [
          "Android Development",
          "iOS Development",
          "Cross-Platform Development",
          "Flutter Development",
          "React Native Development",
          "Mobile UI/UX Design",
          "Mobile Security",
          "App Maintenance & Support",
        ],
      },
      {
        icon: "product",
        title: "Product Engineering",
        desc: "End-to-end product development and engineering that accelerates innovation.",
        includes: [
          "Product Ideation",
          "Product Architecture Design",
          "MVP Development",
          "Product Modernization",
          "Product Testing",
          "Product Lifecycle Management",
          "Product Support & Enhancement",
        ],
      },
      {
        icon: "data",
        title: "Data Analytics & Business Intelligence",
        desc: "Unlock valuable insights from your business data to improve strategic decision-making.",
        includes: [
          "Data Engineering",
          "Data Warehousing",
          "Data Visualization",
          "BI Dashboards",
          "Predictive Analytics",
          "Big Data Solutions",
          "Real-Time Reporting",
          "Data Governance",
        ],
        extra: {
          label: "Technologies",
          items: ["Power BI", "Tableau", "Snowflake", "Databricks", "Microsoft Fabric"],
        },
      },
      {
        icon: "devops",
        title: "DevOps & Site Reliability Engineering",
        desc: "Accelerate software delivery through automation and modern infrastructure practices.",
        includes: [
          "CI/CD Pipeline Development",
          "Infrastructure as Code",
          "Containerization",
          "Kubernetes Management",
          "Monitoring & Observability",
          "Performance Optimization",
          "Release Automation",
          "Site Reliability Engineering",
        ],
        extra: {
          label: "Technologies",
          items: ["Docker", "Kubernetes", "Terraform", "Jenkins", "GitHub Actions", "Azure DevOps"],
        },
      },
      {
        icon: "digital",
        title: "Digital Transformation",
        desc: "Modernize operations and customer experiences through technology-driven innovation.",
        includes: [
          "Transformation Strategy",
          "Process Automation",
          "Enterprise Modernization",
          "Customer Experience Transformation",
          "Technology Roadmaps",
          "Innovation Consulting",
          "Change Management",
        ],
      },
      {
        icon: "infra",
        title: "IT Infrastructure Services",
        desc: "Design, deploy, and manage enterprise-grade infrastructure environments.",
        includes: [
          "Network Infrastructure Design",
          "Data Center Management",
          "Server Administration",
          "Virtualization Services",
          "Infrastructure Monitoring",
          "Storage Management",
          "Backup Solutions",
          "Disaster Recovery",
        ],
      },
      {
        icon: "enterprise",
        title: "Enterprise Application Services",
        desc: "Improve operational efficiency with enterprise business applications.",
        includes: [
          "ERP Implementation",
          "CRM Solutions",
          "Microsoft 365 Services",
          "SharePoint Solutions",
          "SAP Consulting",
          "Oracle Solutions",
          "Enterprise Integration",
        ],
      },
      {
        icon: "staffing",
        title: "Staff Augmentation & Talent",
        desc: "Scale your workforce with highly qualified professionals, on demand.",
        includes: [
          "IT Staffing",
          "Contract Staffing",
          "Permanent Recruitment",
          "Executive Search",
          "Dedicated Development Teams",
          "Offshore Development Centers",
          "Resource Management",
        ],
      },
      {
        icon: "bpo",
        title: "Business Process Outsourcing",
        desc: "Improve efficiency and reduce operational costs through managed business services.",
        includes: [
          "Customer Support Services",
          "Technical Support",
          "Back Office Operations",
          "Data Processing",
          "Finance & Accounting Support",
          "HR Outsourcing",
          "Procurement Support",
        ],
      },
      {
        icon: "consulting",
        title: "IT Consulting Services",
        desc: "Align technology investments with strategic business objectives.",
        includes: [
          "IT Strategy Development",
          "Technology Assessment",
          "Enterprise Architecture",
          "IT Governance",
          "Risk Management",
          "Technology Roadmaps",
          "Digital Advisory",
        ],
      },
      {
        icon: "managed",
        title: "Managed IT Services",
        desc: "Ensure continuous operations with proactive IT management and support.",
        includes: [
          "24/7 Monitoring & Support",
          "Help Desk Services",
          "Infrastructure Management",
          "Cloud Management",
          "Security Monitoring",
          "Patch Management",
          "Asset Management",
          "Remote IT Support",
        ],
      },
    ] as Service[],
  },

  industries: {
    eyebrow: "Industries We Serve",
    title: "Deep expertise across sectors",
    lead: "We bring domain understanding and proven delivery to organizations of every size and stage.",
    items: [
      "Banking & Financial Services",
      "Healthcare & Life Sciences",
      "Retail & E-Commerce",
      "Manufacturing",
      "Education",
      "Telecommunications",
      "Logistics & Supply Chain",
      "Government & Public Sector",
      "Technology Companies",
      "Energy & Utilities",
      "Professional Services",
      "Startups & Emerging Businesses",
    ],
  },

  why: {
    eyebrow: "Why Choose Criska",
    title: "Your trusted technology partner",
    lead: "Ten reasons leading teams build with us for the long term.",
    items: [
      "AI & Digital Transformation Expertise",
      "Enterprise Infrastructure Specialists",
      "Cybersecurity-First Approach",
      "Cloud-Native Engineering",
      "Global Delivery Capabilities",
      "Experienced Industry Consultants",
      "Agile & Scalable Engagement Models",
      "Focus on Business Outcomes",
      "End-to-End Technology Services",
      "Long-Term Strategic Partnerships",
    ],
  },

  clients: {
    eyebrow: "Trusted by",
    title: "Clients across industries and continents",
    items: [
      "State Bank of India",
      "John Hancock",
      "Sutherland Global",
      "Prolifics",
      "Brillio",
      "Aegis",
      "Cedrus",
      "Pellera",
    ],
  },

  cta: {
    eyebrow: "Get started",
    title: "Let's start a conversation.",
    lead: "Consulting, software development, staffing, or outsourcing — our team is ready to help you move faster.",
    button: { label: "Schedule Consultation", href: "/contact" },
  },

  contact: {
    eyebrow: "Contact",
    title: "Let's start a conversation",
    lead: "Whether you need consulting, software development support, staffing solutions, or outsourcing expertise, our team is ready to assist you.",
    officeLabel: "Corporate Office",
    company: "Criska Business Consulting Pvt. Ltd.",
    address: [
      "H No 1-98/5/2A, Spacion Business Towers",
      "Madhapur, Shaikpet",
      "Hyderabad, Rangareddy",
      "Telangana — 500081",
    ],
    phone: "+91 8121485444",
    emails: ["info@criska.in", "hr@criskasecurity.com"],
    website: "www.criska.in",
    formFields: [
      "Full Name",
      "Company Name",
      "Email Address",
      "Phone Number",
      "Service Interested In",
      "Project Requirements",
      "Message",
    ],
    submitLabel: "Send Inquiry",
  },

  quality: {
    eyebrow: "Quality & Compliance",
    title: "Commitment to quality excellence",
    intro:
      "At Criska, quality, security, and continuous improvement are at the core of everything we do. We follow industry best practices, standardized delivery methodologies, and rigorous quality management to ensure consistent service excellence.",
    blocks: [
      {
        title: "ISO Certified Organization",
        body: "Criska is proud to be an ISO Certified organization, demonstrating our commitment to internationally recognized standards for quality management, operational efficiency, customer satisfaction, and continual improvement across consulting, technology, infrastructure, cybersecurity, and business solutions.",
      },
      {
        title: "Advancing Towards CMMI Certification",
        body: "As part of our continuous improvement journey, Criska is actively working toward CMMI (Capability Maturity Model Integration) certification — reinforcing our commitment to process-driven excellence, predictable delivery, continuous improvement, risk management, and global service standards.",
      },
    ],
    promise: [
      "Delivering consistent and measurable business outcomes",
      "Following industry best practices and governance standards",
      "Ensuring security, compliance, and operational excellence",
      "Continuously improving our processes and service delivery",
      "Building long-term partnerships through trust and transparency",
    ],
    closer: "Trusted. Certified. Continuously Improving.",
  },

  blog: {
    eyebrow: "Blog & Insights",
    title: "Insights, ideas & technology trends",
    lead: "Practical knowledge and strategic guidance on AI, cybersecurity, cloud, infrastructure, data, software, and business transformation.",
    featured: [
      {
        slug: "future-of-generative-ai-in-enterprise",
        title: "The Future of Generative AI in Enterprise Business",
        excerpt:
          "How organizations leverage Generative AI to improve productivity, automate processes, and create new business opportunities.",
        category: "Artificial Intelligence",
        body: [
          "Generative AI has moved from experimentation to the enterprise mainstream. Organizations are embedding large language models and intelligent automation into core workflows — from customer support to document processing — and seeing measurable gains in productivity and speed.",
          "The most successful adopters start narrow and practical: a single high-volume process, a clear success metric, and a governance model that keeps data secure. From there, value compounds as teams reuse the same platform across functions.",
          "At Criska, we help organizations design an AI strategy, integrate LLMs responsibly, and build custom AI products — always with governance, compliance, and human oversight built in from day one.",
        ],
      },
      {
        slug: "building-a-cyber-resilient-organization",
        title: "Building a Cyber-Resilient Organization",
        excerpt:
          "The essential cybersecurity strategies every organization should implement to protect against modern threats.",
        category: "Cybersecurity",
        body: [
          "Cyber resilience is no longer just about prevention — it is about how quickly an organization can detect, respond to, and recover from an incident. A resilient posture combines strong identity controls, continuous monitoring, and a tested incident-response plan.",
          "Foundational practices include vulnerability management, endpoint and network security, data encryption, and regular security-awareness training. Compliance frameworks such as ISO 27001, SOC 2, GDPR, and HIPAA provide a proven baseline.",
          "Criska takes a cybersecurity-first approach across every engagement, helping teams assess risk, harden their environments, and stand up managed security operations that run around the clock.",
        ],
      },
      {
        slug: "cloud-migration-strategic-approach",
        title: "Cloud Migration: A Strategic Approach for Modern Enterprises",
        excerpt:
          "Best practices for planning, executing, and optimizing cloud migration while minimizing risk and maximizing value.",
        category: "Cloud Computing",
        body: [
          "Cloud migration succeeds or fails on planning. A clear assessment of workloads, dependencies, and business priorities lets teams choose the right approach — rehost, replatform, or re-architect — for each application.",
          "Cost optimization and security must be designed in, not bolted on. Right-sizing, hybrid and multi-cloud strategies, and disaster-recovery planning keep environments resilient and economical as they scale.",
          "Criska supports the full journey — cloud strategy, architecture, migration, and modernization across AWS, Azure, Google Cloud, and Oracle Cloud.",
        ],
      },
      {
        slug: "data-analytics-competitive-advantage",
        title: "Data Analytics: Turning Information into Competitive Advantage",
        excerpt:
          "How data-driven decision-making improves efficiency, customer engagement, and overall business performance.",
        category: "Data Analytics",
        body: [
          "Data is only an advantage when it reaches the right people at the right time. Modern analytics turns scattered information into clear, real-time insight that leaders can act on with confidence.",
          "The building blocks are dependable data engineering, well-governed warehousing, and dashboards that answer real business questions. Predictive analytics then moves teams from reporting on the past to anticipating what's next.",
          "Criska builds analytics and BI platforms on Power BI, Tableau, Snowflake, Databricks, and Microsoft Fabric — designed around the decisions they need to support.",
        ],
      },
      {
        slug: "digital-transformation-beyond-technology",
        title: "Digital Transformation: Beyond Technology",
        excerpt:
          "Why successful transformation requires a combination of technology, people, processes, and culture.",
        category: "Digital Transformation",
        body: [
          "Digital transformation is often framed as a technology problem, but the hardest work is organizational. Lasting change requires aligning people, processes, and culture around a shared vision.",
          "Successful programs pair modernization with strong change management — clear communication, capability building, and measurable outcomes at every stage.",
          "Criska partners with organizations on transformation strategy, process automation, and enterprise modernization, keeping business outcomes at the center throughout.",
        ],
      },
    ] as BlogPost[],
    categories: [
      { title: "Artificial Intelligence", desc: "AI, ML, Generative AI, intelligent automation, and NLP transforming modern business." },
      { title: "Cybersecurity", desc: "Threat intelligence, security frameworks, compliance standards, and best practices." },
      { title: "Cloud Computing", desc: "Cloud migration, cloud-native architecture, multi-cloud, and cost optimization." },
      { title: "IT Infrastructure", desc: "Infrastructure modernization, networks, data centers, and disaster recovery." },
      { title: "Data Analytics & BI", desc: "Analytics, reporting, BI platforms, and data-driven decision-making." },
      { title: "Software Development", desc: "Engineering practices, modernization, agile, and DevOps." },
      { title: "DevOps & Automation", desc: "Automation, CI/CD, containerization, and cloud operations." },
      { title: "Business Consulting", desc: "Operational excellence, strategy, organizational growth, and innovation." },
    ] as BlogCategory[],
    trending: [
      "Artificial Intelligence & Generative AI",
      "Enterprise Automation",
      "Cybersecurity & Risk Management",
      "Cloud Infrastructure",
      "Digital Transformation",
      "Business Intelligence",
      "DevOps & SRE",
      "Managed Services",
      "IT Consulting",
      "Emerging Technologies",
    ],
  },

  footer: {
    quickLinks: [
      { label: "Home", href: "/" },
      { label: "About Us", href: "/#about" },
      { label: "Leadership Team", href: "/leadership" },
      { label: "Services", href: "/#services" },
      { label: "Industries", href: "/#industries" },
      { label: "Blogs & Insights", href: "/blog" },
      { label: "Case Studies", href: "/case-studies" },
      { label: "Careers", href: "/careers" },
      { label: "Contact Us", href: "/contact" },
    ] as NavLink[],
    services: [
      { label: "Artificial Intelligence & Generative AI", href: "/#services" },
      { label: "Cybersecurity Services", href: "/#services" },
      { label: "Cloud Infrastructure Services", href: "/#services" },
      { label: "IT Infrastructure Management", href: "/#services" },
      { label: "Software Development", href: "/#services" },
      { label: "Mobile App Development", href: "/#services" },
      { label: "Data Analytics & Business Intelligence", href: "/#services" },
      { label: "DevOps & Cloud Operations", href: "/#services" },
      { label: "Digital Transformation", href: "/#services" },
      { label: "Managed IT Services", href: "/#services" },
      { label: "Staff Augmentation", href: "/#services" },
      { label: "Business Consulting", href: "/#services" },
    ] as NavLink[],
    industries: [
      { label: "Banking & Financial Services", href: "/#industries" },
      { label: "Healthcare & Life Sciences", href: "/#industries" },
      { label: "Retail & E-Commerce", href: "/#industries" },
      { label: "Manufacturing", href: "/#industries" },
      { label: "Logistics & Supply Chain", href: "/#industries" },
      { label: "Education", href: "/#industries" },
      { label: "Government", href: "/#industries" },
      { label: "Technology", href: "/#industries" },
    ] as NavLink[],
    resources: [
      { label: "Blogs", href: "/blog" },
      { label: "Technology Insights", href: "/blog" },
      { label: "Whitepapers", href: "/case-studies" },
      { label: "Case Studies", href: "/case-studies" },
      { label: "Industry Reports", href: "/case-studies" },
      { label: "FAQs", href: "/faq" },
    ] as NavLink[],
    fine: "© 2026 CRISKA BUSINESS CONSULTING PVT. LTD. · HYDERABAD · INDIA / UK / US",
  },

  careers: {
    eyebrow: "Careers",
    title: "Build what's next, with people who care",
    lead: "Criska is a people-focused, relationship-driven company. We hire curious problem-solvers and give them the freedom, ownership, and support to do their best work.",
    culture: [
      { title: "Ownership at every level", desc: "From delivery to leadership, people are trusted to make decisions and own outcomes." },
      { title: "Empathy & collaboration", desc: "A supportive, open culture where ideas are heard and teamwork is the default." },
      { title: "Global exposure", desc: "Work with clients across India, the UK, and the US on meaningful technology problems." },
      { title: "Continuous growth", desc: "Learn across AI, cloud, security, data, and consulting as you grow your career." },
    ],
    roles: [
      { title: "AI / Machine Learning Engineer", type: "Full-time · Hyderabad / Remote" },
      { title: "Cloud & DevOps Engineer", type: "Full-time · Hyderabad / Remote" },
      { title: "Cybersecurity Analyst", type: "Full-time · Hyderabad" },
      { title: "Full-Stack Software Engineer", type: "Full-time · Hyderabad / Remote" },
      { title: "Data Engineer / BI Developer", type: "Full-time · Hyderabad / Remote" },
      { title: "IT Recruiter / Talent Partner", type: "Full-time · Hyderabad" },
    ],
    ctaNote: "Don't see the right role? We're always glad to meet great people.",
  },

  caseStudies: {
    eyebrow: "Case Studies",
    title: "Outcomes we've delivered",
    lead: "A snapshot of the measurable impact Criska creates across industries — detailed case studies and industry reports are available on request.",
    items: [
      {
        sector: "Banking & Financial Services",
        title: "Secure cloud modernization for a financial services leader",
        result: "Migrated core workloads to a hybrid cloud with zero critical incidents and improved resilience.",
        metric: "40%",
        metricLabel: "lower infrastructure cost",
      },
      {
        sector: "Healthcare & Life Sciences",
        title: "HIPAA-aligned data platform for a healthcare provider",
        result: "Unified fragmented data into a governed analytics platform with real-time reporting.",
        metric: "3x",
        metricLabel: "faster reporting cycles",
      },
      {
        sector: "Retail & E-Commerce",
        title: "AI-powered customer support automation",
        result: "Deployed conversational AI that resolved routine queries and freed agents for complex cases.",
        metric: "60%",
        metricLabel: "of queries auto-resolved",
      },
      {
        sector: "Technology",
        title: "Dedicated offshore engineering team",
        result: "Stood up a scalable offshore development center to accelerate a SaaS product roadmap.",
        metric: "2x",
        metricLabel: "delivery velocity",
      },
    ],
  },

  leadership: {
    eyebrow: "Leadership Team",
    title: "Experienced leaders, hands-on delivery",
    lead: "Criska is led by experienced technology and consulting professionals who stay close to delivery. Our leadership spans engineering, security, consulting, and people functions — united by a focus on client outcomes and long-term partnerships.",
    functions: [
      { area: "Executive Leadership", desc: "Sets strategy, partnerships, and the standards of trust and quality that guide every engagement." },
      { area: "Delivery & Engineering", desc: "Owns solution architecture, delivery excellence, and the health of every project." },
      { area: "Security & Compliance", desc: "Drives our cybersecurity-first approach, ISO standards, and the CMMI maturity journey." },
      { area: "Consulting & Advisory", desc: "Aligns technology investments with business objectives across industries." },
      { area: "Talent & People", desc: "Leads staffing, recruitment, and the people-focused culture Criska is known for." },
      { area: "Client Success", desc: "Ensures responsive support, low escalations, and lasting client relationships." },
    ],
    note: "For leadership introductions or partnership conversations, reach us at hr@criskasecurity.com.",
  },

  faq: {
    eyebrow: "FAQs",
    title: "Frequently asked questions",
    lead: "Answers to common questions about working with Criska. Don't see yours? Reach out any time.",
    items: [
      { q: "What services does Criska offer?", a: "We span AI & Generative AI, cloud, cybersecurity, software and mobile development, product engineering, data & BI, DevOps/SRE, digital transformation, IT infrastructure, enterprise applications, staffing, BPO, IT consulting, and managed IT services." },
      { q: "Which engagement models do you support?", a: "We offer flexible, scalable models — project-based delivery, dedicated teams, offshore development centers, staff augmentation, and managed services — tailored to your goals." },
      { q: "How does Criska handle security and compliance?", a: "We take a cybersecurity-first approach and are ISO certified, aligned to frameworks including SOC 2, PCI DSS, GDPR, and HIPAA, and are advancing toward CMMI certification." },
      { q: "Which industries do you serve?", a: "Banking & financial services, healthcare, retail & e-commerce, manufacturing, education, telecom, logistics, government, technology, energy, professional services, and startups." },
      { q: "Where is Criska located?", a: "Our corporate office is in Hyderabad, India, and we serve clients across India, the UK, and the US." },
      { q: "How do we get started?", a: "Schedule a consultation and our team will scope your needs, recommend an approach, and propose the right engagement model." },
    ],
  },
};

export type SiteContent = typeof site;
