package com.finance.dashboard.service;

import com.finance.dashboard.repository.RecordRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class DashboardService {

    private final RecordRepository repo;

    public DashboardService(RecordRepository repo) {
        this.repo = repo;
    }

    /**
     * Returns income/expense/balance summary for the given user only.
     */
    public Map<String, Double> getSummary(String userEmail) {

        Double income = repo.getTotalIncomeByUser(userEmail);
        Double expense = repo.getTotalExpenseByUser(userEmail);

        if (income == null) income = 0.0;
        if (expense == null) expense = 0.0;

        Double balance = income - expense;

        Map<String, Double> data = new HashMap<>();
        data.put("totalIncome", income);
        data.put("totalExpense", expense);
        data.put("balance", balance);

        return data;
    }
}