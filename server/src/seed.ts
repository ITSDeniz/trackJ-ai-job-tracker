import { prisma } from "./infrastructure/database/prismaClient.js";

async function main() {
  const users = await prisma.user.findMany();
  console.log("Found users in database:", users.map(u => ({ id: u.id, email: u.email })));

  if (users.length === 0) {
    console.log("No users found. Register a user in the UI first or create one here.");
    return;
  }

  // Seed generic apps for each user to make it easier to test
  for (const user of users) {
    console.log(`Seeding generic applications for user: ${user.email}`);

    // Define generic companies
    const mockCompanies = [
      { name: "Google", website: "https://google.com", industry: "Technology", size: "10,000+", location: "Mountain View, CA", notes: "Search & cloud computing company" },
      { name: "Meta", website: "https://meta.com", industry: "Social Media", size: "10,000+", location: "Menlo Park, CA", notes: "Social network and VR company" },
      { name: "Stripe", website: "https://stripe.com", industry: "Fintech", size: "5,000+", location: "San Francisco, CA", notes: "Online payment processor" },
      { name: "Airbnb", website: "https://airbnb.com", industry: "Travel & Hospitality", size: "5,000+", location: "San Francisco, CA", notes: "Vacation rental platform" },
      { name: "Linear", website: "https://linear.app", industry: "Software Tools", size: "50-100", location: "Remote", notes: "Issue tracker tool" },
    ];

    const companiesMap: Record<string, any> = {};

    for (const cInfo of mockCompanies) {
      // Find or create company
      let company = await prisma.company.findFirst({
        where: { userId: user.id, name: cInfo.name }
      });

      if (!company) {
        company = await prisma.company.create({
          data: {
            userId: user.id,
            name: cInfo.name,
            website: cInfo.website,
            industry: cInfo.industry,
            size: cInfo.size,
            location: cInfo.location,
            notes: cInfo.notes
          }
        });
        console.log(`Created company: ${cInfo.name}`);
      } else {
        console.log(`Company already exists: ${cInfo.name}`);
      }
      companiesMap[cInfo.name] = company;
    }

    // Define mock applications
    const mockApplications = [
      {
        companyName: "Google",
        title: "Senior Software Engineer (Frontend)",
        status: "interviewing" as const,
        priority: "high" as const,
        location: "Mountain View, CA (Hybrid)",
        workMode: "hybrid" as const,
        employmentType: "full_time" as const,
        salaryMin: 180000,
        salaryMax: 240000,
        salaryCurrency: "USD",
        appliedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        nextActionAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // in 2 days
        description: "Looking for a seasoned frontend engineer to work on core Google Search interface features using Angular and Web Components.",
        notes: "Recruiter screen went great. Tech screen scheduled for next week."
      },
      {
        companyName: "Meta",
        title: "Product Engineer - Instagram",
        status: "screening" as const,
        priority: "high" as const,
        location: "Menlo Park, CA (Onsite)",
        workMode: "onsite" as const,
        employmentType: "full_time" as const,
        salaryMin: 190000,
        salaryMax: 260000,
        salaryCurrency: "USD",
        appliedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        nextActionAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // in 1 day
        description: "Instagram Product team is looking for a frontend-heavy fullstack engineer to ship features using React and React Native.",
        notes: "Completed the initial recruiter call, waiting for online assessment links."
      },
      {
        companyName: "Stripe",
        title: "Backend Engineer - Billing Platforms",
        status: "applied" as const,
        priority: "medium" as const,
        location: "Remote (US)",
        workMode: "remote" as const,
        employmentType: "full_time" as const,
        salaryMin: 160000,
        salaryMax: 210000,
        salaryCurrency: "USD",
        appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        description: "Design, build and maintain billing APIs for Stripe. Strong experience in Ruby, Go or Java is required.",
        notes: "Applied via referral from former coworker."
      },
      {
        companyName: "Airbnb",
        title: "Frontend Engineer - Guest Experience",
        status: "saved" as const,
        priority: "medium" as const,
        location: "San Francisco, CA (Hybrid)",
        workMode: "hybrid" as const,
        employmentType: "full_time" as const,
        salaryMin: 150000,
        salaryMax: 195000,
        salaryCurrency: "USD",
        description: "Build features for the guest-facing flow on Airbnb's core application, optimizing accessibility and speed.",
        notes: "Found this job posting on LinkedIn. Planning to request referral before applying."
      },
      {
        companyName: "Linear",
        title: "Fullstack Engineer",
        status: "offer" as const,
        priority: "high" as const,
        location: "Remote",
        workMode: "remote" as const,
        employmentType: "full_time" as const,
        salaryMin: 140000,
        salaryMax: 180000,
        salaryCurrency: "EUR",
        appliedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        notes: "Offer received! Need to negotiate benefits and start date."
      }
    ];

    for (const appInfo of mockApplications) {
      const company = companiesMap[appInfo.companyName];
      if (!company) continue;

      // Check if job application already exists
      const existing = await prisma.jobApplication.findFirst({
        where: { userId: user.id, companyId: company.id, title: appInfo.title }
      });

      if (!existing) {
        await prisma.jobApplication.create({
          data: {
            userId: user.id,
            companyId: company.id,
            title: appInfo.title,
            status: appInfo.status,
            priority: appInfo.priority,
            location: appInfo.location,
            workMode: appInfo.workMode,
            employmentType: appInfo.employmentType,
            salaryMin: appInfo.salaryMin,
            salaryMax: appInfo.salaryMax,
            salaryCurrency: appInfo.salaryCurrency,
            appliedAt: appInfo.appliedAt || null,
            nextActionAt: appInfo.nextActionAt || null,
            description: appInfo.description || null,
            notes: appInfo.notes || null,
          }
        });
        console.log(`Created job application: ${appInfo.title} at ${appInfo.companyName}`);
      } else {
        console.log(`Job application already exists: ${appInfo.title} at ${appInfo.companyName}`);
      }
    }
  }
}

main()
  .catch(e => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
