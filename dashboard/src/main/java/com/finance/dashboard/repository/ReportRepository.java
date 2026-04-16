package com.finance.dashboard.repository;

import com.finance.dashboard.model.Report;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReportRepository extends JpaRepository<Report, Long> {

    /** Fetch all reports for a specific user, newest first */
    List<Report> findByUserEmailOrderByGeneratedDateDesc(String email);
}
