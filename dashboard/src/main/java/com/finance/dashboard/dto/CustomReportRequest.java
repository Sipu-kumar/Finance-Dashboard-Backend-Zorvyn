package com.finance.dashboard.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class CustomReportRequest {
    private LocalDate startDate;
    private LocalDate endDate;
}
