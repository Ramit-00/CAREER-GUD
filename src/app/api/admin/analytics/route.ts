import { getJwtSecret } from '@/lib/auth/jwtSecret';
import { prisma } from '@/lib/prisma';
import { repository } from '@/lib/data/repository';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({
      req,
      secret: getJwtSecret(),
    });
    if (!token || token.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const [
      totalStudents,
      totalConsultants,
      pendingConsultants,
      totalBookings,
      totalQuizzes,
      careers,
      colleges,
      streamCounts,
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'STUDENT' } }),
      prisma.user.count({ where: { role: 'CONSULTANT' } }),
      prisma.consultantProfile.count({ where: { verificationStatus: 'PENDING' } }),
      prisma.consultationBooking.count(),
      prisma.quizAttempt.count(),
      repository.getCareers(),
      repository.getColleges(),
      prisma.studentProfile.groupBy({
        by: ['currentStream'],
        _count: { currentStream: true },
      }),
    ]);

    // Stream distribution calculation
    const streamDistribution: Record<string, number> = {
      SCIENCE_PCM: 0,
      SCIENCE_PCB: 0,
      SCIENCE_PCMB: 0,
      COMMERCE_MATHS: 0,
      COMMERCE_NO_MATHS: 0,
      ARTS: 0,
      VOCATIONAL: 0,
    };

    streamCounts.forEach((s) => {
      if (s.currentStream && streamDistribution[s.currentStream] !== undefined) {
        streamDistribution[s.currentStream] = s._count.currentStream;
      }
    });

    // Curated trending hype careers with market growth indices
    const trendingCareers = [
      {
        title: 'AI & Autonomous Systems Engineer',
        domain: 'Tech & AI',
        hypeScore: 98,
        growthRate: '+38% YoY',
        avgSalary: '₹18 - ₹42 LPA',
        status: 'Surging Demand',
      },
      {
        title: 'Semiconductor & VLSI Chip Designer',
        domain: 'Tech & AI',
        hypeScore: 94,
        growthRate: '+45% YoY (India Semiconductor Mission)',
        avgSalary: '₹16 - ₹36 LPA',
        status: 'National Priority',
      },
      {
        title: 'Cloud Infrastructure & Security Architect',
        domain: 'Tech & AI',
        hypeScore: 91,
        growthRate: '+29% YoY',
        avgSalary: '₹17 - ₹38 LPA',
        status: 'Sustained Expansion',
      },
      {
        title: 'Quantitative Finance & Algorithmic Trader',
        domain: 'Finance & Commerce',
        hypeScore: 96,
        growthRate: '+27% YoY',
        avgSalary: '₹22 - ₹65 LPA',
        status: 'High Remuneration',
      },
      {
        title: 'Fintech & Risk Modeling Analyst',
        domain: 'Finance & Commerce',
        hypeScore: 90,
        growthRate: '+26% YoY',
        avgSalary: '₹14 - ₹28 LPA',
        status: 'High Demand',
      },
      {
        title: 'Genomics & Precision Healthcare Researcher',
        domain: 'Medical & Bio',
        hypeScore: 89,
        growthRate: '+31% YoY',
        avgSalary: '₹14 - ₹30 LPA',
        status: 'Emerging High Growth',
      },
      {
        title: 'Clinical Bioinformatician & Data Scientist',
        domain: 'Medical & Bio',
        hypeScore: 93,
        growthRate: '+35% YoY',
        avgSalary: '₹15 - ₹32 LPA',
        status: 'Global Shortage',
      },
      {
        title: 'IP & Corporate Cyber Law Specialist',
        domain: 'Law & Policy',
        hypeScore: 88,
        growthRate: '+24% YoY',
        avgSalary: '₹12 - ₹30 LPA',
        status: 'Steady Expansion',
      },
      {
        title: 'Industrial & Spatial Experience Designer',
        domain: 'Creative & Design',
        hypeScore: 87,
        growthRate: '+22% YoY',
        avgSalary: '₹12 - ₹26 LPA',
        status: 'Creative Frontier',
      },
    ];

    return NextResponse.json({
      totalStudents,
      totalConsultants,
      pendingConsultants,
      totalBookings,
      totalQuizzes,
      totalCareers: careers.length,
      totalColleges: colleges.length,
      streamDistribution,
      trendingCareers,
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ error: 'Failed to retrieve analytics' }, { status: 500 });
  }
}

