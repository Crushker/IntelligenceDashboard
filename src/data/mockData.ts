export interface IntelligenceItem {
  id: string;
  category: 'Regulatory' | 'Cyber-Threat' | 'Infra-Architecture' | 'Frontier-Tech' | 'Video-Masterclass' | 'Networking-Event';
  headline: string;
  source_authority: string;
  source_url: string;
  applicable_nbfc_layers: ('Base' | 'Middle' | 'Upper' | 'Top' | 'All')[];
  technical_summary: string;
  cio_actionable_directive: string;
  severity_or_relevance_score: number;
  published_at: string;
  tags: string[];
}

export interface VideoItem {
  id: string;
  title: string;
  channel: string;
  channel_id: string;
  video_id: string;
  thumbnail_url: string;
  duration: string;
  executive_summary: string;
  architecture_notes: string[];
  published_at: string;
  relevance_score: number;
  applicable_layers: ('Base' | 'Middle' | 'Upper' | 'Top' | 'All')[];
}

export const intelligenceFeed: IntelligenceItem[] = [
  {
    id: 'int-001',
    category: 'Regulatory',
    headline: 'RBI Master Direction: IT Governance Framework for NBFCs – Mandatory SOC 2 Type II Compliance by Q3 2026',
    source_authority: 'Reserve Bank of India',
    source_url: 'https://www.rbi.org.in/Scripts/BS_View-MasterDirections.aspx?id=12289',
    applicable_nbfc_layers: ['Upper', 'Top'],
    technical_summary: 'RBI mandates all Upper and Top layer NBFCs to achieve SOC 2 Type II certification for core banking systems, lending platforms, and customer data repositories. Requires implementation of continuous monitoring controls, annual third-party penetration testing, and real-time SIEM integration with CERT-In reporting APIs. Non-compliance penalties include license suspension and director disqualification.',
    cio_actionable_directive: 'Immediately commission SOC 2 Type II gap assessment. Assign CISO to engage Big-4 auditor for Q1 2026 readiness. Deploy continuous compliance monitoring via AWS Config Rules + custom Lambda validators. Budget ₹2.5Cr for remediation.',
    severity_or_relevance_score: 10,
    published_at: '2026-01-15T09:00:00Z',
    tags: ['RBI', 'SOC2', 'Compliance', 'IT-Governance']
  },
  {
    id: 'int-002',
    category: 'Cyber-Threat',
    headline: 'CERT-In Advisory: Critical Zero-Day in Apache Struts Affecting Legacy Core Banking Modules',
    source_authority: 'CERT-In',
    source_url: 'https://www.cert-in.org.in/advisory/CVE-2026-0847',
    applicable_nbfc_layers: ['All'],
    technical_summary: 'CVE-2026-0847: Remote Code Execution vulnerability in Apache Struts 2.x (versions < 6.2.1) affecting OGNL expression parsing. Exploitable via crafted Content-Type headers. Multiple Indian banks and NBFCs running legacy Struts-based loan origination systems confirmed vulnerable. Active exploitation in wild targeting BFSI sector with Cobalt Strike beacons.',
    cio_actionable_directive: 'EMERGENCY: Instruct infrastructure team to apply WAF rules blocking OGNL injection patterns within 4 hours. Patch all Struts instances to 6.2.1+ within 48 hours. Isolate affected loan origination modules behind additional network segmentation. Report incident to CERT-In within 6 hours per mandatory reporting directive.',
    severity_or_relevance_score: 10,
    published_at: '2026-01-18T14:30:00Z',
    tags: ['CVE', 'Zero-Day', 'Apache-Struts', 'RCE', 'Critical']
  },
  {
    id: 'int-003',
    category: 'Infra-Architecture',
    headline: 'OCEN 4.0 Protocol Specification Released – Open Credit Enablement Network for Embedded Lending',
    source_authority: 'NPCI / Sahamati',
    source_url: 'https://ocen.dev/specifications/v4.0',
    applicable_nbfc_layers: ['Middle', 'Upper', 'Top'],
    technical_summary: 'OCEN 4.0 introduces distributed credit decisioning via composable microservice patterns. Key changes: (1) Event-driven loan lifecycle management via Kafka/EventBridge, (2) Decentralized identity resolution using DID/VC standards, (3) Real-time credit bureau integration via Account Aggregator consent artefacts, (4) Multi-party computation for privacy-preserving income verification. Backward compatibility with OCEN 3.x maintained via adapter pattern.',
    cio_actionable_directive: 'Register engineering team for NPCI OCEN 4.0 sandbox pilot (deadline: Feb 28, 2026). Task architecture team with designing event-driven lending microservices migration roadmap. Evaluate Kafka vs EventBridge for event backbone. Budget ₹80L for platform modernization over 2 quarters.',
    severity_or_relevance_score: 9,
    published_at: '2026-01-12T11:00:00Z',
    tags: ['OCEN', 'NPCI', 'Embedded-Lending', 'Event-Driven', 'Architecture']
  },
  {
    id: 'int-004',
    category: 'Frontier-Tech',
    headline: 'Post-Quantum Cryptography Migration: NIST Finalizes ML-KEM and ML-DSA Standards for BFSI',
    source_authority: 'NIST / arXiv',
    source_url: 'https://csrc.nist.gov/news/2026/pqc-final-standards-bfsi-guidance',
    applicable_nbfc_layers: ['Upper', 'Top'],
    technical_summary: 'NIST publishes final PQC standards: ML-KEM (CRYSTALS-Kyber) for key encapsulation and ML-DSA (CRYSTALS-Dilithium) for digital signatures. BFSI-specific guidance mandates hybrid TLS 1.3 + PQC for all customer-facing APIs by 2028. Key sizes increase 10-50x requiring HSM firmware upgrades and certificate authority migration. IDRBT recommends phased approach starting with non-production environments.',
    cio_actionable_directive: 'Commission cryptographic inventory audit of all TLS endpoints and signing operations. Engage HSM vendor (Thales/Entrust) for firmware upgrade roadmap. Begin PQC hybrid TLS testing in staging by Q2 2026. Allocate ₹1.2Cr for cryptographic infrastructure modernization over 3 years.',
    severity_or_relevance_score: 8,
    published_at: '2026-01-10T08:00:00Z',
    tags: ['PQC', 'NIST', 'Cryptography', 'HSM', 'TLS']
  },
  {
    id: 'int-005',
    category: 'Regulatory',
    headline: 'DPDP Act 2023: Consent Manager Architecture Technical Standards Published by MeitY',
    source_authority: 'MeitY / Data Protection Board',
    source_url: 'https://meity.gov.in/dpdp-consent-manager-technical-standards-2026',
    applicable_nbfc_layers: ['All'],
    technical_summary: 'MeitY publishes binding technical standards for Consent Manager (CM) architectures under DPDP Act. Requirements: (1) CM must implement FHIR-standard consent artefacts, (2) Data Principal authentication via Aadhaar e-KYC or DigiLocker, (3) Consent revocation must propagate within 72 hours across all data fiduciaries, (4) Audit trail with cryptographic timestamping (ISO 27001 Annex A.12.4). Non-compliant CMs face ₹500Cr penalties.',
    cio_actionable_directive: 'Evaluate Sahamati-aligned consent manager vendors (Setu, OneMoney, Anumati). Task legal + engineering with DPDP compliance gap assessment. Implement consent propagation webhook system. Ensure all customer data processing pipelines respect consent artefact lifecycle.',
    severity_or_relevance_score: 9,
    published_at: '2026-01-08T10:00:00Z',
    tags: ['DPDP', 'Consent-Manager', 'Privacy', 'MeitY', 'Compliance']
  },
  {
    id: 'int-006',
    category: 'Cyber-Threat',
    headline: 'API Security: Mass Assignment Vulnerability Pattern Detected in 40% of Indian Fintech Lending APIs',
    source_authority: 'IDRBT Research',
    source_url: 'https://idrbt.ac.in/research/api-security-bfsi-2026',
    applicable_nbfc_layers: ['Base', 'Middle', 'Upper'],
    technical_summary: 'IDRBT red team assessment reveals widespread mass assignment (CWE-915) vulnerabilities in lending APIs. Attackers can modify loan approval amounts, interest rates, and KYC verification status by injecting additional JSON fields. Affects REST APIs lacking schema validation middleware. Critical finding: 12 NBFCs had exploitable endpoints allowing unauthorized loan disbursement modifications.',
    cio_actionable_directive: 'Immediate API security audit: Deploy schema validation middleware (Joi/Zod) on all lending APIs. Implement allowlist-based field mapping for all PATCH/PUT endpoints. Engage IDRBT for red team assessment. Add API gateway rate limiting with anomaly detection for unusual field injection patterns.',
    severity_or_relevance_score: 9,
    published_at: '2026-01-05T16:00:00Z',
    tags: ['API-Security', 'Mass-Assignment', 'Lending', 'Vulnerability']
  },
  {
    id: 'int-007',
    category: 'Infra-Architecture',
    headline: 'Confidential Computing: Azure Confidential VMs Now Support Aadhaar Vault Key Isolation Workloads',
    source_authority: 'Microsoft Azure / UIDAI',
    source_url: 'https://azure.microsoft.com/confidential-computing/bfsi-aadhaar-vault',
    applicable_nbfc_layers: ['Upper', 'Top'],
    technical_summary: 'Azure Confidential VMs (DCsv3 series) with AMD SEV-SNP now certified by UIDAI for Aadhaar data vault workloads. TEE enclaves provide hardware-isolated memory encryption for biometric data processing. Enables NBFCs to process Aadhaar e-KYC in cloud without exposing plaintext biometrics to hypervisor. Supports 256-bit SMEE encryption with attestation reports verifiable via UIDAI APIs.',
    cio_actionable_directive: 'Evaluate migration of Aadhaar vault from on-prem HSM to Azure Confidential VMs. Request POC environment from Microsoft India. Task security team with designing attestation verification pipeline. Calculate TCO comparison: on-prem HSM (₹3Cr/yr) vs Confidential VMs (₹1.8Cr/yr).',
    severity_or_relevance_score: 8,
    published_at: '2026-01-03T12:00:00Z',
    tags: ['Confidential-Computing', 'TEE', 'Aadhaar', 'Azure', 'Key-Isolation']
  },
  {
    id: 'int-008',
    category: 'Networking-Event',
    headline: 'NASSCOM BFSI Cybersecurity Roundtable: AI-Powered Threat Detection in Core Banking Systems',
    source_authority: 'NASSCOM / DSCI',
    source_url: 'https://nasscom.in/events/bfsi-cyber-roundtable-q1-2026',
    applicable_nbfc_layers: ['All'],
    technical_summary: 'Closed-door roundtable with 40+ CISOs from Indian NBFCs and banks. Key outcomes: (1) Consensus on deploying LLM-based anomaly detection for transaction monitoring (reduces false positives by 60%), (2) Shared threat intelligence framework for BFSI sector via ISAC-India, (3) RBI endorsement of AI-assisted SOC operations with human-in-the-loop for critical alerts, (4) Standardized incident response playbook for ransomware targeting lending platforms.',
    cio_actionable_directive: 'Register CISO and SOC Lead for NASSCOM BFSI ISAC-India membership (₹25L/yr). Evaluate CrowdStrike Charlotte AI and SentinelOne Singularity for SOC augmentation. Implement AI-based transaction monitoring POC with existing core banking data lake.',
    severity_or_relevance_score: 7,
    published_at: '2026-01-02T09:00:00Z',
    tags: ['NASSCOM', 'AI-SOC', 'Threat-Detection', 'BFSI-ISAC']
  },
  {
    id: 'int-009',
    category: 'Frontier-Tech',
    headline: 'Zero-Knowledge Proofs for Private KYC: ZK-SNARK Implementation Reduces Aadhaar Data Exposure by 95%',
    source_authority: 'arXiv / IIT Bombay',
    source_url: 'https://arxiv.org/abs/2026.01847',
    applicable_nbfc_layers: ['Middle', 'Upper', 'Top'],
    technical_summary: 'Research paper demonstrates production-ready ZK-SNARK circuit for Aadhaar-based KYC verification. NBFC can prove customer identity verification without storing or transmitting Aadhaar number/biometrics. Circuit generates proof in <2 seconds on standard GPU. Verification requires only public parameters and proof blob. Reduces regulatory surface area for DPDP compliance. Compatible with UIDAI authentication APIs via proxy architecture.',
    cio_actionable_directive: 'Task R&D team with ZK-SNARK POC for KYC workflow. Evaluate Rapidsnark and snarkJS libraries for production circuit compilation. Engage IIT Bombay research team for collaboration. Target: Reduce KYC data storage footprint by 90% while maintaining regulatory audit trail.',
    severity_or_relevance_score: 8,
    published_at: '2025-12-28T14:00:00Z',
    tags: ['ZKP', 'KYC', 'Privacy', 'Aadhaar', 'Cryptography']
  },
  {
    id: 'int-010',
    category: 'Regulatory',
    headline: 'RBI Scale-Based Regulation: Enhanced Due Diligence Requirements for Upper Layer NBFCs – Digital Lending',
    source_authority: 'Reserve Bank of India',
    source_url: 'https://www.rbi.org.in/Scripts/NotificationUser.aspx?id=13247',
    applicable_nbfc_layers: ['Upper', 'Top'],
    technical_summary: 'RBI circular mandates Upper Layer NBFCs to implement: (1) Key Fact Statement (KFS) generation engine with APR calculation per standardized formula, (2) Digital lending app audit trail with immutable logging (append-only, hash-chained), (3) Direct bank account credit (no pass-through wallets), (4) Grievance redressal SLA of 30 days with automated escalation. API integration with RBI reporting portal required by March 2026.',
    cio_actionable_directive: 'Commission engineering sprint to implement KFS generation microservice. Deploy immutable audit logging via AWS QLDB or Azure Confidential Ledger. Ensure all lending app disbursements route directly to borrower bank accounts. File compliance confirmation with RBI by March 31, 2026.',
    severity_or_relevance_score: 10,
    published_at: '2025-12-20T08:00:00Z',
    tags: ['RBI', 'Digital-Lending', 'KFS', 'Scale-Based', 'Compliance']
  },
  {
    id: 'int-011',
    category: 'Infra-Architecture',
    headline: 'Account Aggregator 2.0: Real-Time Financial Information Streaming via Sahamati Protocol Upgrade',
    source_authority: 'Sahamati / NPCI',
    source_url: 'https://sahamati.org.in/aa-protocol-2.0-spec',
    applicable_nbfc_layers: ['Middle', 'Upper', 'Top'],
    technical_summary: 'Sahamati releases AA Protocol 2.0 with real-time financial data streaming capabilities. Key features: (1) WebSocket-based real-time FIU data push (replaces polling), (2) Granular consent purposes with dynamic expiry, (3) Financial Information Provider (FIP) SDK for banks with <100ms latency SLA, (4) Consent artefact versioning with cryptographic signatures. Enables real-time income verification for instant loan decisions.',
    cio_actionable_directive: 'Upgrade AA integration to Protocol 2.0 for real-time income verification. Implement WebSocket client for FIU data streaming. Task engineering with reducing loan decision latency from 4 hours to <5 minutes using real-time AA data. Target: Increase loan approval conversion by 35%.',
    severity_or_relevance_score: 8,
    published_at: '2025-12-15T11:00:00Z',
    tags: ['Account-Aggregator', 'Sahamati', 'Real-Time', 'Lending', 'API']
  },
  {
    id: 'int-012',
    category: 'Cyber-Threat',
    headline: 'Supply Chain Attack: Compromised npm Package Targeting Node.js Banking Microservices',
    source_authority: 'CERT-In / Socket Security',
    source_url: 'https://www.cert-in.org.in/advisory/SCHAIN-2026-001',
    applicable_nbfc_layers: ['All'],
    technical_summary: 'Malicious npm package "express-rate-limit-pro" (typosquat of legitimate package) discovered injecting cryptocurrency miner and data exfiltration backdoor. Targets Node.js microservices common in BFSI architectures. Exfiltrates environment variables (DB credentials, API keys) via DNS tunneling. Detected in 3 Indian NBFC production environments via Socket security scanning.',
    cio_actionable_directive: 'EMERGENCY: Audit all Node.js dependencies for "express-rate-limit-pro" package. Deploy Socket.dev or Snyk for real-time dependency scanning in CI/CD. Implement npm audit in pre-commit hooks. Rotate all API keys and database credentials exposed to affected environments. Add egress filtering to block DNS tunneling patterns.',
    severity_or_relevance_score: 9,
    published_at: '2025-12-10T15:00:00Z',
    tags: ['Supply-Chain', 'npm', 'Backdoor', 'Node.js', 'Critical']
  }
];

export const videoItems: VideoItem[] = [
  {
    id: 'vid-001',
    title: 'Building Zero-Trust Architecture for Regulated BFSI Workloads on AWS',
    channel: 'AWS Architecture Center',
    channel_id: 'UCklKm9DfWZxGnSgK7YnHLgA',
    video_id: 'dQw4w9WgXcQ',
    thumbnail_url: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    duration: '47:23',
    executive_summary: 'Deep-dive into implementing zero-trust network architecture for BFSI on AWS. Covers: VPC isolation patterns for core banking, mTLS between microservices, AWS Nitro Enclaves for Aadhaar data processing, and real-time compliance monitoring via AWS Config + Lambda. Demonstrates reference architecture handling 10K TPS with <50ms latency for lending APIs.',
    architecture_notes: [
      'VPC design: Separate VPCs for Core Banking, Digital Lending, and Analytics with Transit Gateway',
      'mTLS via AWS App Mesh with ACM-managed certificates rotated every 24 hours',
      'Nitro Enclaves for biometric data processing with attestation to UIDAI verification service',
      'AWS Config rules for continuous RBI compliance monitoring (automated remediation via Lambda)'
    ],
    published_at: '2026-01-14T10:00:00Z',
    relevance_score: 9,
    applicable_layers: ['Upper', 'Top']
  },
  {
    id: 'vid-002',
    title: 'USENIX Enigma 2026: Confidential Computing for Financial Data – TEE Benchmarks and Production Deployments',
    channel: 'USENIX',
    channel_id: 'UCIH3Wo4zduMIBg6sIHp1K3A',
    video_id: 'abc123def45',
    thumbnail_url: 'https://img.youtube.com/vi/abc123def45/maxresdefault.jpg',
    duration: '1:12:45',
    executive_summary: 'Academic presentation of production TEE deployments in BFSI. Benchmarks AMD SEV-SNP vs Intel TDX for financial workloads. Shows 3-5% performance overhead for encrypted memory operations. Demonstrates secure multi-party computation for cross-NBFC credit scoring without data sharing. Includes threat model analysis for side-channel attacks on TEE implementations.',
    architecture_notes: [
      'AMD SEV-SNP: 3% overhead for AES-256 encrypted memory, suitable for real-time lending decisions',
      'Intel TDX: Better for batch processing workloads (credit bureau reconciliation)',
      'MPC protocol for cross-NBFC credit scoring: 200ms latency for 3-party computation',
      'Side-channel mitigations: Constant-time operations, cache partitioning, memory encryption'
    ],
    published_at: '2026-01-10T08:00:00Z',
    relevance_score: 8,
    applicable_layers: ['Upper', 'Top']
  },
  {
    id: 'vid-003',
    title: 'Black Hat 2026: Exploiting API Gateway Misconfigurations in Indian Banking Infrastructure',
    channel: 'Black Hat',
    channel_id: 'UC0hZSkGP8t0XjI7zNfIgpSA',
    video_id: 'xyz789ghi01',
    thumbnail_url: 'https://img.youtube.com/vi/xyz789ghi01/maxresdefault.jpg',
    duration: '52:18',
    executive_summary: 'Research presentation demonstrating critical API gateway vulnerabilities found in Indian banking infrastructure. Shows: JWT token manipulation for unauthorized fund transfers, rate limiting bypass via HTTP request smuggling, and IDOR vulnerabilities in loan application APIs. Includes remediation patterns and WAF rule sets for Kong/Apigee gateways.',
    architecture_notes: [
      'JWT manipulation: Missing "kid" validation allows token forgery – fix: implement JWKS endpoint validation',
      'HTTP request smuggling: Chunked encoding mismatch between CDN and API gateway – fix: normalize at edge',
      'IDOR in loan APIs: Sequential loan IDs predictable – fix: implement UUID-based resource identifiers',
      'WAF rules: Deploy ModSecurity CRS with custom BFSI-specific rule extensions'
    ],
    published_at: '2026-01-08T14:00:00Z',
    relevance_score: 10,
    applicable_layers: ['All']
  },
  {
    id: 'vid-004',
    title: 'IDRBT Technical Roundtable: Cloud Security Framework for Indian Banking – RBI Compliance Mapping',
    channel: 'IDRBT Official',
    channel_id: 'UCidrbt123456789',
    video_id: 'idrbt001cloud',
    thumbnail_url: 'https://img.youtube.com/vi/idrbt001cloud/maxresdefault.jpg',
    duration: '1:35:20',
    executive_summary: 'IDRBT-led discussion with RBI IT officials on cloud adoption framework for regulated entities. Covers: Data localization requirements, shared responsibility model for BFSI cloud workloads, RBI approval process for cloud migration, and hybrid cloud architecture patterns for core banking. Includes checklist for RBI cloud migration application.',
    architecture_notes: [
      'Data localization: All customer PII and financial data must reside in India-region data centers',
      'Shared responsibility: NBFC retains full accountability for data security regardless of cloud provider',
      'RBI approval: Submit cloud migration plan 90 days in advance with security architecture documentation',
      'Hybrid pattern: Core banking on-prem, digital lending and analytics on cloud with encrypted data sync'
    ],
    published_at: '2026-01-05T09:00:00Z',
    relevance_score: 9,
    applicable_layers: ['All']
  },
  {
    id: 'vid-005',
    title: 'Two Minute Papers: Breakthrough in Fully Homomorphic Encryption – 1000x Speedup for Financial Computations',
    channel: 'Two Minute Papers',
    channel_id: 'UCbfYPyITQ-7l4upoX8nvctg',
    video_id: 'tmp_fhe_2026',
    thumbnail_url: 'https://img.youtube.com/vi/tmp_fhe_2026/maxresdefault.jpg',
    duration: '12:34',
    executive_summary: 'Coverage of new FHE (Fully Homomorphic Encryption) hardware accelerator achieving 1000x speedup over software implementations. Enables real-time computation on encrypted financial data. Implications: Cross-bank fraud detection without data sharing, privacy-preserving credit scoring, and encrypted transaction monitoring for AML compliance.',
    architecture_notes: [
      'FHE accelerator: Custom ASIC achieving 1M operations/sec on encrypted data',
      'Use case: Cross-bank fraud detection – each bank encrypts transactions, joint computation identifies patterns',
      'Credit scoring: Compute creditworthiness without accessing raw financial data',
      'Timeline: Production-ready hardware expected Q4 2027 from IBM/Intel partnership'
    ],
    published_at: '2026-01-02T16:00:00Z',
    relevance_score: 7,
    applicable_layers: ['Upper', 'Top']
  },
  {
    id: 'vid-006',
    title: 'GCP Architecture: Building HIPAA-and-RBI-Compliant Data Lakes for Financial Analytics',
    channel: 'Google Cloud Architecture',
    channel_id: 'UCfLwGPYurB77xSv0jT3F4Vw',
    video_id: 'gcp_bfsi_datalake',
    thumbnail_url: 'https://img.youtube.com/vi/gcp_bfsi_datalake/maxresdefault.jpg',
    duration: '38:52',
    executive_summary: 'End-to-end architecture for building compliant data lakes on GCP for BFSI analytics. Covers: BigQuery with column-level encryption, Dataflow for real-time transaction processing, Dataplex for data governance, and VPC Service Controls for data perimeter. Includes cost optimization strategies for high-volume financial data workloads.',
    architecture_notes: [
      'BigQuery: Column-level encryption for PII fields with Cloud KMS customer-managed keys',
      'Dataflow: Real-time streaming from core banking to analytics with <1s latency',
      'Dataplex: Automated data quality checks and lineage tracking for RBI audit requirements',
      'VPC Service Controls: Prevent data exfiltration with perimeter-based access controls'
    ],
    published_at: '2025-12-28T11:00:00Z',
    relevance_score: 8,
    applicable_layers: ['Middle', 'Upper', 'Top']
  }
];

export const alertTickerItems = [
  { severity: 'critical' as const, text: 'RBI SOC 2 Type II Mandate – Compliance Deadline: Q3 2026' },
  { severity: 'critical' as const, text: 'CVE-2026-0847: Apache Struts RCE – Patch Within 48 Hours' },
  { severity: 'high' as const, text: 'OCEN 4.0 Sandbox Registration Deadline: Feb 28, 2026' },
  { severity: 'high' as const, text: 'DPDP Consent Manager Standards – Vendor Evaluation Required' },
  { severity: 'medium' as const, text: 'PQC Migration: Cryptographic Inventory Audit by Q2 2026' },
  { severity: 'medium' as const, text: 'Account Aggregator 2.0 Protocol Upgrade Available' },
  { severity: 'critical' as const, text: 'npm Supply Chain Attack – Audit Node.js Dependencies Immediately' },
  { severity: 'high' as const, text: 'Digital Lending KFS Engine – RBI Filing by March 31, 2026' },
];

export const nbfcLayers = ['Base', 'Middle', 'Upper', 'Top'] as const;
export const categories = ['Regulatory', 'Cyber-Threat', 'Infra-Architecture', 'Frontier-Tech', 'Video-Masterclass', 'Networking-Event'] as const;
