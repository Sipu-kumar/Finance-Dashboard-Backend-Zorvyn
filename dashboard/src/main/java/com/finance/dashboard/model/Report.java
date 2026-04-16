package com.finance.dashboard.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "reports")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Enumerated(EnumType.STRING)
    private ReportType reportType;

    private LocalDate generatedDate;

    private LocalDate periodStart;

    private LocalDate periodEnd;

    private Double totalIncome;

    private Double totalExpense;

    private Double balance;

    private Integer transactionCount;

    /** Growth percentage compared to previous period */
    private Double growthPercent;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
