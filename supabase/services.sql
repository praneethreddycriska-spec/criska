-- ============================================================
-- Criska — Services (admin-editable) : criska_services
-- Run once in the Supabase SQL Editor (project zbvvbtzmvxlbmjxepqoy).
-- Safe to re-run (idempotent create; seed only if empty).
-- ============================================================

create table if not exists public.criska_services (
  id          uuid primary key default gen_random_uuid(),
  icon        text not null default 'consulting',
  title       text not null,
  description text default '',
  includes    jsonb not null default '[]'::jsonb,
  extra_label text default '',
  extra_items jsonb not null default '[]'::jsonb,
  sort        int  not null default 0,
  created_at  timestamptz not null default now()
);

alter table public.criska_services enable row level security;

drop policy if exists "anon read services" on public.criska_services;
create policy "anon read services" on public.criska_services for select to anon, authenticated using (true);

insert into public.criska_services (icon, title, description, includes, extra_label, extra_items, sort)
select * from (values
  ('ai', 'Artificial Intelligence & Generative AI', 'AI-powered solutions that improve efficiency, automate processes, and enhance customer experiences.', '["Generative AI Solutions","AI Strategy & Consulting","LLM Integration","AI Chatbot Development","Conversational AI Platforms","Predictive Analytics","Intelligent Document Processing","Machine Learning Solutions","Computer Vision","Natural Language Processing","AI Automation","AI Governance & Compliance"]'::jsonb, 'Business Benefits', '["Faster Decision-Making","Reduced Operational Costs","Improved Customer Experience","Increased Productivity","Data-Driven Insights"]'::jsonb, 0),
  ('cloud', 'Cloud Infrastructure Services', 'Scalable, secure, and resilient cloud environments that support growth and digital transformation.', '["Cloud Strategy & Consulting","Cloud Migration","Infrastructure Modernization","Cloud Architecture Design","Hybrid & Multi-Cloud","Cloud Cost Optimization","Disaster Recovery Planning","Backup & Business Continuity","Cloud Security Management"]'::jsonb, 'Platforms', '["AWS","Microsoft Azure","Google Cloud","Oracle Cloud"]'::jsonb, 1),
  ('security', 'Cybersecurity Services', 'Enterprise-grade security that protects your organization from evolving cyber threats.', '["Security Assessments","Vulnerability Management","Penetration Testing","Security Operations Center (SOC)","Managed Security Services","Identity & Access Management","Endpoint & Network Security","Data Protection & Encryption","Incident Response","Security Awareness Training"]'::jsonb, 'Compliance', '["ISO 27001","GDPR","HIPAA","SOC 2","PCI DSS"]'::jsonb, 2),
  ('code', 'Software Development', 'Custom software solutions that drive operational excellence and business growth.', '["Enterprise Software Development","Web Application Development","SaaS Product Development","API Development & Integration","Legacy Application Modernization","Custom Business Applications","Software Maintenance & Support","Quality Assurance & Testing"]'::jsonb, '', '[]'::jsonb, 3),
  ('mobile', 'Mobile Application Development', 'Engaging mobile experiences across platforms, from native to cross-platform.', '["Android Development","iOS Development","Cross-Platform Development","Flutter Development","React Native Development","Mobile UI/UX Design","Mobile Security","App Maintenance & Support"]'::jsonb, '', '[]'::jsonb, 4),
  ('product', 'Product Engineering', 'End-to-end product development and engineering that accelerates innovation.', '["Product Ideation","Product Architecture Design","MVP Development","Product Modernization","Product Testing","Product Lifecycle Management","Product Support & Enhancement"]'::jsonb, '', '[]'::jsonb, 5),
  ('data', 'Data Analytics & Business Intelligence', 'Unlock valuable insights from your business data to improve strategic decision-making.', '["Data Engineering","Data Warehousing","Data Visualization","BI Dashboards","Predictive Analytics","Big Data Solutions","Real-Time Reporting","Data Governance"]'::jsonb, 'Technologies', '["Power BI","Tableau","Snowflake","Databricks","Microsoft Fabric"]'::jsonb, 6),
  ('devops', 'DevOps & Site Reliability Engineering', 'Accelerate software delivery through automation and modern infrastructure practices.', '["CI/CD Pipeline Development","Infrastructure as Code","Containerization","Kubernetes Management","Monitoring & Observability","Performance Optimization","Release Automation","Site Reliability Engineering"]'::jsonb, 'Technologies', '["Docker","Kubernetes","Terraform","Jenkins","GitHub Actions","Azure DevOps"]'::jsonb, 7),
  ('digital', 'Digital Transformation', 'Modernize operations and customer experiences through technology-driven innovation.', '["Transformation Strategy","Process Automation","Enterprise Modernization","Customer Experience Transformation","Technology Roadmaps","Innovation Consulting","Change Management"]'::jsonb, '', '[]'::jsonb, 8),
  ('infra', 'IT Infrastructure Services', 'Design, deploy, and manage enterprise-grade infrastructure environments.', '["Network Infrastructure Design","Data Center Management","Server Administration","Virtualization Services","Infrastructure Monitoring","Storage Management","Backup Solutions","Disaster Recovery"]'::jsonb, '', '[]'::jsonb, 9),
  ('enterprise', 'Enterprise Application Services', 'Improve operational efficiency with enterprise business applications.', '["ERP Implementation","CRM Solutions","Microsoft 365 Services","SharePoint Solutions","SAP Consulting","Oracle Solutions","Enterprise Integration"]'::jsonb, '', '[]'::jsonb, 10),
  ('staffing', 'Staff Augmentation & Talent', 'Scale your workforce with highly qualified professionals, on demand.', '["IT Staffing","Contract Staffing","Permanent Recruitment","Executive Search","Dedicated Development Teams","Offshore Development Centers","Resource Management"]'::jsonb, '', '[]'::jsonb, 11),
  ('bpo', 'Business Process Outsourcing', 'Improve efficiency and reduce operational costs through managed business services.', '["Customer Support Services","Technical Support","Back Office Operations","Data Processing","Finance & Accounting Support","HR Outsourcing","Procurement Support"]'::jsonb, '', '[]'::jsonb, 12),
  ('consulting', 'IT Consulting Services', 'Align technology investments with strategic business objectives.', '["IT Strategy Development","Technology Assessment","Enterprise Architecture","IT Governance","Risk Management","Technology Roadmaps","Digital Advisory"]'::jsonb, '', '[]'::jsonb, 13),
  ('managed', 'Managed IT Services', 'Ensure continuous operations with proactive IT management and support.', '["24/7 Monitoring & Support","Help Desk Services","Infrastructure Management","Cloud Management","Security Monitoring","Patch Management","Asset Management","Remote IT Support"]'::jsonb, '', '[]'::jsonb, 14)
) as v(icon, title, description, includes, extra_label, extra_items, sort)
where not exists (select 1 from public.criska_services);
