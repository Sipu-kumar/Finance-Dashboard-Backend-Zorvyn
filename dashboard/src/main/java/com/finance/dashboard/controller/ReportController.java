package com.finance.dashboard.controller;

import com.finance.dashboard.dto.CustomReportRequest;
import com.finance.dashboard.model.Report;
import com.finance.dashboard.service.ReportService;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reports")
public class ReportController {

    private final ReportService service;

    public ReportController(ReportService service) {
        this.service = service;
    }

    /** Generate a monthly report for the current user */
    @PreAuthorize("hasAnyRole('ADMIN', 'ANALYST', 'VIEWER')")
    @PostMapping("/monthly")
    @ResponseStatus(HttpStatus.CREATED)
    public Report generateMonthly(Authentication auth) {
        return service.generateMonthly(auth.getName());
    }

    /** Generate a quarterly report for the current user */
    @PreAuthorize("hasAnyRole('ADMIN', 'ANALYST', 'VIEWER')")
    @PostMapping("/quarterly")
    @ResponseStatus(HttpStatus.CREATED)
    public Report generateQuarterly(Authentication auth) {
        return service.generateQuarterly(auth.getName());
    }

    /** Generate an annual report for the current user */
    @PreAuthorize("hasAnyRole('ADMIN', 'ANALYST', 'VIEWER')")
    @PostMapping("/annual")
    @ResponseStatus(HttpStatus.CREATED)
    public Report generateAnnual(Authentication auth) {
        return service.generateAnnual(auth.getName());
    }

    /** Generate a custom date range report for the current user */
    @PreAuthorize("hasAnyRole('ADMIN', 'ANALYST', 'VIEWER')")
    @PostMapping("/custom")
    @ResponseStatus(HttpStatus.CREATED)
    public Report generateCustom(@RequestBody CustomReportRequest request,
                                 Authentication auth) {
        return service.generateCustom(auth.getName(), request.getStartDate(), request.getEndDate());
    }

    /** Get all reports for the current user */
    @PreAuthorize("hasAnyRole('ADMIN', 'ANALYST', 'VIEWER')")
    @GetMapping
    public List<Report> getAll(Authentication auth) {
        return service.getUserReports(auth.getName());
    }

    /** Delete a report by ID (ADMIN only) */
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.deleteReport(id);
    }
}
