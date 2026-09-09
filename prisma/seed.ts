import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { SEED_CAREERS, SEED_COLLEGES, SEED_CONSULTANTS, SEED_USERS } from '../src/lib/data/seedData';

const prisma = new PrismaClient();

async function main() {
  if (process.env.NODE_ENV === 'production') {
    console.error('⛔ Refusing to seed database in production environment.');
    process.exit(1);
  }

  console.log('🌱 Starting Supabase seeding...');

  // 1. Seed Users with secure bcrypt password hashing
  for (const u of SEED_USERS) {
    const hashedPassword = await bcrypt.hash(u.password, 10);
    await prisma.user.upsert({
      where: { email: u.email },
      update: {
        name: u.name,
        role: u.role,
        // Security: Do NOT overwrite passwordHash for existing users!
      },
      create: {
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        passwordHash: hashedPassword,
      },
    });
  }
  console.log(`✅ Seeded ${SEED_USERS.length} users with bcrypt password hashes.`);

  // 2. Seed Careers
  for (const c of SEED_CAREERS) {
    await prisma.career.upsert({
      where: { slug: c.slug },
      update: {
        title: c.title,
        streamCategory: c.streamCategory,
        streamLabel: c.streamLabel,
        description: c.description,
        dayInTheLife: c.dayInTheLife,
        requiredSkills: c.requiredSkills,
        streamRequirement: c.eligibility.streamRequirement,
        mandatorySubjects: c.eligibility.mandatorySubjects,
        topEntranceExams: c.eligibility.topEntranceExams,
        typicalDegrees: c.eligibility.typicalDegrees,
        demandTrend: c.outlook.demandTrend,
        demandTrendLabel: c.outlook.demandTrendLabel,
        automationRiskScore: c.outlook.automationRiskScore,
        automationRiskLabel: c.outlook.automationRiskLabel,
        entrySalaryINR: c.outlook.avgSalaryRangeINR.entry,
        midSalaryINR: c.outlook.avgSalaryRangeINR.mid,
        seniorSalaryINR: c.outlook.avgSalaryRangeINR.senior,
        growthNotes: c.outlook.growthNotes,
        regionalDemandNotes: c.outlook.regionalDemandNotes,
        pathwaySteps: c.pathwaySteps as any,
        relatedCareers: c.relatedCareers,
        avgRating: c.avgRating,
        reviewCount: c.reviewCount,
      },
      create: {
        id: c.id,
        slug: c.slug,
        title: c.title,
        streamCategory: c.streamCategory,
        streamLabel: c.streamLabel,
        description: c.description,
        dayInTheLife: c.dayInTheLife,
        requiredSkills: c.requiredSkills,
        streamRequirement: c.eligibility.streamRequirement,
        mandatorySubjects: c.eligibility.mandatorySubjects,
        topEntranceExams: c.eligibility.topEntranceExams,
        typicalDegrees: c.eligibility.typicalDegrees,
        demandTrend: c.outlook.demandTrend,
        demandTrendLabel: c.outlook.demandTrendLabel,
        automationRiskScore: c.outlook.automationRiskScore,
        automationRiskLabel: c.outlook.automationRiskLabel,
        entrySalaryINR: c.outlook.avgSalaryRangeINR.entry,
        midSalaryINR: c.outlook.avgSalaryRangeINR.mid,
        seniorSalaryINR: c.outlook.avgSalaryRangeINR.senior,
        growthNotes: c.outlook.growthNotes,
        regionalDemandNotes: c.outlook.regionalDemandNotes,
        pathwaySteps: c.pathwaySteps as any,
        relatedCareers: c.relatedCareers,
        avgRating: c.avgRating,
        reviewCount: c.reviewCount,
      },
    });
  }
  console.log(`✅ Seeded ${SEED_CAREERS.length} careers.`);

  // 3. Seed Colleges & Programs
  for (const col of SEED_COLLEGES) {
    const createdCollege = await prisma.college.upsert({
      where: { slug: col.slug },
      update: {
        name: col.name,
        shortName: col.shortName,
        type: col.type,
        state: col.state,
        city: col.city,
        address: col.address,
        nirfRank: col.nirfRank,
        accreditation: col.accreditation,
        establishedYear: col.establishedYear,
        website: col.website,
        facilities: col.facilities,
        avgPackageINR: col.placementStats.avgPackageINR,
        highestPackageINR: col.placementStats.highestPackageINR,
        placementPercentage: col.placementStats.placementPercentage,
        topRecruiters: col.placementStats.topRecruiters,
        avgRating: col.avgRating,
        reviewCount: col.reviewCount,
        image: col.image,
      },
      create: {
        id: col.id,
        slug: col.slug,
        name: col.name,
        shortName: col.shortName,
        type: col.type,
        state: col.state,
        city: col.city,
        address: col.address,
        nirfRank: col.nirfRank,
        accreditation: col.accreditation,
        establishedYear: col.establishedYear,
        website: col.website,
        facilities: col.facilities,
        avgPackageINR: col.placementStats.avgPackageINR,
        highestPackageINR: col.placementStats.highestPackageINR,
        placementPercentage: col.placementStats.placementPercentage,
        topRecruiters: col.placementStats.topRecruiters,
        avgRating: col.avgRating,
        reviewCount: col.reviewCount,
        image: col.image,
      },
    });

    if (col.programs && col.programs.length > 0) {
      for (const p of col.programs) {
        await prisma.program.upsert({
          where: { id: p.id },
          update: {
            name: p.name,
            degreeLevel: p.degreeLevel,
            durationYears: p.durationYears,
            eligibility: p.eligibility,
            feesPerYearINR: p.feesPerYearINR,
            seatsAvailable: p.seatsAvailable,
            entranceExams: p.entranceExams,
            relatedCareers: p.relatedCareers,
            courses: p.courses as any,
          },
          create: {
            id: p.id,
            collegeId: createdCollege.id,
            name: p.name,
            degreeLevel: p.degreeLevel,
            durationYears: p.durationYears,
            eligibility: p.eligibility,
            feesPerYearINR: p.feesPerYearINR,
            seatsAvailable: p.seatsAvailable,
            entranceExams: p.entranceExams,
            relatedCareers: p.relatedCareers,
            courses: p.courses as any,
          },
        });
      }
    }
  }
  console.log(`✅ Seeded ${SEED_COLLEGES.length} colleges and programs.`);

  // 4. Seed Consultants & Domain Verifications
  for (const c of SEED_CONSULTANTS) {
    const cp = await prisma.consultantProfile.upsert({
      where: { userId: c.userId },
      update: {
        headline: c.headline,
        bio: c.bio,
        experienceYears: c.experienceYears,
        highestEducation: c.highestEducation,
        almaMater: c.almaMater,
        currentRole: c.currentRole,
        feePerSessionINR: c.feePerSessionINR,
        rating: c.rating,
        reviewCount: c.reviewCount,
        avatarUrl: c.avatarUrl,
      },
      create: {
        id: c.id,
        userId: c.userId,
        headline: c.headline,
        bio: c.bio,
        experienceYears: c.experienceYears,
        highestEducation: c.highestEducation,
        almaMater: c.almaMater,
        currentRole: c.currentRole,
        feePerSessionINR: c.feePerSessionINR,
        rating: c.rating,
        reviewCount: c.reviewCount,
        avatarUrl: c.avatarUrl,
      },
    });

    if (c.domainVerifications) {
      for (const dv of c.domainVerifications) {
        await prisma.consultantDomainVerification.upsert({
          where: {
            consultantId_domain: {
              consultantId: cp.id,
              domain: dv.domain as any,
            },
          },
          update: {
            status: dv.status as any,
            proofDescription: dv.proofDescription,
            adminNotes: dv.adminNotes,
            verifiedAt: dv.verifiedAt ? new Date(dv.verifiedAt) : undefined,
          },
          create: {
            consultantId: cp.id,
            domain: dv.domain as any,
            status: dv.status as any,
            proofDescription: dv.proofDescription,
            adminNotes: dv.adminNotes,
            verifiedAt: dv.verifiedAt ? new Date(dv.verifiedAt) : undefined,
          },
        });
      }
    }
  }
  console.log(`✅ Seeded ${SEED_CONSULTANTS.length} consultant profiles.`);

  console.log('🎉 Supabase PostgreSQL database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
