package com.finance.dashboard.controller;

import com.finance.dashboard.service.PerformanceService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/dashboard/performance")
public class PerformanceController {

    private final PerformanceService service;

    public PerformanceController(PerformanceService service) {
        this.service = service;
    }

    /**
     * GET /dashboard/performance
     * Returns:
     *   - balanceTrend: list of { month, balance } for the last 6/12 months
     *   - spendingByCategory: list of { category, total } for expense breakdown
     */
    @PreAuthorize("hasAnyRole('ADMIN', 'ANALYST', 'VIEWER')")
    @GetMapping
    public Map<String, Object> getPerformance(
            Authentication auth,
            @RequestParam(defaultValue = "6") int months) {
        return service.getPerformanceData(auth.getName(), months);
    }
}
