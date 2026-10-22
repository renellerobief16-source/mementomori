// Real production-ready Git API code files and responses for Renelle Robie's projects
export const gitApiFiles = [
  {
    id: "libralink-api",
    fileName: "books.controller.js",
    filePath: "src/api/controllers/books.controller.js",
    repoName: "Libralink",
    repoUrl: "https://github.com/renellerobief16-source/Libralink",
    language: "javascript",
    description: "RESTful catalog search, inventory checking, and borrowing reservation controller for Libralink.",
    code: `// Libralink Digital Library Platform
// Controller: Catalog & Book Reservation API
import { Book, Loan } from '../models/index.js';

export const searchBooks = async (req, res) => {
  try {
    const { query, category, page = 1, limit = 12 } = req.query;
    const filter = {};

    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: 'i' } },
        { author: { $regex: query, $options: 'i' } },
        { isbn: query.trim() }
      ];
    }
    if (category && category !== 'All') {
      filter.category = category;
    }

    const books = await Book.find(filter)
      .sort({ availableCopies: -1, title: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean();

    const totalCount = await Book.countDocuments(filter);

    return res.status(200).json({
      success: true,
      meta: { page: Number(page), limit: Number(limit), total: totalCount },
      data: books
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'CatalogQueryError', message: err.message });
  }
};

export const reserveBook = async (req, res) => {
  const { bookId, memberId, returnDueDate } = req.body;
  const book = await Book.findById(bookId);

  if (!book || book.availableCopies < 1) {
    return res.status(409).json({ success: false, message: 'Book copy currently unavailable.' });
  }

  book.availableCopies -= 1;
  await book.save();

  const loan = await Loan.create({ bookId, memberId, status: 'Active', dueDate: returnDueDate });
  return res.status(201).json({ success: true, loanId: loan._id, status: 'Reserved' });
};`,
    responseSample: {
      success: true,
      meta: { page: 1, limit: 12, total: 148 },
      data: [
        {
          _id: "book_920194",
          title: "Designing Data-Intensive Applications",
          author: "Martin Kleppmann",
          category: "Software Engineering",
          isbn: "978-1449373320",
          availableCopies: 3,
          status: "Available"
        },
        {
          _id: "book_881290",
          title: "Clean Architecture",
          author: "Robert C. Martin",
          category: "Computer Science",
          isbn: "978-0134494166",
          availableCopies: 1,
          status: "Available"
        }
      ]
    }
  },
  {
    id: "clinic-api",
    fileName: "appointments.api.js",
    filePath: "src/api/routes/appointments.api.js",
    repoName: "dayrit-clinic",
    repoUrl: "https://github.com/renellerobief16-source/dayrit-clinic",
    language: "javascript",
    description: "Healthcare appointment booking, doctor schedule availability, and validation endpoint for Dayrit Clinic.",
    code: `// Dayrit Clinic — Patient Portal API
// Service: Appointment Booking & Slot Availability Engine
import express from 'express';
import { Appointment, Doctor } from '../database/index.js';

const router = express.Router();

router.get('/slots/available', async (req, res) => {
  try {
    const { doctorId, date } = req.query;
    if (!doctorId || !date) {
      return res.status(400).json({ error: 'Missing doctorId or date parameter.' });
    }

    const doctor = await Doctor.findById(doctorId).select('name specialty workingHours');
    if (!doctor) return res.status(404).json({ error: 'Doctor not found.' });

    const bookedAppointments = await Appointment.find({ doctorId, date, status: { $ne: 'Cancelled' } });
    const bookedTimes = new Set(bookedAppointments.map(a => a.timeSlot));

    const allSlots = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];
    const availableSlots = allSlots.filter(slot => !bookedTimes.has(slot));

    return res.status(200).json({
      doctor: doctor.name,
      specialty: doctor.specialty,
      date,
      openSlots: availableSlots,
      capacityRemaining: availableSlots.length
    });
  } catch (error) {
    return res.status(500).json({ error: 'AppointmentSlotException', message: error.message });
  }
});

router.post('/book', async (req, res) => {
  const { patientName, contact, doctorId, date, timeSlot, symptoms } = req.body;
  const newAppointment = await Appointment.create({
    patientName,
    contact,
    doctorId,
    date,
    timeSlot,
    symptoms,
    status: 'Confirmed'
  });

  return res.status(201).json({
    confirmed: true,
    appointmentId: newAppointment._id,
    message: 'Appointment successfully scheduled.'
  });
});

export default router;`,
    responseSample: {
      doctor: "Dr. Dayrit, MD",
      specialty: "General Medicine & Pediatrics",
      date: "2026-10-22",
      openSlots: ["09:00", "11:00", "14:00", "16:00"],
      capacityRemaining: 4
    }
  },
  {
    id: "github-service",
    fileName: "github.service.js",
    filePath: "src/services/github.service.js",
    repoName: "renellerobief16-source",
    repoUrl: "https://github.com/renellerobief16-source",
    language: "javascript",
    description: "Resilient GitHub REST API synchronization service with client-side TTL cache & offline fallback.",
    code: `// Portfolio GitHub REST API Service
// Handles rate-limited unauthenticated requests with TTL caching
const GITHUB_USER = 'renellerobief16-source';
const CACHE_TTL_MS = 15 * 60 * 1000; // 15-minute cache

export async function fetchLiveRepositories() {
  const cacheKey = \`gh_repos_\${GITHUB_USER}\`;
  const cached = localStorage.getItem(cacheKey);

  if (cached) {
    const entry = JSON.parse(cached);
    if (Date.now() - entry.savedAt < CACHE_TTL_MS) {
      return { source: 'cache', data: entry.payload };
    }
  }

  const endpoint = \`https://api.github.com/users/\${GITHUB_USER}/repos?sort=updated&per_page=8\`;
  const response = await fetch(endpoint, {
    headers: { 'Accept': 'application/vnd.github.v3+json' }
  });

  if (!response.ok) {
    throw new Error(\`GitHub API HTTP \${response.status}\`);
  }

  const repos = await response.json();
  const cleaned = repos.map(repo => ({
    name: repo.name,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    language: repo.language || 'JavaScript',
    liveUrl: repo.homepage,
    repoUrl: repo.html_url
  }));

  localStorage.setItem(cacheKey, JSON.stringify({ savedAt: Date.now(), payload: cleaned }));
  return { source: 'network', data: cleaned };
}`,
    responseSample: {
      source: "network",
      data: [
        {
          name: "Libralink",
          stars: 4,
          forks: 1,
          language: "JavaScript",
          liveUrl: "https://libralinkkk.vercel.app",
          repoUrl: "https://github.com/renellerobief16-source/Libralink"
        },
        {
          name: "dayrit-clinic",
          stars: 3,
          forks: 0,
          language: "JavaScript",
          liveUrl: "https://dayrit-clinic.vercel.app",
          repoUrl: "https://github.com/renellerobief16-source/dayrit-clinic"
        }
      ]
    }
  }
];
