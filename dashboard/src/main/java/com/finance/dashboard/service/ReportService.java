package com.finance.dashboard.service;

import com.finance.dashboard.model.Record;
import com.finance.dashboard.model.RecordType;
import com.finance.dashboard.model.Report;
import com.finance.dashboard.model.ReportType;
import com.finance.dashboard.model.User;
import com.finance.dashboard.repository.RecordRepository;
import com.finance.dashboard.repository.ReportRepository;
import com.finance.dashboard.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.List;

@Service
public class ReportService {

    private final ReportRepository reportRepo;
    private final RecordRepository recordRepo;
    private final UserRepository userRepo;

    public ReportService(ReportRepository reportRepo,
                         RecordRepository recordRepo,
                         UserRepository userRepo) {
        this.reportRepo = reportRepo;
        this.recordRepo = recordRepo;
        this.userRepo = userRepo;
    }

    // ─── Generate Monthly Report ───────────────────────────────────

    public Report generateMonthly(String userEmail) {
        LocalDate now = LocalDate.now();
        LocalDate start = now.with(TemporalAdjusters.firstDayOfMonth());
        LocalDate end = now.with(TemporalAdjusters.lastDayOfMonth());
        String name = "Monthly Financial Report - " + now.getMonth() + " " + now.getYear();
        return generateReport(userEmail, name, ReportType.MONTHLY, start, end);
    }

    // ─── Generate Quarterly Report ─────────────────────────────────

    public Report generateQuarterly(String userEmail) {
        LocalDate now = LocalDate.now();
        int quarter = (now.getMonthValue() - 1) / 3;
        LocalDate start = LocalDate.of(now.getYear(), quarter * 3 + 1, 1);
        LocalDate end = start.plusMonths(3).minusDays(1);
        String name = "Quarterly Financial Report - Q" + (quarter + 1) + " " + now.getYear();
        return generateReport(userEmail, name, ReportType.QUARTERLY, start, end);
    }

    // ─── Generate Annual Report ────────────────────────────────────

    public Report generateAnnual(String userEmail) {
        LocalDate now = LocalDate.now();
        LocalDate start = LocalDate.of(now.getYear(), 1, 1);
        LocalDate end = LocalDate.of(now.getYear(), 12, 31);
        String name = "Annual Financial Report - " + now.getYear();
        return generateReport(userEmail, name, ReportType.ANNUAL, start, end);
    }

    // ─── Generate Custom Report ────────────────────────────────────

    public Report generateCustom(String userEmail, LocalDate start, LocalDate end) {
        if (start == null || end == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Start and end dates are required.");
        }
        if (start.isAfter(end)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Start date must be before end date.");
        }
        String name = "Custom Report - " + start + " to " + end;
        return generateReport(userEmail, name, ReportType.CUSTOM, start, end);
    }

    // ─── Fetch all reports for a user ──────────────────────────────

    public List<Report> getUserReports(String userEmail) {
        return reportRepo.findByUserEmailOrderByGeneratedDateDesc(userEmail);
    }

    // ─── Delete a report ───────────────────────────────────────────

    public void deleteReport(Long id) {
        if (!reportRepo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Report not found.");
        }
        reportRepo.deleteById(id);
    }

    // ─── Core report generation logic ──────────────────────────────

    private Report generateReport(String userEmail, String name,
                                  ReportType type, LocalDate start, LocalDate end) {
        User user = userRepo.findByEmail(userEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        // Fetch user's records in the date range
        List<Record> allRecords = recordRepo.findByUserEmail(userEmail);
        List<Record> periodRecords = allRecords.stream()
                .filter(r -> !r.getDate().isBefore(start) && !r.getDate().isAfter(end))
                .toList();

        double income = periodRecords.stream()
                .filter(r -> r.getType() == RecordType.INCOME)
                .mapToDouble(Record::getAmount)
                .sum();

        double expense = periodRecords.stream()
                .filter(r -> r.getType() == RecordType.EXPENSE)
                .mapToDouble(Record::getAmount)
                .sum();

        double balance = income - expense;
        int txCount = periodRecords.size();

        // Calculate growth vs. previous period of equal length
        long daysBetween = java.time.temporal.ChronoUnit.DAYS.between(start, end) + 1;
        LocalDate prevStart = start.minusDays(daysBetween);
        LocalDate prevEnd = start.minusDays(1);

        double prevIncome = allRecords.stream()
                .filter(r -> r.getType() == RecordType.INCOME)
                .filter(r -> !r.getDate().isBefore(prevStart) && !r.getDate().isAfter(prevEnd))
                .mapToDouble(Record::getAmount)
                .sum();

        double growth = 0.0;
        if (prevIncome > 0) {
            growth = ((income - prevIncome) / prevIncome) * 100;
            growth = Math.round(growth * 100.0) / 100.0; // 2 decimal places
        }

        Report report = Report.builder()
                .name(name)
                .reportType(type)
                .generatedDate(LocalDate.now())
                .periodStart(start)
                .periodEnd(end)
                .totalIncome(income)
                .totalExpense(expense)
                .balance(balance)
                .transactionCount(txCount)
                .growthPercent(growth)
                .user(user)
                .build();

        return reportRepo.save(report);
    }
}
