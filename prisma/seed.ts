import "dotenv/config";
import "dotenv/config";
import { db } from "../src/lib/db";
import bcrypt from "bcryptjs";
import { SAMPLE_DONORS, SAMPLE_BLOOD_REQUESTS, SAMPLE_VOLUNTEERS } from "../src/data/badhon-seed";

async function main() {
  console.log("Seeding database with memorable user credentials and Badhon records...");

  const hashPassword = async (pass: string) => {
    return await bcrypt.hash(pass, 10);
  };

  // 1. Seed Core Test Users with Memorable Credentials
  const testUsers = [
    {
      username: "member1",
      password: "member1",
      name: "Tanvir Hasan",
      phone: "01711000001",
      email: "member1@badhon.du.ac.bd",
      studentId: "2021-042-108",
      department: "Computer Science & Engineering",
      hallUnit: "Fazlul Huq Muslim Hall",
      role: "VOLUNTEER",
      avatarBg: "#e11d48",
      bloodGroup: "B+",
      bio: "Active voluntary blood transfusion coordinator at FH Hall unit.",
    },
    {
      username: "member2",
      password: "member2",
      name: "Kazi Farhan",
      phone: "01711000002",
      email: "member2@badhon.du.ac.bd",
      studentId: "2021-019-301",
      department: "Physics",
      hallUnit: "Shahidullah Hall",
      role: "VOLUNTEER",
      avatarBg: "#0284c7",
      bloodGroup: "O+",
      bio: "Shahidullah Hall Badhon executive donor coordinator.",
    },
    {
      username: "member3",
      password: "member3",
      name: "Nahid Parvez",
      phone: "01711000003",
      email: "member3@badhon.du.ac.bd",
      studentId: "2020-033-219",
      department: "Chemistry",
      hallUnit: "Amar Ekushey Hall",
      role: "VOLUNTEER",
      avatarBg: "#16a34a",
      bloodGroup: "A+",
      bio: "Amar Ekushey Hall voluntary blood donor and coordinator.",
    },
    {
      username: "president1",
      password: "president1",
      name: "Shahadat Hossain",
      phone: "01711000004",
      email: "president1@badhon.du.ac.bd",
      studentId: "2019-015-102",
      department: "Pharmacy",
      hallUnit: "Fazlul Huq Muslim Hall",
      role: "PRESIDENT",
      avatarBg: "#7c3aed",
      bloodGroup: "AB+",
      bio: "President of DU Badhon Fazlul Huq Muslim Hall Unit (2025-2026).",
    },
    {
      username: "secretary1",
      password: "secretary1",
      name: "Rafiqul Bashar",
      phone: "01711000005",
      email: "secretary1@badhon.du.ac.bd",
      studentId: "2020-022-411",
      department: "Biochemistry & Molecular Biology",
      hallUnit: "Shahidullah Hall",
      role: "GENERAL_SECRETARY",
      avatarBg: "#ea580c",
      bloodGroup: "O-",
      bio: "General Secretary of DU Badhon Shahidullah Hall Unit.",
    },
    {
      username: "admin",
      password: "admin",
      name: "Saikat Islam",
      phone: "01711000000",
      email: "saikat@badhon.du.ac.bd",
      studentId: "2019-001-001",
      department: "Computer Science & Engineering",
      hallUnit: "Surja Sen Hall",
      role: "ADMIN",
      avatarBg: "#b91c1c",
      bloodGroup: "A+",
      bio: "Lead Developer & Central Executive Administrator for DU Badhon platform.",
    },
  ];

  // Map of username -> user record
  const createdUsers: Record<string, { id: string; name: string }> = {};

  for (const u of testUsers) {
    const passwordHash = await hashPassword(u.password);
    const existing = await db.user.findFirst({
      where: {
        OR: [{ username: u.username }, { phone: u.phone }, { email: u.email }],
      },
    });

    if (existing) {
      const updated = await db.user.update({
        where: { id: existing.id },
        data: {
          username: u.username,
          passwordHash,
          name: u.name,
          department: u.department,
          hallUnit: u.hallUnit,
          role: u.role,
          avatarBg: u.avatarBg,
          bloodGroup: u.bloodGroup,
          bio: u.bio,
        },
      });
      createdUsers[u.username] = { id: updated.id, name: updated.name };
      console.log(`Updated user: ${u.username} / ${u.password}`);
    } else {
      const created = await db.user.create({
        data: {
          username: u.username,
          passwordHash,
          name: u.name,
          phone: u.phone,
          email: u.email,
          studentId: u.studentId,
          department: u.department,
          hallUnit: u.hallUnit,
          role: u.role,
          avatarBg: u.avatarBg,
          bloodGroup: u.bloodGroup,
          bio: u.bio,
        },
      });
      createdUsers[u.username] = { id: created.id, name: created.name };
      console.log(`Created user: ${u.username} / ${u.password}`);
    }
  }

  // 2. Also Seed any additional volunteers from SAMPLE_VOLUNTEERS as members
  for (const vol of SAMPLE_VOLUNTEERS) {
    const volUsername = vol.name.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 10);
    const existing = await db.user.findFirst({
      where: {
        OR: [{ studentId: vol.studentId }, { phone: vol.phone }],
      },
    });

    if (!existing) {
      const passwordHash = await hashPassword(volUsername || "member1");
      await db.user.create({
        data: {
          username: volUsername,
          passwordHash,
          name: vol.name,
          phone: vol.phone,
          studentId: vol.studentId,
          department: vol.department || "General",
          hallUnit: vol.hallUnit,
          role: vol.role.toUpperCase().replace(/\s+/g, "_"),
          avatarBg: vol.avatarBg,
        },
      });
    }
  }

  // 3. Seed Donors
  console.log(`Seeding ${SAMPLE_DONORS.length} Donors...`);
  for (const d of SAMPLE_DONORS) {
    const existing = await db.donor.findUnique({ where: { phone: d.phone } });
    if (!existing) {
      await db.donor.create({
        data: {
          id: d.id,
          name: d.name,
          phone: d.phone,
          bloodGroup: d.bloodGroup,
          hallUnit: d.hallUnit,
          department: d.department,
          session: d.session,
          isAvailable: d.isAvailable,
          totalDonations: d.totalDonations,
          lastDonationDate: d.lastDonationDate,
        },
      });
    }
  }

  // 4. Seed Blood Requests and Bag Slots
  console.log(`Seeding ${SAMPLE_BLOOD_REQUESTS.length} Blood Requests...`);
  for (const r of SAMPLE_BLOOD_REQUESTS) {
    const existing = await db.bloodRequest.findUnique({ where: { id: r.id } });
    if (!existing) {
      await db.bloodRequest.create({
        data: {
          id: r.id,
          patientName: r.patientName,
          hospital: r.hospital,
          contactPerson: r.contactPerson,
          contactPhone: r.contactPhone,
          bloodGroup: r.bloodGroup,
          isPlasma: r.isPlasma,
          totalBags: r.totalBags,
          managedBags: r.managedBags,
          urgency: r.urgency,
          dateNeeded: r.dateNeeded,
          reason: r.reason,
          notes: r.notes,
          status: r.status,
          cancellationReason: r.cancellationReason,
          visibleUnits: JSON.stringify(r.visibleUnits || []),
          createdById: createdUsers["member1"]?.id || null,
          managedById: createdUsers["member1"]?.id || null,
          bagSlots: {
            create: r.assignedBags.map((bag) => ({
              bagNumber: bag.bagNumber,
              donorId: bag.donorId,
              donorName: bag.donorName,
              donorPhone: bag.donorPhone,
              donorHall: bag.donorHall,
              status: bag.status,
              assignedAt: bag.assignedAt ? new Date(bag.assignedAt) : null,
              managedById: createdUsers["member1"]?.id || null,
            })),
          },
        },
      });
    }
  }

  console.log("Database seeded successfully with memorable accounts!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
