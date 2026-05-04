package com.finance.dashboard.service;

import com.finance.dashboard.model.Record;
import com.finance.dashboard.model.RecordType;
import com.finance.dashboard.repository.RecordRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PerformanceService {

    private final RecordRepository repo;

    public PerformanceService(RecordRepository repo) {
        this.repo = repo;
    }

    /**
     * Builds performance analytics for the given user:
     *   1. balanceTrend  — cumulative balance at end of each month
     *   2. spendingByCategory — total expense per category
     */
    public Map<String, Object> getPerformanceData(String userEmail, int months) {

        List<Record> allRecords = repo.findByUserEmail(userEmail);
        LocalDate now = LocalDate.now();
        LocalDate cutoff = now.minusMonths(months).withDayOfMonth(1);

        // ─── 1. Balance Trend ───────────────────────────────────
        // Group records by month and compute cumulative balance
        DateTimeFormatter monthFmt = DateTimeFormatter.ofPattern("MMM yyyy");
        List<Map<String, Object>> balanceTrend = new ArrayList<>();

        double runningBalance = 0;
        for (int i = months; i >= 0; i--) {
            YearMonth ym = YearMonth.from(now.minusMonths(i));
            LocalDate monthStart = ym.atDay(1);
            LocalDate monthEnd = ym.atEndOfMonth();

            for (Record r : allRecords) {
                if (r.getDate() != null
                        && !r.getDate().isBefore(monthStart)
                        && !r.getDate().isAfter(monthEnd)) {
                    if (r.getType() == RecordType.INCOME) {
                        runningBalance += r.getAmount();
                    } else {
                        runningBalance -= r.getAmount();
                    }
                }
            }

            Map<String, Object> point = new LinkedHashMap<>();
            point.put("month", ym.format(monthFmt));
            point.put("balance", Math.round(runningBalance * 100.0) / 100.0);
            balanceTrend.add(point);
        }

        // ─── 2. Spending by Category ────────────────────────────
        Map<String, Double> categoryTotals = allRecords.stream()
                .filter(r -> r.getType() == RecordType.EXPENSE)
                .filter(r -> r.getDate() != null && !r.getDate().isBefore(cutoff))
                .collect(Collectors.groupingBy(
                        r -> r.getCategory() != null ? r.getCategory() : "Other",
                        Collectors.summingDouble(Record::getAmount)));

        List<Map<String, Object>> spendingByCategory = categoryTotals.entrySet().stream()
                .sorted(Map.Entry.<String, Double>comparingByValue().reversed())
                .map(e -> {
                    Map<String, Object> item = new LinkedHashMap<>();
                    item.put("category", e.getKey());
                    item.put("total", Math.round(e.getValue() * 100.0) / 100.0);
                    return item;
                })
                .collect(Collectors.toList());

        // ─── 3. Income vs Expense per month (for bar comparison) ─
        List<Map<String, Object>> monthlyComparison = new ArrayList<>();
        for (int i = months; i >= 0; i--) {
            YearMonth ym = YearMonth.from(now.minusMonths(i));
            LocalDate monthStart = ym.atDay(1);
            LocalDate monthEnd = ym.atEndOfMonth();

            double inc = 0, exp = 0;
            for (Record r : allRecords) {
                if (r.getDate() != null
                        && !r.getDate().isBefore(monthStart)
                        && !r.getDate().isAfter(monthEnd)) {
                    if (r.getType() == RecordType.INCOME) {
                        inc += r.getAmount();
                    } else {
                        exp += r.getAmount();
                    }
                }
            }

            Map<String, Object> row = new LinkedHashMap<>();
            row.put("month", ym.format(monthFmt));
            row.put("income", Math.round(inc * 100.0) / 100.0);
            row.put("expense", Math.round(exp * 100.0) / 100.0);
            monthlyComparison.add(row);
        }

        // ─── Assemble response ──────────────────────────────────
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("balanceTrend", balanceTrend);
        result.put("spendingByCategory", spendingByCategory);
        result.put("monthlyComparison", monthlyComparison);
        return result;
    }
}
