package com.finance.dashboard.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "payments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String payeeName;

    private Double amount;

    private String method; // UPI, CARD, BANK_TRANSFER, WALLET

    @Enumerated(EnumType.STRING)
    private PaymentStatus status; // COMPLETED, PENDING, FAILED, SCHEDULED

    private String category; // Bills, Rent, Subscription, Transfer, etc.

    private String referenceId;

    private String notes;

    private LocalDate date;

    private LocalDate scheduledDate; // for upcoming/scheduled payments

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
